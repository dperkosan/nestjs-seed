import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';

export default class Seed implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // clear DB first
    await dataSource.query(
      `TRUNCATE "${dataSource.getMetadata(Organization).tableName}" CASCADE;`,
    );
    await dataSource.query(
      `TRUNCATE "${dataSource.getMetadata(User).tableName}" CASCADE;`,
    );

    // seed DB
    const organizationFactory = factoryManager.get(Organization);
    const organizations = await organizationFactory.saveMany(3);

    const userFactory = factoryManager.get(User);
    const usersPromises = organizations.map((organization) =>
      userFactory.saveMany(3, { organization }),
    );
    await Promise.all(usersPromises);
  }
}
