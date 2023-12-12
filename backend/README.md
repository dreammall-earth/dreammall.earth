# boilerplate-backend
[![nodejs][badge-nodejs-img]][badge-nodejs-href]
[![npm][badge-npm-img]][badge-npm-href]
[![docker][badge-docker-img]][badge-docker-href]
[![apollo-server][badge-apollo-img]][badge-apollo-href]
[![graphql][badge-graphql-img]][badge-graphql-href]
[![type-graphql][badge-type-graphql-img]][badge-type-graphql-href]
[![prisma][badge-prisma-img]][badge-prisma-href]
[![eslint][badge-eslint-img]][badge-eslint-href]
[![remark-cli][badge-remark-cli-img]][badge-remark-cli-href]
[![jest][badge-jest-img]][badge-jest-href]
[![vuepress][badge-vuepress-img]][badge-vuepress-href]

The Dreammall backend.

![](../presenter/src/assets/dreammall-logo.svg)

## Requirements & Technology

To be able to build this project you need `nodejs`, `npm` and optional `docker`.

The project sets up an apollo server. It uses `type-graphql`.

## Commands

The following commands are available:

| Command                    | Description                                     |
|----------------------------|-------------------------------------------------|
| `npm install`              | Project setup                                   |
| `npm run build`            | Compiles and minifies for production            |
| `npm run start`            | Runs productions server                         |
| **Develop**                |                                                 |
| `npm run dev`              | Compiles and hot-reloads for development        |
| **Database**               |                                                 |
| `npm run db:migrate`       | Creates and executes migrations needed          |
| `npm run db:reset`         | Drops Schema, run all migrations and seeds      |
| `npm run db:seed`          | Run the seeds                                   |
| **Test**                   |                                                 |
| `npm run test:lint`        | Run all linters                                 |
| `npm run test:lint:eslint` | Run linter eslint                               |
| `npm run test:lint:remark` | Run linter remark                               |
| `npm run test:unit`        | Run all unit tests and generate coverage report |
| `npm test`                 | Run all tests & linters                         |
| **Documentation**          |                                                 |
| `npm run docs:dev`         | Run Documentation in development mode           |
| `npm run docs:build`       | Build static documentation                      |

### Docker

Docker can be run in development mode utilizing `docker-compose.overwrite.yml`:
```bash
docker compose up
```

Docker can be run in production mode:
```bash
docker compose -f docker-compose.yml up
```

### Update

You can get a list of packes to update by running `npm run update`.

Appending `-u ` will also update the packages in the `package.json`. You have to run `npm install` again after.

```bash
npm run update -- -u
npm install
```

## Endpoints

The following endpoints are provided given the right command is executed or all three if `docker compose` is used:

| Endpoint                                                             | Description        |
|----------------------------------------------------------------------|--------------------|
| [http://localhost:4000/graphql](http://localhost:4000/graphql)       | GraphQL API        |
| [http://localhost:4000/playground](http://localhost:4000/playground) | GraphQL Playground |

## How to use as part of a project

If you want to use this as part of a larger project, e.g. in conjunction with a frontend also utilizing a boilerplate you cannot use the template mechanic provided by github for this repository.

You can use the following commands to include the whole git history of the boilerplate and be able to update according to changes to this repo using another remote.

```bash
git remote add xxx_boilerplate_backend git@github.com:IT4Change/boilerplate-backend.git
git fetch xxx_boilerplate_backend
git merge -s ours --no-commit --allow-unrelated-histories xxx_boilerplate_backend/master
git read-tree --prefix=xxx/ -u xxx_boilerplate_backend/master
git commit -m "Imported boilerplate_backend as a subtree under xxx/."
```

To update the subtree you can use

```bash
git subtree pull -P xxx/ xxx_boilerplate_backend master
git commit -m "Updated boilerplate_backend in subtree under xxx/."
```

Where `xxx` refers to the folder and product part you want to use the boilerplate in. This assumes that you might need several copies of the frontend boilerplate for you product.

This mechanic was taken from this [source](https://stackoverflow.com/questions/1683531/how-to-import-existing-git-repository-into-another/8396318#8396318)

## Database setup

The project is set up for a `sqlite` database.
In order to run the project against a mysql database adjust `primsa/schema.prisma`, copy the `.env.dist` file to `.env` and configure the database connection appropriately.
Then run `npm run db:migrate` to generate the database. It might be required to delete the migration folder beforehand.

## License

[Apache 2.0](./LICENSE)

<!-- Badges -->
[badge-nodejs-img]: https://img.shields.io/badge/nodejs-%3E%3D20.5.0-blue
[badge-nodejs-href]:  https://nodejs.org/

[badge-npm-img]: https://img.shields.io/badge/npm-latest-blue
[badge-npm-href]: https://www.npmjs.com/package/npm

[badge-docker-img]: https://img.shields.io/badge/docker-latest-blue
[badge-docker-href]: https://www.docker.com/

[badge-apollo-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=dependencies%5B%22%40apollo%2Fserver%22%5D&label=apollo-server&color=green
[badge-apollo-href]: https://apollographql.com

[badge-graphql-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=dependencies.graphql&label=graphql&color=green
[badge-graphql-href]: https://graphql.org/

[badge-type-graphql-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=dependencies%5B%22type-graphql%22%5D&label=type-graphql&color=green
[badge-type-graphql-href]: https://typegraphql.com/

[badge-prisma-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=dependencies.prisma&label=prisma&color=green
[badge-prisma-href]: https://prisma.io/

[badge-eslint-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=devDependencies.eslint&label=eslint&color=yellow
[badge-eslint-href]: https://eslint.org/

[badge-remark-cli-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=devDependencies%5B%27remark-cli%27%5D&label=remark-cli&color=yellow
[badge-remark-cli-href]: https://remark.js.org/

[badge-jest-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=devDependencies.jest&label=jest&color=yellow
[badge-jest-href]: https://jestjs.io/

[badge-vuepress-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fbackend%2Fpackage.json&query=devDependencies.vuepress&label=vuepress&color=orange
[badge-vuepress-href]: https://vuepress.vuejs.org/
