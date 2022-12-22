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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.organizationsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: Organization['id']) {
    return this.organizationsService.findOneOrFail({ where: { id } });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: Organization['id'],
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: Organization['id']) {
    return this.organizationsService.remove(id);
  }
}
