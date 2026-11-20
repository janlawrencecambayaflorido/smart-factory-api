import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { MachineStatus } from '../../common/enums/status.enum';

// GET /machines?status=Active&productionLineId=1&page=1&limit=10
export class QueryMachineDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'productionLineId must be a valid integer.' })
  productionLineId?: number;
}
