import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(conditions: FindOneOptions<User>) {
    this.userRepository.findOne(conditions);
  }

  async findOneOrFail(conditions: FindOneOptions<User>) {
    try {
      const user = await this.userRepository.findOneOrFail(conditions);
      return user;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: User['id']) {
    const user = await this.findOneOrFail({ where: { id } });
    return this.userRepository.remove(user);
  }
}