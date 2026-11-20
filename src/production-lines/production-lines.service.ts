import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionLine } from './entities/production-line.entity';
import { Machine } from '../machines/entities/machine.entity';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';
import { QueryProductionLineDto } from './dto/query-production-line.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

// Business logic layer: the controller calls this, this calls the repository (TypeORM -> MySQL)
@Injectable()
export class ProductionLinesService {
  constructor(
    @InjectRepository(ProductionLine) private readonly linesRepo: Repository<ProductionLine>,
    @InjectRepository(Machine) private readonly machinesRepo: Repository<Machine>,
  ) {}

  create(dto: CreateProductionLineDto) {
    const line = this.linesRepo.create(dto);
    return this.linesRepo.save(line); // INSERT INTO production_lines ...
  }

  findAll(query: QueryProductionLineDto) {
    const { page = 1, limit = 10, status } = query;
    return this.linesRepo.find({
      where: status ? { status } : {},
      order: { productionLineId: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const line = await this.linesRepo.findOne({ where: { productionLineId: id } });
    if (!line) throw new NotFoundException(`Production line with ID ${id} not found.`);
    return line;
  }

  // PUT - replace all editable fields
  async replace(id: number, dto: CreateProductionLineDto) {
    const line = await this.findOne(id);
    line.lineName = dto.lineName;
    line.location = dto.location;
    line.status = dto.status ?? line.status;
    return this.linesRepo.save(line);
  }

  // PATCH - update only the fields sent
  async update(id: number, dto: UpdateProductionLineDto) {
    const line = await this.findOne(id);
    Object.assign(line, dto);
    return this.linesRepo.save(line);
  }

  async remove(id: number) {
    const line = await this.findOne(id);
    const machineCount = await this.machinesRepo.count({ where: { productionLineId: id } });
    if (machineCount > 0) {
      throw new ConflictException(
        'Production line cannot be deleted. Existing machines are assigned to it.',
      );
    }
    await this.linesRepo.remove(line);
  }

  async findMachines(id: number, query: PaginationQueryDto) {
    await this.findOne(id); // 404 if the line does not exist
    const { page = 1, limit = 10 } = query;
    return this.machinesRepo.find({
      where: { productionLineId: id },
      order: { machineId: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
