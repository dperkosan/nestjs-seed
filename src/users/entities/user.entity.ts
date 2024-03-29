import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { Organization } from './../../organizations/entities/organization.entity';
import { BaseUuid } from './../../common/entities/base-uuid.entity';

@Entity()
@Unique(['email'])
export class User extends BaseUuid {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  organizationId: Organization['id'];

  @ManyToOne(
    () => Organization,
    (organization: Organization) => organization.users,
  )
  organization: Organization;
}
