import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UnitOfMeasure } from '../../common/enums/status.enum';
import { ProductionRecord } from '../../production-records/entities/production-record.entity';

// Product table (Lab 04 + Lab 05 fields)
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ length: 100, unique: true })
  productName: string;

  @Column({ length: 50 })
  productType: string;

  @Column({ type: 'enum', enum: UnitOfMeasure, default: UnitOfMeasure.Piece })
  unitOfMeasure: UnitOfMeasure;

  @Column({ type: 'int' })
  targetQuantity: number;

  @Column({ length: 255, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ProductionRecord, (record) => record.product)
  productionRecords: ProductionRecord[];
}