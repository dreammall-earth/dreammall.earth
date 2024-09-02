/** Generated from: features/User.Authentication.feature */
import { test } from "../../steps/fixtures.ts";

test.describe("User authentication", () => {

  test("Authentik Login", async ({ Given, page, When, Then }) => {
    await Given("I navigate to page 'authentik'", null, { page });
    await When("I submit the credentials 'akadmin' 'dreammall'", null, { page });
    await Then("I am on page 'authentik welcome'", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("features/User.Authentication.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Authentik Login": {"pickleLocation":"7:3"},
};