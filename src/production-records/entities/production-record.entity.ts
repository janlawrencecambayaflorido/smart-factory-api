import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Machine } from '../../machines/entities/machine.entity';
import { User } from '../../users/entities/user.entity';

// ProductionRecord table (Lab 04 "ProductionLog", renamed in Lab 05)
// Stores produced and defective output per product and machine.
@Entity('production_records')
export class ProductionRecord {
  @PrimaryGeneratedColumn()
  recordId: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.productionRecords, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  machineId: number;

  @ManyToOne(() => Machine, (machine) => machine.productionRecords, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column({ type: 'int' })
  quantityProduced: number;

  @Column({ type: 'int', default: 0 })
  defectiveQuantity: number;

  @Column({ type: 'datetime' })
  dateTime: Date;

  @Column({ length: 255, nullable: true })
  remarks: string;

  // Who encoded the record (taken from the JWT, not from the body)
  @Column({ nullable: true })
  recordedById: number;

  @ManyToOne(() => User, (user) => user.productionRecords, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recordedById' })
  recordedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
