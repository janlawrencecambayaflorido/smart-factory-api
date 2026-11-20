import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { MachineStatus } from '../../common/enums/status.enum';

export class CreateMachineLogDto {
  @IsInt({ message: 'machineId must be a valid integer.' })
  @IsPositive()
  machineId: number;

  @IsEnum(MachineStatus, {
    message: 'status must be Active, Idle, Maintenance, Fault or Offline.',
  })
  status: MachineStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}
