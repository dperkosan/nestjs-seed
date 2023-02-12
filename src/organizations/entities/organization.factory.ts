import { setSeederFactory } from 'typeorm-extension';

import { Organization } from './organization.entity';

export default setSeederFactory(Organization, (faker) => {
  const organization = new Organization();
  organization.name = faker.company.name();

  return organization;
});
