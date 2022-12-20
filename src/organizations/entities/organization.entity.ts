import { BaseUuid } from './../../common/entities/base-uuid.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './../../users/entities/user.entity';

@Entity()
export class Organization extends BaseUuid {
  @Column()
  name: string;

  @OneToMany(() => User, (user: User) => user.organization, {
    cascade: ['insert', 'update'],
  })
  users: Omit<User, 'organization'>[];
}
