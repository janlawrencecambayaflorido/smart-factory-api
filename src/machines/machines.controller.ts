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
  Query,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { QueryMachineDto } from './dto/query-machine.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get() // #8
  findAll(@Query() query: QueryMachineDto) {
    return this.machinesService.findAll(query);
  }

  @Get(':id') // #9
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.machinesService.findOne(id);
  }

  @Post() // #10
  @Roles(Role.Admin)
  create(@Body() dto: CreateMachineDto) {
    return this.machinesService.create(dto);
  }

  @Patch(':id') // #11 - Supervisor may update status
  @Roles(Role.Admin, Role.Supervisor)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMachineDto) {
    return this.machinesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.machinesService.remove(id);
  }
}
