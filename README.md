# Dreammall.earth

[![nodejs][badge-nodejs-img]][badge-nodejs-href]
[![npm][badge-npm-img]][badge-npm-href]
[![remark-cli][badge-remark-cli-img]][badge-remark-cli-href]
[![vuepress][badge-vuepress-img]][badge-vuepress-href]

Dreammall.earth websites & services

![](presenter/src/assets/dreammall-logo.svg)

## Modules

- [Admin](admin/README.md)
- [Authentik](authentik/README.md)
- [Backend](backend/README.md)
- [Deployment](deployment/README.md)
- [Frontend](frontend/README.md)
- [Presenter](presenter/README.md)

## Commands

The following commands are available:

| Command                    | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `npm install`              | Project setup                                  |
| **Test**                   |                                                |
| `npm run remark`           | Run linter remark                              |
| **Documentation**          |                                                |
| `npm run docs:dev`         | Run Documentation in development mode          |
| `npm run docs:build`       | Build static documentation                     |
| **Release**                |                                                |
| `npm run release`          | Propagate release version & generate changelog |

## Shared Setup
Make sure you have [docker](https://www.docker.com/) installed on your system.

Start authentik and mariadb database:
```bash
docker compose up -d --wait authentik authentik-worker database
```

## A) Run applications with Docker

Run database migrations:
```bash
docker compose run --rm backend npm run db:reset
```

Start your desired applications:
```bash
docker compose up admin backend frontend presenter
```

## B) Run applications locally

Ensure you are using a `node --version` that matches the one specified in [.tool-versions](.tool-versions).
E.g. you could install [asdf-vm](https://asdf-vm.com/guide/getting-started.html).

Set a temporary variable for the upcoming steps:
```bash
export rootFolder=$(pwd)
```

Setup admin:
```bash
cd $rootFolder/admin
cp .env.dist .env
npm install
```

Setup backend:
```bash
cd $rootFolder/backend
cp .env.dist .env
npm install
npm run db:reset
```

Setup Frontend
```bash
cd $rootFolder/frontend
cp .env.dist .env
npm install
```

Setup presenter:
```bash
cd $rootFolder/presenter
cp .env.dist .env
npm install
```

### Start Services

Now start all of these in separate terminals:
```bash
cd admin
export PORT=3002
npm run dev
```

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

```bash
cd presenter
export PORT=3001
npm run dev
```

## Endpoints

The following endpoints are provided for `docker compose up`:

| Endpoint                                        | Description                |
| ----------------------------------------------- | -------------------------- |
| [http://localhost:3306](http://localhost:3306)  | MySQL Database             |
| [http://localhost:3000](http://localhost:3001)  | Presenter                  |
| [http://localhost:6006](http://localhost:6006)  | Presenter Storybook        |
| [http://localhost:3001](http://localhost:3000)  | Frontend                   |
| [http://localhost:6007](http://localhost:6007)  | Frontend Storybook         |
| [http://localhost:3002](http://localhost:3002)  | Admin                      |
| [http://localhost:6008](http://localhost:6008)  | Admin Storybook            |
| [http://localhost:4000](http://localhost:4000)  | Backend GraphQL Playground |
| [http://localhost:8080](http://localhost:8080)  | Documentation              |
| [http://localhost:8080](http://localhost:8025)  | Mailpit                    |
| [http://localhost:8080](http://localhost:9000)  | Authentik                  |

## Clean up docker

If you run into issues with some docker left-overs, you can always stop+remove containers and volumes:
```sh
docker compose down -v
```

Check if you still have docker containers left:
```sh
docker container ls -a
```

If so, you can do:
```sh
docker container stop $(docker container ls -qa)
docker container rm $(docker container ls -qa)
```

Prune docker caches:
```sh
docker system prune
```

Remove all your volumes:
```sh
docker volume remove $(docker volume list -q)
```

OK, this is ultima ratio, remove everything (even images) with:
```sh
docker system prune -a
```

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
