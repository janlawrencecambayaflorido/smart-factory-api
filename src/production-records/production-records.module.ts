import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionRecord } from './entities/production-record.entity';
import { Product } from '../products/entities/product.entity';
import { Machine } from '../machines/entities/machine.entity';
import { ProductionRecordsService } from './production-records.service';
import { ProductionRecordsController } from './production-records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionRecord, Product, Machine])],
  controllers: [ProductionRecordsController],
  providers: [ProductionRecordsService],
})
export class ProductionRecordsModule {}
