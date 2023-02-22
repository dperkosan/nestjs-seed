import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { FindOneOptions, Repository } from 'typeorm';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { organizationMock } from '../organizations/organizations.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { userMock } from './users.mock';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn((createUserDto: CreateUserDto) => createUserDto),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(
              (conditions: FindOneOptions<User>) =>
                new Promise((resolve, reject) => {
                  conditions.where['id'] === userMock.id
                    ? resolve(userMock)
                    : reject(new NotFoundException());
                }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let createUserDto: CreateUserDto;

    beforeEach(() => {
      createUserDto = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        organizationId: organizationMock.id,
      };
    });

    it('should call repo.create and repo.save methods', async () => {
      await service.create(createUserDto);

      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith(createUserDto);

      expect(repo.save).toBeCalledTimes(1);
      expect(repo.save).toBeCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    const paginationQueryDto: PaginationQueryDto = { limit: 1, offset: 20 };

    describe('with pagination params', () => {
      it('should call repo.find method', async () => {
        await service.findAll(paginationQueryDto);

        expect(repo.find).toBeCalledTimes(1);
        expect(repo.find).toBeCalledWith({
          order: { lastName: 'ASC' },
          relations: ['organization'],
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
          order: { lastName: 'ASC' },
          relations: ['organization'],
          skip: undefined,
          take: undefined,
        });
      });
    });
  });

  describe('findOne', () => {
    it('should call repo.findOne with the id', async () => {
      await service.findOne({ where: { id: userMock.id } });

      expect(repo.findOne).toBeCalledTimes(1);
      expect(repo.findOne).toBeCalledWith({
        where: { id: userMock.id },
        relations: ['organization'],
      });
    });
  });

  describe('findOneOrFail', () => {
    describe('when user exist', () => {
      it('should call repo.findOneOrFail with the id', async () => {
        await service.findOneOrFail({ where: { id: userMock.id } });

        expect(repo.findOneOrFail).toBeCalledTimes(1);
        expect(repo.findOneOrFail).toBeCalledWith({
          where: { id: userMock.id },
          relations: ['organization'],
        });
      });
    });

    describe('when user does not exist', () => {
      it('should return an error', async () => {
        await expect(
          service.findOneOrFail({ where: { id: randomUUID() } }),
        ).rejects.toEqual(new NotFoundException('User not found'));
      });
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      firstName: faker.name.firstName(),
    };

    describe('when user exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockResolvedValue(Promise.resolve(userMock));
      });

      it('should call service.findOneOrFail and repo.save method', async () => {
        await service.update(userMock.id, updateUserDto);

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: userMock.id },
        });

        expect(repo.save).toBeCalledTimes(1);
        expect(repo.save).toBeCalledWith({
          ...userMock,
          ...updateUserDto,
        });
      });
    });

    describe('when user does not exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockRejectedValue(new NotFoundException());
      });

      it('should return an error and not call repo.save method', async () => {
        await expect(
          service.update(userMock.id, updateUserDto),
        ).rejects.toThrow();

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: userMock.id },
        });

        expect(repo.save).toBeCalledTimes(0);
      });
    });
  });

  describe('remove', () => {
    describe('when user exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockResolvedValue(Promise.resolve(userMock));
      });

      it('should call service.findOneOrFail and repo.remove method', async () => {
        await service.remove(userMock.id);

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: userMock.id },
        });

        expect(repo.remove).toBeCalledTimes(1);
        expect(repo.remove).toBeCalledWith(userMock);
      });
    });

    describe('when user does not exist', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findOneOrFail')
          .mockRejectedValue(new NotFoundException());
      });

      it('should return an error and not call repo.remove method', async () => {
        await expect(service.remove(userMock.id)).rejects.toThrow();

        expect(service.findOneOrFail).toBeCalledTimes(1);
        expect(service.findOneOrFail).toBeCalledWith({
          where: { id: userMock.id },
        });

        expect(repo.remove).toBeCalledTimes(0);
      });
    });
  });
});
