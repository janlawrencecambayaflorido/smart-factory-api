import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProductionRecord } from './entities/production-record.entity';
import { Product } from '../products/entities/product.entity';
import { Machine } from '../machines/entities/machine.entity';
import { CreateProductionRecordDto } from './dto/create-production-record.dto';
import { QueryProductionRecordDto } from './dto/query-production-record.dto';

@Injectable()
export class ProductionRecordsService {
  constructor(
    @InjectRepository(ProductionRecord)
    private readonly recordsRepo: Repository<ProductionRecord>,
    @InjectRepository(Product) private readonly productsRepo: Repository<Product>,
    @InjectRepository(Machine) private readonly machinesRepo: Repository<Machine>,
  ) {}

  async create(dto: CreateProductionRecordDto, userId: number) {
    // Business rule (Lab 06): defective cannot be more than produced
    if (dto.defectiveQuantity > dto.quantityProduced) {
      throw new BadRequestException('defectiveQuantity cannot exceed quantityProduced.');
    }
    if (!(await this.productsRepo.exists({ where: { productId: dto.productId } }))) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found.`);
    }
    if (!(await this.machinesRepo.exists({ where: { machineId: dto.machineId } }))) {
      throw new NotFoundException(`Machine with ID ${dto.machineId} not found.`);
    }
    const record = this.recordsRepo.create({
      ...dto,
      dateTime: new Date(dto.dateTime),
      recordedById: userId, // from the JWT
    });
    return this.recordsRepo.save(record);
  }

  findAll(query: QueryProductionRecordDto) {
    const { page = 1, limit = 10, productId, machineId } = query;
    const where: FindOptionsWhere<ProductionRecord> = {};
    if (productId) where.productId = productId;
    if (machineId) where.machineId = machineId;
    return this.recordsRepo.find({
      where,
      order: { dateTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const record = await this.recordsRepo.findOne({
      where: { recordId: id },
      relations: { product: true, machine: true, recordedBy: true },
    });
    if (!record) throw new NotFoundException(`Production record with ID ${id} not found.`);
    return record;
  }

  async remove(id: number) {
    const record = await this.recordsRepo.findOne({ where: { recordId: id } });
    if (!record) throw new NotFoundException(`Production record with ID ${id} not found.`);
    await this.recordsRepo.remove(record);
  }
}
