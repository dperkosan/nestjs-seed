import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

import { Organization } from '../organizations/entities/organization.entity';
import { organizationMockFactory } from '../organizations/organizations.mock';
import { User } from './entities/user.entity';

interface UserMockFactoryProps {
  organization?: Organization;
  email?: string;
  firstName?: string;
  lastName?: string;
}

const userMockFactory = (options?: UserMockFactoryProps) => {
  const user = new User();
  const organization = options?.organization || organizationMockFactory();

  user.id = randomUUID();
  user.firstName = options?.firstName || faker.name.firstName();
  user.lastName = options?.lastName || faker.name.lastName();
  user.email = options?.email || faker.internet.email();
  user.organizationId = organization.id;
  user.organization = organization;
  user.createdAt = faker.date.past();
  user.updatedAt = faker.date.past();

  return user;
};

const usersMock = [
  ...Array(faker.datatype.number({ min: 2, max: 5 })).keys(),
].map(() => userMockFactory());

const userMock = usersMock[0];

export { userMock, usersMock, userMockFactory };
