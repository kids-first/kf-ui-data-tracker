// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import base64url from 'base64url';

// Creates a fake JWT in the localstorage. This JWT will be accepted as the
// 'devadmin' user by the development server.
Cypress.Commands.add('login', () => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const encodedHeader = base64url(JSON.stringify(header));

  const data = {
    'https://kidsfirstdrc.org/groups': [],
    'https://kidsfirstdrc.org/roles': ['ADMIN'],
    iss: 'https://kids-first.auth0.com/',
    sub: 'google-oauth2|000000000000000000000',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    azp: 'LXcP6IRVwSg6OzkqGx9YASgpVdpGg2Ju',
    scope: 'openid profile email',
  };
  const encodedData = base64url(JSON.stringify(data));
  const token = encodedHeader + '.' + encodedData;
  window.localStorage.setItem('accessToken', token);
});