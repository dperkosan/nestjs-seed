import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';
import { organizationMock } from './organizations.mock';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

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
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(
              (conditions: FindOneOptions<Organization>) =>
                new Promise((resolve, reject) => {
                  conditions.where['id'] === organizationMock.id
                    ? resolve(organizationMock)
                    : reject(new NotFoundException());
                }),
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

    describe('without userDto in payload', () => {
      beforeEach(() => {
        createOrganizationDto = {
          name: faker.company.name(),
        };
      });

      it('should call repo.create and repo.save methods', async () => {
        await service.create(createOrganizationDto);

        expect(repo.create).toBeCalledTimes(1);
        expect(repo.create).toBeCalledWith(createOrganizationDto);

        expect(repo.save).toBeCalledTimes(1);
        expect(repo.save).toBeCalledWith(createOrganizationDto);
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

      it('should call repo.create and repo.save methods', async () => {
        await service.create(createOrganizationDto);

        expect(repo.create).toBeCalledTimes(1);
        expect(repo.create).toBeCalledWith(createOrganizationDto);

        expect(repo.save).toBeCalledTimes(1);
        expect(repo.save).toBeCalledWith(createOrganizationDto);
      });
    });
  });

  describe('findAll', () => {
    const paginationQueryDto: PaginationQueryDto = { limit: 1, offset: 20 };

    describe('with pagination params', () => {
      it('should call repo.find method', async () => {
        await service.findAll(paginationQueryDto);

        expect(repo.find).toBeCalledTimes(1);
        expect(repo.find).toBeCalledWith({
          order: { name: 'ASC' },
          relations: ['users'],
          skip: paginationQueryDto.offset,
          take: paginationQueryDto.limit,
        });
      });
    });

    describe('without pagination params', () => {
      it('should call repo.find method', async () => {
        await service.findAll({});

        expect(repo.find).toBeCalledTimes(1);
        expect(repo.find).toBeCalledWith({
          order: { name: 'ASC' },
          relations: ['users'],
          skip: undefined,
          take: undefined,
        });
      });
    });
  });

  describe('findOne', () => {
    it('should call repo.findOne with the id', async () => {
      await service.findOne({ where: { id: organizationMock.id } });

      expect(repo.findOne).toBeCalledTimes(1);
      expect(repo.findOne).toBeCalledWith({
        where: { id: organizationMock.id },
        relations: ['users'],
      });
    });
  });

  describe('findOneOrFail', () => {
    describe('when organization exist', () => {
      it('should call repo.findOneOrFail with the id', async () => {
        await service.findOneOrFail({ where: { id: organizationMock.id } });

        expect(repo.findOneOrFail).toBeCalledTimes(1);
        expect(repo.findOneOrFail).toBeCalledWith({
          where: { id: organizationMock.id },
          relations: ['users'],
        });
      });
    });

    describe('when organization does not exist', () => {
      it('should return an error', async () => {
        await expect(
          service.findOneOrFail({ where: { id: randomUUID() } }),
        ).rejects.toEqual(new NotFoundException('Organization not found'));
      });
    });
  });

  describe('update', () => {
    const updateOrganizationDto: UpdateOrganizationDto = {
      name: faker.company.name(),
    };

    describe('when organization exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockResolvedValue(Promise.resolve(organizationMock));
      });

      it('should call service.findOneOrFail and repo.save method', async () => {
        await service.update(organizationMock.id, updateOrganizationDto);

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: organizationMock.id },
        });

        expect(repo.save).toBeCalledTimes(1);
        expect(repo.save).toBeCalledWith({
          ...organizationMock,
          ...updateOrganizationDto,
        });
      });
    });

    describe('when organization does not exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockRejectedValue(new NotFoundException());
      });

      it('should return an error and not call repo.save method', async () => {
        await expect(
          service.update(organizationMock.id, updateOrganizationDto),
        ).rejects.toThrow();

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: organizationMock.id },
        });

        expect(repo.save).toBeCalledTimes(0);
      });
    });
  });

  describe('remove', () => {
    describe('when organization exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockResolvedValue(Promise.resolve(organizationMock));
      });

      it('should call service.findOneOrFail and repo.remove method', async () => {
        await service.remove(organizationMock.id);

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: organizationMock.id },
        });

        expect(repo.remove).toBeCalledTimes(1);
        expect(repo.remove).toBeCalledWith(organizationMock);
      });
    });

    describe('when organization does not exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockRejectedValue(new NotFoundException());
      });

      it('should return an error and not call repo.remove method', async () => {
        await expect(service.remove(organizationMock.id)).rejects.toThrow();

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: organizationMock.id },
        });

        expect(repo.remove).toBeCalledTimes(0);
      });
    });
  });
});
