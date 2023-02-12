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

// const legacyApiAccountIds = [
//   '5fdc57cb8c727777488aaf00',
//   '615301499d7e27df26495cfc',
//   '6154750ee4ef3a1b318304b6',
// ];

// export default class Seed implements Seeder {
//   public async run(factory: Factory): Promise<any> {
//     const organizations = legacyApiAccountIds.map((accountId, index) => {
//       const id = index + 1;
//       return factory(Organization)().create({
//         id,
//         name: `Organization${id}`,
//         email: `organization${id}@${process.env.EMAIL_DOMAIN}`,
//       });
//     });
//     const easiboxesPromises = organizations.map((organization) =>
//       factory(Easibox)({ organization }).create(),
//     );
//     const easiboxes = await Promise.all(easiboxesPromises);
//     const blocksPromises = easiboxes.flatMap((easibox) => [
//       factory(InfoBlock)({ easibox }).create({ rank: 1 }),
//       factory(ChatBlock)({ easibox }).create({ rank: 2 }),
//       factory(WebformBlock)({ easibox }).create({ rank: 3 }),
//       factory(EmailBlock)({ easibox }).create({ rank: 4 }),
//       factory(PhoneBlock)({ easibox }).create({ rank: 5 }),
//       factory(UrlBlock)({ easibox }).create({ rank: 6 }),
//     ]) as Promise<any>[];

//     await Promise.all(blocksPromises);

//     const SubscriptionPromises = organizations.map((organization) =>
//       factory(Subscription)({ organization }).create(),
//     );
//     await Promise.all(SubscriptionPromises);

//     await factory(SubscriptionPackage)({
//       name: 'Free trial',
//       default: true,
//     }).create();

//     const defaultPassword = bcrypt.hashSync('password', SALT_ROUNDS);

//     const agent = await factory(User)({
//       organization: organizations[0],
//     }).create({
//       email: 'easiwarestart1@easiware.fr',
//       firstName: 'John',
//       lastName: 'Doe',
//       password: defaultPassword,
//       emailVerified: true,
//     });
//     const admin = await factory(User)({
//       organization: organizations[1],
//     }).create({
//       email: 'easiwarestart2@easiware.fr',
//       firstName: 'Betty',
//       lastName: 'Smith',
//       role: UserRole.ADMIN,
//       password: defaultPassword,
//       emailVerified: true,
//     });
//     const otherAgents = await Promise.all(
//       [...Array(5)]
//         .map(
//           () => organizations[Math.floor(Math.random() * organizations.length)],
//         )
//         .map((organization) =>
//           factory(User)({ organization }).create({
//             password: defaultPassword,
//           }),
//         ),
//     );
//     const agents = [agent, admin, ...otherAgents];

//     await factory(Category)({ organization: organizations[0] }).createMany(5);
//     await factory(Category)({
//       organization: organizations[0],
//       active: false,
//     }).createMany(5);
//     await factory(Category)({ organization: organizations[1] }).createMany(5);
//     await factory(Category)({
//       organization: organizations[1],
//       active: false,
//     }).createMany(5);

//     await factory(TicketResponseTemplate)({
//       organization: organizations[0],
//     }).createMany(5);
//     await factory(TicketResponseTemplate)({
//       organization: organizations[0],
//       enabled: false,
//     }).createMany(5);
//     await factory(TicketResponseTemplate)({
//       organization: organizations[1],
//     }).createMany(5);
//     await factory(TicketResponseTemplate)({
//       organization: organizations[1],
//       enabled: false,
//     }).createMany(5);

//     const ticketsPromises = organizations.map(async (organization) => {
//       const contacts = await factory(Contact)({
//         organization: organization,
//       }).createMany(3);
//       const contactTicketsPromise = await Promise.all(
//         contacts.map((contact) =>
//           factory(Ticket)({ contact, organization }).createMany(5),
//         ),
//       );
//       const noContactTicketsPromise = factory(Ticket)({
//         organization,
//       }).createMany(2);
//       const noContactMultiTicketsPromise = factory(Ticket)({
//         organization,
//       }).createMany(3, {
//         contactFingerprint: datatype.uuid(),
//       });
//       return Promise.all([
//         contactTicketsPromise,
//         noContactTicketsPromise,
//         noContactMultiTicketsPromise,
//       ]);
//     });
//     const tickets = (await Promise.all(ticketsPromises)).flat(3);

//     const messagesPromises = tickets.map((ticket) => {
//       const contactMessagesPromise = factory(Message)({
//         ticket,
//       }).createMany(5);

//       const agentsMessagesPromises = [...Array(3)].map(() => {
//         const orgAgents = agents.filter(
//           (agent) => agent.organizationId === ticket.organizationId,
//         );
//         const randomOrgAgent =
//           orgAgents[Math.floor(Math.random() * orgAgents.length)];
//         return factory(Message)({ ticket, agent: randomOrgAgent }).create();
//       });

//       return Promise.all([contactMessagesPromise, agentsMessagesPromises]);
//     });
//     await Promise.all(messagesPromises);
//   }
// }
