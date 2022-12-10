import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      firstName: 'Shipwreck Roast',
      lastName: 'Buddy Brew',
      email: 'mail@mail.com',
      organizationId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(`user #${id} not found`);
    }
    return user;
  }

  create(createUserDto: any) {
    this.users.push(createUserDto);
  }

  update(id: string, updateUserDto: any) {
    const existingUser = this.findOne(id);
    if (existingUser) {
      // update the existing entity
    }
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((item) => item.id === id);
    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
    }
  }
}
