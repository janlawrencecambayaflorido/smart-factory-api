import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionLine } from './entities/production-line.entity';
import { Machine } from '../machines/entities/machine.entity';
import { ProductionLinesService } from './production-lines.service';
import { ProductionLinesController } from './production-lines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLine, Machine])],
  controllers: [ProductionLinesController],
  providers: [ProductionLinesService],
})
export class ProductionLinesModule {}
