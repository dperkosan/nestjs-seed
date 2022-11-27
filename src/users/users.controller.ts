import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() userDto) {
    return userDto;
  }

  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return `This action returns all users. Limit ${limit}, offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns #${id} user`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto) {
    return `This action updates #${id} user`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes #${id} user`;
  }
}
