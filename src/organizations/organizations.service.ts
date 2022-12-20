import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  private findWithRelations = {
    relations: ['users'],
  };

  create(createOrganizationDto: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(
      createOrganizationDto,
    );
    return this.organizationRepository.save(organization);
  }

  findAll() {
    return this.organizationRepository.find({
      order: { name: 'ASC' },
      ...this.findWithRelations,
    });
  }

  findOne(conditions: FindOneOptions<Organization>) {
    this.organizationRepository.findOne({
      ...conditions,
      ...this.findWithRelations,
    });
  }

  async findOneOrFail(conditions: FindOneOptions<Organization>) {
    try {
      const organization = await this.organizationRepository.findOneOrFail({
        ...conditions,
        ...this.findWithRelations,
      });
      return organization;
    } catch (e) {
      throw new NotFoundException('Organization not found');
    }
  }

  async update(
    id: Organization['id'],
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const organization = await this.organizationRepository.preload({
      id: id,
      ...updateOrganizationDto,
    });
    if (!organization) {
      throw new NotFoundException(`Organization #${id} not found`);
    }
    return this.organizationRepository.save(organization);
  }

  async remove(id: Organization['id']) {
    const organization = await this.findOneOrFail({ where: { id } });
    return this.organizationRepository.remove(organization);
  }
}
