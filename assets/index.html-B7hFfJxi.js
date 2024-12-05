import{_ as t}from"./dreammall-logo-BlW2bKby.js";import{_ as n,c as s,a,o as r}from"./app-BOmc8sb4.js";const i={};function l(d,e){return r(),s("div",null,e[0]||(e[0]=[a('<h1 id="end-to-end-testing" tabindex="-1"><a class="header-anchor" href="#end-to-end-testing"><span>End-to-End Testing</span></a></h1><p><a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/nodejs-&gt;%3D21-blue" alt="nodejs"></a><a href="https://www.npmjs.com/package/npm" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/npm-latest-blue" alt="npm"></a><a href="https://eslint.org/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdreammall-earth%2Fdreammall.earth%2Fmaster%2Fpresenter%2Fpackage.json&amp;query=devDependencies.eslint&amp;label=eslint&amp;color=yellow" alt="eslint"></a></p><p><img src="'+t+`" alt=""></p><p>End-to-End Testing the DreamMall Software with Cypress utilizing</p><ul><li><a href="https://github.com/marketplace/actions/cypress-io" target="_blank" rel="noopener noreferrer">cypress-io/github-action</a> caching the Cypress installation and dependencies for fast Cypress CI initialization</li><li><a href="https://cucumber.io/docs/gherkin/reference/" target="_blank" rel="noopener noreferrer">Cucumber</a> for human-readable test specifications</li><li><a href="https://github.com/WasiqB/multiple-cucumber-html-reporter/tree/main" target="_blank" rel="noopener noreferrer">Multiple Cucumber HTML Reporter</a> to create easy readable, and searchable HTML reports enriched with metadata</li></ul><h2 id="what-is-covered" tabindex="-1"><a class="header-anchor" href="#what-is-covered"><span>What is covered</span></a></h2><p>The tested features are organized in <a href="cypress/e2e/features">feature files</a> written in <a href="https://cucumber.io/docs/gherkin/" target="_blank" rel="noopener noreferrer">Gherkin syntax</a>.</p><p>These features of the DreamMall software are covered by the end-to-end tests:</p><ul><li><a href="cypress/e2e/features/User.Authentication.feature">User.Authentication</a><ul><li><p>Authentik</p><ul><li>Login</li><li>Refresh and Stay logged in</li><li>Logout</li></ul></li><li><p>DreamMall</p><ul><li>Login</li><li>Refresh and Stay logged in</li><li>Logout</li></ul></li></ul></li></ul><h2 id="testing-the-application" tabindex="-1"><a class="header-anchor" href="#testing-the-application"><span>Testing the application</span></a></h2><p>Running and testing the application requires <code>nodejs</code> (<code>&gt;= v21</code>), <code>npm</code> and <code>docker</code>.</p><h3 id="boot-up-the-test-system" tabindex="-1"><a class="header-anchor" href="#boot-up-the-test-system"><span>Boot up the test system</span></a></h3><p>Follow the setup in the <a href=".github/workflows/e2e.run.tests.yml">end-to-end test workflow</a>.</p><h3 id="run-the-tests" tabindex="-1"><a class="header-anchor" href="#run-the-tests"><span>Run the tests</span></a></h3><p>At first the required packages have to be install</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">npm</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>For testing on your local machine</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token comment"># run all tests</span></span>
<span class="line"><span class="token function">npm</span> run cypress:run</span>
<span class="line"></span>
<span class="line"><span class="token comment"># or open Cypress&#39; interactive test console</span></span>
<span class="line"><span class="token function">npm</span> run cypress:open</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="commands" tabindex="-1"><a class="header-anchor" href="#commands"><span>Commands</span></a></h2><table><thead><tr><th>Command</th><th>Description</th></tr></thead><tbody><tr><td>*<em>Installation</em>-</td><td></td></tr><tr><td><code>npm install</code></td><td>Project setup</td></tr><tr><td>*<em>Run Cypress</em>-</td><td></td></tr><tr><td><code>npm run cypress:open</code></td><td>Open Cypress GUI</td></tr><tr><td><code>npm run cypress:run</code></td><td>Run all Cypress tests headless in CLI</td></tr><tr><td>*<em>Linting</em>-</td><td></td></tr><tr><td><code>npm run test:lint</code></td><td>Run Eslint</td></tr><tr><td>*<em>Maintenance</em>-</td><td></td></tr><tr><td><code>npm run update</code></td><td>Check for updates</td></tr></tbody></table><h3 id="update" tabindex="-1"><a class="header-anchor" href="#update"><span>Update</span></a></h3><p>Retrieve a list of updatable packages by running <code>npm run update</code>.</p><p>Appending <code>-u</code> will also update the packages in the <code>package.json</code>. Afterwards run <code>npm install</code>.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">npm</span> run update -- <span class="token parameter variable">-u</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="license" tabindex="-1"><a class="header-anchor" href="#license"><span>License</span></a></h2><p><a href="./LICENSE">Apache 2.0</a></p>`,26)]))}const c=n(i,[["render",l],["__file","index.html.vue"]]),h=JSON.parse('{"path":"/tests/","title":"End-to-End Testing","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"What is covered","slug":"what-is-covered","link":"#what-is-covered","children":[]},{"level":2,"title":"Testing the application","slug":"testing-the-application","link":"#testing-the-application","children":[{"level":3,"title":"Boot up the test system","slug":"boot-up-the-test-system","link":"#boot-up-the-test-system","children":[]},{"level":3,"title":"Run the tests","slug":"run-the-tests","link":"#run-the-tests","children":[]}]},{"level":2,"title":"Commands","slug":"commands","link":"#commands","children":[{"level":3,"title":"Update","slug":"update","link":"#update","children":[]}]},{"level":2,"title":"License","slug":"license","link":"#license","children":[]}],"git":{},"filePathRelative":"tests/README.md"}');export{c as comp,h as data};
