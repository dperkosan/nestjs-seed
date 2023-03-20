import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import clearDB from '../../utils/clearDB';

export default class Seed implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // clear DB first
    await clearDB(dataSource);

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
