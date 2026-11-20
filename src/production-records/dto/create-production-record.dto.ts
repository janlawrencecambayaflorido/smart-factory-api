import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductionRecordDto {
  @IsInt({ message: 'productId must be a valid integer.' })
  @IsPositive()
  productId: number;

  @IsInt({ message: 'machineId must be a valid integer.' })
  @IsPositive()
  machineId: number;

  @IsInt()
  @Min(1, { message: 'quantityProduced must be at least 1.' })
  quantityProduced: number;

  @IsInt()
  @Min(0, { message: 'defectiveQuantity cannot be negative.' })
  defectiveQuantity: number;

  @IsDateString({}, { message: 'dateTime must be an ISO date, e.g. 2026-10-23T10:00:00Z.' })
  dateTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}
