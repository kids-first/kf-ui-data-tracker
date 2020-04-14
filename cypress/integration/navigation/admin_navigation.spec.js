/// <reference types="cypress" />

context('Admin Navigation', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  /**
   * Test each item in the Admin dropdown and ensure that the correct page is
   * navigated to
   **/

  it('Admin Configuration', () => {
    cy.contains('div', 'Admin')
      .should('exist')
      .click();

    cy.contains('a', 'Configuration')
      .should('exist')
      .click();

    cy.url().should('include', '/configuration');
    cy.contains('h3', 'Data Tracker Configuration');
  });

  it('Admin Buckets', () => {
    cy.contains('div', 'Admin')
      .should('exist')
      .click();

    cy.contains('a', 'Buckets')
      .should('exist')
      .click();

    cy.url().should('include', '/buckets');
    cy.contains('div', 'Study Buckets').should('exist');
  });

  it('Admin Tokens', () => {
    cy.contains('div', 'Admin')
      .should('exist')
      .click();

    cy.contains('a', 'Tokens')
      .should('exist')
      .click();

    cy.url().should('include', '/tokens');
    cy.contains('h3', 'Developer Download Tokens');
  });

  it('Admin Cavatica Projects', () => {
    cy.contains('div', 'Admin')
      .should('exist')
      .click();

    cy.contains('a', 'Cavatica Projects')
      .should('exist')
      .click();

    cy.url().should('include', '/cavatica-projects');
    cy.contains('h2', 'Cavatica Projects');
  });

  it('Admin Events', () => {
    cy.contains('div', 'Admin')
      .should('exist')
      .click();

    cy.contains('a', 'Events')
      .should('exist')
      .click();

    cy.url().should('include', '/events');
    cy.contains('h3', 'Event Log');
  });

  it('Admin Users', () => {
    cy.contains('div', 'Admin')
      .should('exist')
      .click();

    cy.contains('a', 'Users')
      .should('exist')
      .click();

    cy.url().should('include', '/users');
    cy.contains('h3', 'Users');
  });
});
