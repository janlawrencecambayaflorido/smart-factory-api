import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { UnitOfMeasure } from '../../common/enums/status.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'productName is required.' })
  @MaxLength(100)
  productName: string;

  @IsString()
  @IsNotEmpty({ message: 'productType is required.' })
  @MaxLength(50)
  productType: string;

  @IsOptional()
  @IsEnum(UnitOfMeasure, {
    message: 'unitOfMeasure must be Piece, Pack, Box, Kilogram or Liter.',
  })
  unitOfMeasure?: UnitOfMeasure;

  // Lab 04 rule: CHECK (TargetQuantity > 0)
  @IsInt()
  @Min(1, { message: 'targetQuantity must be greater than 0.' })
  targetQuantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
