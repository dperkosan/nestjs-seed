import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { organizationMockFactory } from './organizations.mock';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let repo: Repository<Organization>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            create: jest.fn(
              (createOrganizationDto: CreateOrganizationDto) =>
                createOrganizationDto,
            ),
            save: jest.fn((createOrganizationDto: CreateOrganizationDto) =>
              organizationMockFactory(createOrganizationDto),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    repo = module.get<Repository<Organization>>(
      getRepositoryToken(Organization),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let createOrganizationDto: CreateOrganizationDto;

    beforeEach(() => {
      createOrganizationDto = {
        name: faker.company.name(),
      };
    });

    it('should call create and save methods and create organization', async () => {
      await expect(service.create(createOrganizationDto)).resolves.toEqual({
        id: expect.any(String),
        users: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        ...createOrganizationDto,
      });

      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith(createOrganizationDto);

      expect(repo.save).toBeCalledTimes(1);
      expect(repo.save).toBeCalledWith(createOrganizationDto);
    });
  });
});
