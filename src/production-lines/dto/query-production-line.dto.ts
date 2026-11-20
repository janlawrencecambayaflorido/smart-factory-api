import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { LineStatus } from '../../common/enums/status.enum';

export class QueryProductionLineDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(LineStatus)
  status?: LineStatus;
}
