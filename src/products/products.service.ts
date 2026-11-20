import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductionRecord } from '../production-records/entities/production-record.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    @InjectRepository(ProductionRecord)
    private readonly recordsRepo: Repository<ProductionRecord>,
  ) {}

  create(dto: CreateProductDto) {
    return this.productsRepo.save(this.productsRepo.create(dto));
  }

  findAll(query: QueryProductDto) {
    const { page = 1, limit = 10, productType } = query;
    return this.productsRepo.find({
      where: productType ? { productType } : {},
      order: { productId: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { productId: id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found.`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const used = await this.recordsRepo.count({ where: { productId: id } });
    if (used > 0) {
      throw new ConflictException(
        'Product cannot be deleted. It already has production records.',
      );
    }
    await this.productsRepo.remove(product);
  }
}
