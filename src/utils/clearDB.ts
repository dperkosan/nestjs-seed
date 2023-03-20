import { DataSource } from 'typeorm';

import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';

const clearDB = async (dataSource: DataSource) => {
  await dataSource.query(
    `TRUNCATE "${dataSource.getMetadata(Organization).tableName}" CASCADE;`,
  );
  await dataSource.query(
    `TRUNCATE "${dataSource.getMetadata(User).tableName}" CASCADE;`,
  );
};

export default clearDB;
