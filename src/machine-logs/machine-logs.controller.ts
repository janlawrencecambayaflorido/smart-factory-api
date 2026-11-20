import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { MachineLogsService } from './machine-logs.service';
import { CreateMachineLogDto } from './dto/create-machine-log.dto';
import { QueryMachineLogDto } from './dto/query-machine-log.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@Controller('machine-logs')
export class MachineLogsController {
  constructor(private readonly logsService: MachineLogsService) {}

  @Get() // #16
  findAll(@Query() query: QueryMachineLogDto) {
    return this.logsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logsService.findOne(id);
  }

  @Post() // #17
  @Roles(Role.Operator, Role.Supervisor)
  create(@Body() dto: CreateMachineLogDto, @CurrentUser() user: AuthUser) {
    return this.logsService.create(dto, user.userId);
  }
}
