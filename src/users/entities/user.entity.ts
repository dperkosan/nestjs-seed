import { BaseUuid } from 'src/common/entities/base-uuid.entity';
import { Column, Entity } from 'typeorm';

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
