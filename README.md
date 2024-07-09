# Dreammall.earth

[![nodejs][badge-nodejs-img]][badge-nodejs-href]
[![npm][badge-npm-img]][badge-npm-href]
[![remark-cli][badge-remark-cli-img]][badge-remark-cli-href]
[![vuepress][badge-vuepress-img]][badge-vuepress-href]

Dreammall.earth websites & services

![](presenter/src/assets/dreammall-logo.svg)

## Modules

### Frontends

- [Presenter](presenter/README.md)
- [Frontend](frontend/README.md)
- [Admin](admin/README.md)

### Backend

- [Backend](backend/README.md)

### Dev-Op

- [Authentik](authentik/README.md)

## Deployment

Instructions how to deploy this software are available [here](deployment/README.md)

## Commands

### The following commands are available

| Command                    | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `npm install`              | Project setup                                  |
| **Test**                   |                                                |
| `npm run test:lint`        | Run all linters                                |
| `npm run test:lint:remark` | Run linter remark                              |
| `npm test`                 | Run all tests & linters                        |
| **Documentation**          |                                                |
| `npm run docs:dev`         | Run Documentation in development mode          |
| `npm run docs:build`       | Build static documentation                     |
| **Release**                |                                                |
| `npm run release`          | Propagate release version & generate changelog |
| **Maintenance**            |                                                |
| `npm run update`           | Check for updates                              |

## Bare-metal

Ensure you are using a `node --version` that matches the one specified in [.tool-versions](.tool-versions).
E.g. you could install [asdf-vm](https://asdf-vm.com/guide/getting-started.html).

### Install Authentik

```bash
# Go in authentik folder
cd $rootFolder/authentik
# Delete existing database
rm -rf database
# Unpack database in database folder
./database.unpack.sh
# Start authentik docker
docker compose up
```

### Start Database

```bash
# In new Terminal
cd $rootFolder
# Start database in docker
docker compose up database
```

### Start Backend

```bash
# In new Terminal
cd $rootFolder/backend
# Copy .env.dist .env
cp .env.dist .env
# Symbolik for authentik key
ln -s src/auth/public.pem public.pem
npm install
# Initialize Database
npm run db:reset
# Migration Database
# npm run db:migrate
npm run dev
```

### Start Presenter

```bash
# In new Terminal
cd $rootFolder/presenter
cp .env.dist .env
npm install
export PORT=3001
# Run dev mode
npm run dev
# Run prod mode (faster)
# npm run prod
```

### Start Frontend

```bash
# In new Terminal
cd $rootFolder/frontend
cp .env.dist .env
npm install
# export PORT=3000(default)
# Run dev mode (for development)
npm run dev
# Run prod mode (faster)
# npm run prod
```

### Start Admin

```bash
# In new Terminal
cd $rootFolder/admin
cp .env.dist .env
npm install
export PORT=3002
# Run dev mode
npm run dev
# Run prod mode (faster)
# npm run prod
```

## Docker

### The following endpoints are provided for `docker compose`

| Endpoint                                                             | Description                |
| -------------------------------------------------------------------- | -------------------------- |
| [http://localhost:3306](http://localhost:3306)                       | MySQL Database             |
| [http://localhost:3000](http://localhost:3001)                       | Presenter                  |
| [http://localhost:8081](http://localhost:8081)                       | Presenter Documentation    |
| [http://localhost:6006](http://localhost:6006)                       | Presenter Storybook        |
| [http://localhost:3001](http://localhost:3000)                       | Frontend                   |
| [http://localhost:8082](http://localhost:8082)                       | Frontend Documentation     |
| [http://localhost:6007](http://localhost:6007)                       | Frontend Storybook         |
| [http://localhost:3002](http://localhost:3002)                       | Admin                      |
| [http://localhost:8083](http://localhost:8083)                       | Admin Documentation        |
| [http://localhost:6008](http://localhost:6008)                       | Admin Storybook            |
| [http://localhost:4000/graphql](http://localhost:4000/graphql)       | Backend GraphQL API        |
| [http://localhost:4000/playground](http://localhost:4000/playground) | Backend GraphQL Playground |
| [http://localhost:8084](http://localhost:8084)                       | Backend Documentation      |
| [http://localhost:8080](http://localhost:8080)                       | Documentation              |

## How to release

Generate a new version using `npm version --git-tag-version=false patch|minor|major`.
Then run `npm run release` to propagate the new version and generate the changelog

## Update

You can get a list of packages to update by running `npm run update`.

Appending `-u` will also update the packages in the `package.json`. You have to run `npm install` again after.

```bash
npm run update -- -u
npm install
```

## External Tools

This project is tested with Browserstack.

## License

[Apache 2.0](./LICENSE)

<!-- Badges -->
[badge-nodejs-img]: https://img.shields.io/badge/nodejs-%3E%3D20.5.0-blue
[badge-nodejs-href]:  https://nodejs.org/

[badge-npm-img]: https://img.shields.io/badge/npm-latest-blue
[badge-npm-href]: https://www.npmjs.com/package/npm

[badge-remark-cli-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fpackage.json&query=devDependencies%5B%27remark-cli%27%5D&label=remark-cli&color=yellow
[badge-remark-cli-href]: https://remark.js.org/

[badge-vuepress-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fpackage.json&query=devDependencies.vuepress&label=vuepress&color=orange
[badge-vuepress-href]: https://vuepress.vuejs.org/
