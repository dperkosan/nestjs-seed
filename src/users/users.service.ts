import { Repository, FindOneOptions } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private findWithRelations = {
    relations: ['organization'],
  };

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    return this.userRepository.find({
      order: { lastName: 'ASC' },
      ...this.findWithRelations,
      skip: offset,
      take: limit,
    });
  }

  async findOne(conditions: FindOneOptions<User>) {
    return this.userRepository.findOne({
      ...conditions,
      ...this.findWithRelations,
    });
  }

  async findOneOrFail(conditions: FindOneOptions<User>) {
    try {
      const user = await this.userRepository.findOneOrFail({
        ...conditions,
        ...this.findWithRelations,
      });
      return user;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
    const user = await this.findOneOrFail({ where: { id } });

    const userDto = {
      ...user,
      ...updateUserDto,
    };

    return this.userRepository.save(userDto);
  }

  async remove(id: User['id']) {
    const user = await this.findOneOrFail({ where: { id } });
    return this.userRepository.remove(user);
  }
}
