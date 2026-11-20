import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineLog } from './entities/machine-log.entity';
import { Machine } from '../machines/entities/machine.entity';
import { MachineLogsService } from './machine-logs.service';
import { MachineLogsController } from './machine-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MachineLog, Machine])],
  controllers: [MachineLogsController],
  providers: [MachineLogsService],
})
export class MachineLogsModule {}
