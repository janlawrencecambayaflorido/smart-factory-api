import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LineStatus } from '../../common/enums/status.enum';
import { Machine } from '../../machines/entities/machine.entity';

// ProductionLine table (Lab 04). One line has many machines.
@Entity('production_lines')
export class ProductionLine {
  @PrimaryGeneratedColumn()
  productionLineId: number;

  @Column({ length: 100, unique: true })
  lineName: string;

  @Column({ length: 100 })
  location: string;

  @Column({ type: 'enum', enum: LineStatus, default: LineStatus.Active })
  status: LineStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Machine, (machine) => machine.productionLine)
  machines: Machine[];
}