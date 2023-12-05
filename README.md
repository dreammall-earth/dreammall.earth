# boilerplate-backend
[![nodejs][badge-nodejs-img]][badge-nodejs-href]
[![npm][badge-npm-img]][badge-npm-href]
[![docker][badge-docker-img]][badge-docker-href]
[![eslint][badge-eslint-img]][badge-eslint-href]
[![apollo-server][badge-apollo-img]][badge-apollo-href]
[![graphql][badge-graphql-img]][badge-graphql-href]
[![type-graphql][badge-type-graphql-img]][badge-type-graphql-href]

The IT4C Boilerplate for an apollo express backends.

## Requirements & Technology

To be able to build this project you need `nodejs`, `npm` and optional `docker`.

The project sets up an apollo express server.

## Commands

The following commands are available:

| Command                    | Description                                     |
|----------------------------|-------------------------------------------------|
| `npm install`              | Project setup                                   |
| `npm run build`            | Compiles and minifies for production            |
| `npm run start`            | Runs productions server                         |
| **Develop**                |                                                 |
| `npm run dev`              | Compiles and hot-reloads for development        |
| **Test**                   |                                                 |
| `npm run test:lint`        | Run all linters                                 |
| `npm run test:lint:eslint` | Run linter eslint                               |
| `npm run test:lint:remark` | Run linter remark                               |
| `npm run test:unit`        | Run all unit tests and generate coverage report |
| `npm test`                 | Run all tests & linters                         |

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

## License

[Apache 2.0](./LICENSE)

<!-- Badges -->
[badge-nodejs-img]: https://img.shields.io/badge/nodejs-%3E%3D20.5.0-blue
[badge-nodejs-href]:  https://nodejs.org/

[badge-npm-img]: https://img.shields.io/badge/npm-latest-blue
[badge-npm-href]: https://www.npmjs.com/package/npm

[badge-docker-img]: https://img.shields.io/badge/docker-latest-blue
[badge-docker-href]: https://www.docker.com/

[badge-eslint-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FIT4Change%2Fboilerplate-backend%2Fmaster%2Fpackage.json&query=devDependencies.eslint&label=eslint&color=yellow
[badge-eslint-href]: https://eslint.org/

[badge-apollo-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FIT4Change%2Fboilerplate-backend%2Fmaster%2Fpackage.json&query=dependencies.apollo-server-express&label=eslint&color=yellow
[badge-apollo-href]: https://github.com/apollographql/apollo-server#readme

[badge-graphql-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FIT4Change%2Fboilerplate-backend%2Fmaster%2Fpackage.json&query=dependencies.graphql&label=eslint&color=yellow
[badge-graphql-href]: https://graphql.org/

[badge-type-graphql-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FIT4Change%2Fboilerplate-backend%2Fmaster%2Fpackage.json&query=dependencies.type-graphql&label=eslint&color=yellow
[badge-type-graphql-href]: https://typegraphql.com/
