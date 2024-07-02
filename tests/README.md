# End-to-End Testing

[![nodejs][badge-nodejs-img]][badge-nodejs-href]
[![npm][badge-npm-img]][badge-npm-href]
[![eslint][badge-eslint-img]][badge-eslint-href]
[![vuepress][badge-vuepress-img]][badge-vuepress-href]

![](../presenter/src/assets/dreammall-logo.svg)

End-to-End Testing the DreamMall Software with Cypress utilizing
- [cypress-io/github-action](https://github.com/marketplace/actions/cypress-io) caching the Cypress installation and dependencies for fast Cypress CI initialization
- [Cucumber](https://cucumber.io/docs/gherkin/reference/) for human-readable test specifications
- [Multiple Cucumber HTML Reporter](https://github.com/WasiqB/multiple-cucumber-html-reporter/tree/main) to create easy readable, and searchable HTML reports enriched with metadata

## What is covered
The tested features are organized in [feature files](cypress/e2e/features) written in [Gherkin syntax](https://cucumber.io/docs/gherkin/).

These features of the DreamMall software are covered by the end-to-end tests:
- [User.Authentication](cypress/e2e/features/User.Authentication.feature)
  - Authentik
    - Login
    - Refresh and Stay logged in
    - Logout

  - DreamMall
    - Login
    - Refresh and Stay logged in
    - Logout

## Testing the application
Running and testing the application requires `nodejs` (`>= v21`), `npm` and `docker`.

### Boot up the test system
Follow the setup in the [end-to-end test workflow](.github/workflows/e2e.run.tests.yml).

### Run the tests
At first the required packages have to be install 
```bash
npm install
```

For testing on your local machine
```bash
# run all tests
npm run cypress:run

# or open Cypress' interactive test console
npm run cypress:open
```

## Commands

| Command                    | Description                                   |
| -------------------------- | --------------------------------------------- |
| **Installation*-           |                                               |
| `npm install`              | Project setup                                 |
| **Run Cypress*-            |                                               |
| `npm run cypress:open`     | Open Cypress GUI                              |
| `npm run cypress:run`      | Run all Cypress tests headless in CLI         |
| **Linting*-                |                                               |
| `npm run test:lint`        | Run Eslint                                    |
| **Documentation*-          |                                               |
| `npm run docs:dev`         | Run documentation locally in development mode |
| `npm run docs:build`       | Build static documentation                    |
| **Maintenance*-            |                                               |
| `npm run update`           | Check for updates                             |

### Update

Retrieve a list of updatable packages by running `npm run update`.

Appending `-u` will also update the packages in the `package.json`.
Afterwards run `npm install`.

```bash
npm run update -- -u
npm install
```

## License

[Apache 2.0](./LICENSE)

<!-- Badges -->
[badge-nodejs-img]: https://img.shields.io/badge/nodejs-%3E%3D21-blue
[badge-nodejs-href]:  https://nodejs.org/

[badge-npm-img]: https://img.shields.io/badge/npm-latest-blue
[badge-npm-href]: https://www.npmjs.com/package/npm

[badge-eslint-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fpresenter%2Fpackage.json&query=devDependencies.eslint&label=eslint&color=yellow
[badge-eslint-href]: https://eslint.org/

[badge-vuepress-img]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fpresenter%2Fpackage.json&query=devDependencies.vuepress&label=vuepress&color=orange
[badge-vuepress-href]: https://vuepress.vuejs.org/
