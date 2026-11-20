import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductionLinesService } from './production-lines.service';
import { CreateProductionLineDto } from './dto/create-production-line.dto';
import { UpdateProductionLineDto } from './dto/update-production-line.dto';
import { QueryProductionLineDto } from './dto/query-production-line.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

// Receives HTTP requests for /api/v1/production-lines and passes them to the service
@Controller('production-lines')
export class ProductionLinesController {
  constructor(private readonly linesService: ProductionLinesService) {}

  @Get() // #1
  findAll(@Query() query: QueryProductionLineDto) {
    return this.linesService.findAll(query);
  }

  @Get(':id') // #2
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.linesService.findOne(id);
  }

  @Post() // #3 -> 201 Created
  @Roles(Role.Admin)
  create(@Body() dto: CreateProductionLineDto) {
    return this.linesService.create(dto);
  }

  @Put(':id') // #4
  @Roles(Role.Admin)
  replace(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductionLineDto) {
    return this.linesService.replace(id, dto);
  }

  @Patch(':id') // #5
  @Roles(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductionLineDto) {
    return this.linesService.update(id, dto);
  }

  @Delete(':id') // #6 -> 204 No Content
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.linesService.remove(id);
  }

  @Get(':id/machines') // #7
  findMachines(@Param('id', ParseIntPipe) id: number, @Query() query: PaginationQueryDto) {
    return this.linesService.findMachines(id, query);
  }
}
