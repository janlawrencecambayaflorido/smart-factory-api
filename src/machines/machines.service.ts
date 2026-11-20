import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { ProductionLine } from '../production-lines/entities/production-line.entity';
import { ProductionRecord } from '../production-records/entities/production-record.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { QueryMachineDto } from './dto/query-machine.dto';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine) private readonly machinesRepo: Repository<Machine>,
    @InjectRepository(ProductionLine) private readonly linesRepo: Repository<ProductionLine>,
    @InjectRepository(ProductionRecord)
    private readonly recordsRepo: Repository<ProductionRecord>,
  ) {}

  private async ensureLineExists(productionLineId: number) {
    const exists = await this.linesRepo.exists({ where: { productionLineId } });
    if (!exists) {
      throw new NotFoundException(`Production line with ID ${productionLineId} not found.`);
    }
  }

  async create(dto: CreateMachineDto) {
    await this.ensureLineExists(dto.productionLineId);
    return this.machinesRepo.save(this.machinesRepo.create(dto));
  }

  findAll(query: QueryMachineDto) {
    const { page = 1, limit = 10, status, productionLineId } = query;
    const where: FindOptionsWhere<Machine> = {};
    if (status) where.status = status;
    if (productionLineId) where.productionLineId = productionLineId;
    return this.machinesRepo.find({
      where,
      order: { machineId: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const machine = await this.machinesRepo.findOne({
      where: { machineId: id },
      relations: { productionLine: true }, // JOIN production_lines
    });
    if (!machine) throw new NotFoundException(`Machine with ID ${id} not found.`);
    return machine;
  }

  async update(id: number, dto: UpdateMachineDto) {
    const machine = await this.machinesRepo.findOne({ where: { machineId: id } });
    if (!machine) throw new NotFoundException(`Machine with ID ${id} not found.`);
    if (dto.productionLineId) await this.ensureLineExists(dto.productionLineId);
    Object.assign(machine, dto);
    return this.machinesRepo.save(machine);
  }

  async remove(id: number) {
    const machine = await this.machinesRepo.findOne({ where: { machineId: id } });
    if (!machine) throw new NotFoundException(`Machine with ID ${id} not found.`);
    const used = await this.recordsRepo.count({ where: { machineId: id } });
    if (used > 0) {
      throw new ConflictException(
        'Machine cannot be deleted. It already has production records.',
      );
    }
    await this.machinesRepo.remove(machine);
  }
}
