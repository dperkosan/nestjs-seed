import { setSeederFactory } from 'typeorm-extension';

import { User } from './user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = faker.internet.email();

  return user;
});
