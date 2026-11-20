import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductionRecord } from '../production-records/entities/production-record.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductionRecord])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
