import { Organization } from './../../organizations/entities/organization.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
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
  organizationId: Organization['id'];

  @ManyToOne(
    () => Organization,
    (organization: Organization) => organization.users,
  )
  organization: Organization;
}
