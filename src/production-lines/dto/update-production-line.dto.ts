import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionLineDto } from './create-production-line.dto';

// PATCH: every field is optional
export class UpdateProductionLineDto extends PartialType(CreateProductionLineDto) {}
