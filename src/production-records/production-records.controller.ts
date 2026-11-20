import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductionRecordsService } from './production-records.service';
import { CreateProductionRecordDto } from './dto/create-production-record.dto';
import { QueryProductionRecordDto } from './dto/query-production-record.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('production-records')
export class ProductionRecordsController {
  constructor(private readonly recordsService: ProductionRecordsService) {}

  @Get() // #14
  findAll(@Query() query: QueryProductionRecordDto) {
    return this.recordsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.findOne(id);
  }

  @Post() // #15 - Admin does not encode daily output (separation of duties)
  @Roles(Role.Operator, Role.Supervisor)
  create(@Body() dto: CreateProductionRecordDto, @CurrentUser() user: AuthUser) {
    return this.recordsService.create(dto, user.userId);
  }

  @Delete(':id') // correct a wrong entry
  @Roles(Role.Admin, Role.Supervisor)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.remove(id);
  }
}
