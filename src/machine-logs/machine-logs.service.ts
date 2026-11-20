import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { MachineLog } from './entities/machine-log.entity';
import { Machine } from '../machines/entities/machine.entity';
import { CreateMachineLogDto } from './dto/create-machine-log.dto';
import { QueryMachineLogDto } from './dto/query-machine-log.dto';

@Injectable()
export class MachineLogsService {
  constructor(
    @InjectRepository(MachineLog) private readonly logsRepo: Repository<MachineLog>,
    private readonly dataSource: DataSource,
  ) {}

  // Saves the log AND updates the machine's current status in ONE transaction
  async create(dto: CreateMachineLogDto, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const machine = await manager.findOne(Machine, { where: { machineId: dto.machineId } });
      if (!machine) throw new NotFoundException(`Machine with ID ${dto.machineId} not found.`);

      machine.status = dto.status;
      await manager.save(machine);

      const log = manager.create(MachineLog, { ...dto, recordedById: userId });
      return manager.save(log);
    });
  }

  findAll(query: QueryMachineLogDto) {
    const { page = 1, limit = 10, machineId, status } = query;
    const where: FindOptionsWhere<MachineLog> = {};
    if (machineId) where.machineId = machineId;
    if (status) where.status = status;
    return this.logsRepo.find({
      where,
      order: { dateTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const log = await this.logsRepo.findOne({
      where: { logId: id },
      relations: { machine: true, recordedBy: true },
    });
    if (!log) throw new NotFoundException(`Machine log with ID ${id} not found.`);
    return log;
  }
}
