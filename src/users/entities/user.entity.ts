import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { ProductionRecord } from '../../production-records/entities/production-record.entity';
import { MachineLog } from '../../machine-logs/entities/machine-log.entity';

// User table from Lab 06
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ length: 100, unique: true })
  email: string;

  // bcrypt hash only. select:false = never returned by normal queries
  @Column({ length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role, default: Role.Operator })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  failedAttempts: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ProductionRecord, (record) => record.recordedBy)
  productionRecords: ProductionRecord[];

  @OneToMany(() => MachineLog, (log) => log.recordedBy)
  machineLogs: MachineLog[];
}