import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

import { Organization } from './entities/organization.entity';

interface OrganizationMockFactoryProps {
  name?: string;
}

const organizationMockFactory = (options?: OrganizationMockFactoryProps) => {
  const organization = new Organization();

  organization.id = randomUUID();
  organization.name = options?.name || faker.company.name();
  organization.users = [];
  organization.createdAt = faker.date.past();
  organization.updatedAt = faker.date.past();

  return organization;
};

const organizationsMock = [
  ...Array(faker.datatype.number({ min: 2, max: 5 })).keys(),
].map(() => organizationMockFactory());

const organizationMock = organizationsMock[0];

export { organizationMock, organizationsMock, organizationMockFactory };
