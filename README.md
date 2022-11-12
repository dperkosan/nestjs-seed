## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

Install the _JavaScript_ dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ docker compose up -d
```

This command will start:

- API
- Postgres (if databases don't exists, two databases will be created: `naya-api-dev` and `naya-api-test` which is used for e2e tests)

### Database credentials

- host: `localhost:5432`
- databases: `naya-api-dev` and `naya-api-test`
- username: `postgres`
- password: `postgres`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
