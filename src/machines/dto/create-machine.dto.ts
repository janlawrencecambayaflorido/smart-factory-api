import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { MachineStatus } from '../../common/enums/status.enum';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty({ message: 'machineName is required.' })
  @MaxLength(100)
  machineName: string;

  @IsString()
  @IsNotEmpty({ message: 'machineType is required.' })
  @MaxLength(50)
  machineType: string;

  @IsOptional()
  @IsEnum(MachineStatus, {
    message: 'status must be Active, Idle, Maintenance, Fault or Offline.',
  })
  status?: MachineStatus;

  @IsInt({ message: 'productionLineId must be a valid integer.' })
  @IsPositive()
  productionLineId: number;
}
