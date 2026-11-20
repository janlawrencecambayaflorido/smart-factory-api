import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { LineStatus } from '../../common/enums/status.enum';

export class CreateProductionLineDto {
  @IsString()
  @IsNotEmpty({ message: 'lineName is required.' })
  @MaxLength(100)
  lineName: string;

  @IsString()
  @IsNotEmpty({ message: 'location is required.' })
  @MaxLength(100)
  location: string;

  @IsOptional()
  @IsEnum(LineStatus, { message: 'status must be Active, Inactive or Maintenance.' })
  status?: LineStatus;
}
