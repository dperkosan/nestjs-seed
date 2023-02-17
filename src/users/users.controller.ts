import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.usersService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: User['id']) {
    return this.usersService.findOneOrFail({ where: { id } });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: User['id'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: User['id']) {
    return this.usersService.remove(id);
  }
}
