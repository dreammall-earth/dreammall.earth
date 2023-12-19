# Dreammall.earth
[![nodejs][badge-nodejs-img]][badge-nodejs-href]
[![npm][badge-npm-img]][badge-npm-href]
[![remark-cli][badge-remark-cli-img]][badge-remark-cli-href]
[![vuepress][badge-vuepress-img]][badge-vuepress-href]

Dreammall.earth websites & services

![](presenter/src/assets/dreammall-logo.svg)

## Modules

- [Presenter](presenter/README.md)
- [Backend](backend/README.md)

## Deploy

Deploy instructions can be found in [deployment/](deplyoment/README.md)

## Commands

The following commands are available:

| Command                    | Description                                    |
|----------------------------|------------------------------------------------|
| `npm install`              | Project setup                                  |
| **Test**                   |                                                |
| `npm run test:lint`        | Run all linters                                |
| `npm run test:lint:remark` | Run linter remark                              |
| `npm test`                 | Run all tests & linters                        |
| **Documentation**          |                                                |
| `npm run docs:dev`         | Run Documentation in development mode          |
| `npm run docs:build`       | Build static documentation                     |
| **Maintenance**            |                                                |
| `npx npm-check-update`     | Check for updates                              |
| **Release**                |                                                |
| `npm run release`          | Propagate release version & generate changelog |

## How to release

Generate a new version using `npm version --git-tag-version=false patch|minor|major`.
Then run `npm run release` to propagate the new version and generate the changelog

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
