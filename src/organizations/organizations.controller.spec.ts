import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsController } from './organizations.controller';
import { organizationMock } from './organizations.mock';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneOrFail: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST one organization', () => {
    let createOrganizationDto: CreateOrganizationDto;

    describe('without userDto in payload', () => {
      beforeEach(() => {
        createOrganizationDto = {
          name: faker.company.name(),
        };
      });

      it('should call service.create method', async () => {
        await controller.create(createOrganizationDto);

        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(createOrganizationDto);
      });
    });

    describe('with userDto in payload', () => {
      beforeEach(() => {
        createOrganizationDto = {
          name: faker.company.name(),
          users: [
            {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
            },
            {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
            },
          ],
        };
      });

      it('should call service.create method', async () => {
        await controller.create(createOrganizationDto);

        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(createOrganizationDto);
      });
    });
  });

  describe('GET organizations', () => {
    const paginationQueryDto: PaginationQueryDto = {
      limit: 1,
      offset: 20,
    };

    it('should call service.findAll method', async () => {
      await controller.findAll(paginationQueryDto);

      expect(service.findAll).toBeCalledTimes(1);
      expect(service.findAll).toBeCalledWith(paginationQueryDto);
    });
  });

  describe('GET one organization', () => {
    const organizationId = organizationMock.id;

    it('should call service.findOneOrFail method', async () => {
      await controller.findOne(organizationId);

      expect(service.findOneOrFail).toBeCalledTimes(1);
      expect(service.findOneOrFail).toBeCalledWith({
        where: { id: organizationId },
      });
    });
  });

  describe('PATCH organization', () => {
    const organizationId = organizationMock.id;
    const updateOrganizationDto: UpdateOrganizationDto = {
      name: faker.company.name(),
    };

    it('should call service.update method', async () => {
      await controller.update(organizationId, updateOrganizationDto);

      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        organizationId,
        updateOrganizationDto,
      );
    });
  });

  describe('DELETE organization', () => {
    const organizationId = organizationMock.id;

    it('should call service.remove method', async () => {
      await controller.remove(organizationId);

      expect(service.remove).toBeCalledTimes(1);
      expect(service.remove).toBeCalledWith(organizationId);
    });
  });
});
