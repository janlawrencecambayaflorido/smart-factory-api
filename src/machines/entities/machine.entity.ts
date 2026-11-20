import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MachineStatus } from '../../common/enums/status.enum';
import { ProductionLine } from '../../production-lines/entities/production-line.entity';
import { ProductionRecord } from '../../production-records/entities/production-record.entity';
import { MachineLog } from '../../machine-logs/entities/machine-log.entity';

// Machine table (Lab 04). Many machines belong to one production line.
@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn()
  machineId: number;

  @Column({ length: 100 })
  machineName: string;

  @Column({ length: 50 })
  machineType: string;

  @Column({ type: 'enum', enum: MachineStatus, default: MachineStatus.Idle })
  status: MachineStatus;

  // Foreign key column (shown in JSON as productionLineId)
  @Column()
  productionLineId: number;

  @ManyToOne(() => ProductionLine, (line) => line.machines, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productionLineId' })
  productionLine: ProductionLine;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ProductionRecord, (record) => record.machine)
  productionRecords: ProductionRecord[];

  @OneToMany(() => MachineLog, (log) => log.machine)
  machineLogs: MachineLog[];
}
