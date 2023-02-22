import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { organizationMock } from '../organizations/organizations.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { userMock } from './users.mock';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST one user', () => {
    let createUserDto: CreateUserDto;

    beforeEach(() => {
      createUserDto = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        organizationId: organizationMock.id,
      };
    });

    it('should call service.create method', async () => {
      await controller.create(createUserDto);

      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(createUserDto);
    });
  });

  describe('GET users', () => {
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

  describe('GET one user', () => {
    const userId = userMock.id;

    it('should call service.findOneOrFail method', async () => {
      await controller.findOne(userId);

      expect(service.findOneOrFail).toBeCalledTimes(1);
      expect(service.findOneOrFail).toBeCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('PATCH user', () => {
    const userId = userMock.id;
    const updateUserDto: UpdateUserDto = {
      firstName: faker.name.firstName(),
    };

    it('should call service.update method', async () => {
      await controller.update(userId, updateUserDto);

      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(userId, updateUserDto);
    });
  });

  describe('DELETE user', () => {
    const userId = userMock.id;

    it('should call service.remove method', async () => {
      await controller.remove(userId);

      expect(service.remove).toBeCalledTimes(1);
      expect(service.remove).toBeCalledWith(userId);
    });
  });
});
