import { Column, Entity } from 'typeorm';
import { BaseUuid } from './../../common/entities/base-uuid.entity';

@Entity()
export class User extends BaseUuid {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  organizationId: string;
}
