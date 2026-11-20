import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './entities/machine.entity';
import { ProductionLine } from '../production-lines/entities/production-line.entity';
import { ProductionRecord } from '../production-records/entities/production-record.entity';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, ProductionLine, ProductionRecord])],
  controllers: [MachinesController],
  providers: [MachinesService],
})
export class MachinesModule {}
