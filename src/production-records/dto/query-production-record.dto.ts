import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

// GET /production-records?productId=1&machineId=1&page=1
export class QueryProductionRecordDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'productId must be a valid integer.' })
  productId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'machineId must be a valid integer.' })
  machineId?: number;
}
