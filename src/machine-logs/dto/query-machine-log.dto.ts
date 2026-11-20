import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { MachineStatus } from '../../common/enums/status.enum';

export class QueryMachineLogDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'machineId must be a valid integer.' })
  machineId?: number;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;
}
