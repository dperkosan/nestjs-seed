## Description

NestJs Seed application based on:
- docker
- postgres

and three different environments:
- development
- test
- production

## Dependencies:

- You need [`node`](https://nodejs.org/en/) (v18.12.1) and we highly recommend installing it through a _Version Manager_, such as [`nvm`](https://github.com/creationix/nvm).
- [`Docker`](https://docs.docker.com/engine/install) must be installed on your machine.

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
- Postgres: if databases don't exist, two databases will be created: `nestjs-seed-dev` and `nestjs-seed-test` which is used for e2e tests

## Run migration files

```bash
$ npm run migration:run
```

## Seed the database

```bash
$ npm run seed
```

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
