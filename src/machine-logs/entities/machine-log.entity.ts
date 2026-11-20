import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MachineStatus } from '../../common/enums/status.enum';
import { Machine } from '../../machines/entities/machine.entity';
import { User } from '../../users/entities/user.entity';

// MachineLog table (Lab 05): status history of each machine
@Entity('machine_logs')
export class MachineLog {
  @PrimaryGeneratedColumn()
  logId: number;

  @Column()
  machineId: number;

  @ManyToOne(() => Machine, (machine) => machine.machineLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column({ type: 'enum', enum: MachineStatus })
  status: MachineStatus;

  @Column({ length: 255, nullable: true })
  remarks: string;

  @CreateDateColumn({ type: 'datetime' })
  dateTime: Date;

  @Column({ nullable: true })
  recordedById: number;

  @ManyToOne(() => User, (user) => user.machineLogs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recordedById' })
  recordedBy: User;
}