## Description

NestJs Seed application based on:
- postgres

and three different environments:
- development
- test
- production

## Dependencies: Node & friends

- You need [`node`](https://nodejs.org/en/) (v18.12.1) and we highly recommend installing it through a _Version Manager_, such as [`nvm`](https://github.com/creationix/nvm).
- [Docker](https://docs.docker.com/engine/install) must be installed on your machine.

## .env file

In root folder, create `.env` file with following configuration:

```shell
NODE_ENV=development
DB_HOST=localhost
DB_NAME=nestjs-seed-dev
DB_NAME_TEST=nestjs-seed-test
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

## Installation

Install the _JavaScript_ dependencies

```bash
$ npm install
```

## Start Docker containers

```bash
$ docker compose up -d
```

This command will start docker containers:
- database (Postgres:latest) (if databases don't exists, two databases will be created: `nestjs-seed-dev` and `nestjs-seed-test` which is used for e2e tests)

## Run migration files

```bash
$ npm run migration:run
```

## Seed the database

## Launch the API

```bash
$ npm run start:dev
```

This command will launch the API in watch mode.

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
