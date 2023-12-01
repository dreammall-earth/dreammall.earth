# boilerplate-backend
[![nodejs][badge-nodejs-img]][badge-nodejs-href]
[![npm][badge-npm-img]][badge-npm-href]
[![docker][badge-docker-img]][badge-docker-href]

The IT4C Boilerplate for an apollo express backends.

## Requirements & Technology

To be able to build this project you need `nodejs`, `npm` and optional `docker`.

The project sets up an apollo express server.

## Commands

The following commands are available:

| Command                    | Description                              |
|----------------------------|------------------------------------------|
| **Develop**                |                                          |
| `npm run dev`              | Compiles and hot-reloads for development |
| **Test**                   |                                          |
| `npm run test:lint`        | Run all linters                          |
| `npm run test:lint:eslint` | Run linter eslint                        |
| `npm run test:lint:remark` | Run linter remark                        |

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
