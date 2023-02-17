import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsController } from './organizations.controller';
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
});
