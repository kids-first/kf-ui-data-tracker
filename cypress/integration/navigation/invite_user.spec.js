/// <reference types="cypress" />

context('Invite User Modal', () => {
  before(() => {
    cy.resetdb();
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.as(['Administrators']);
  });

  it('invites successfully', () => {
    cy.contains('button', 'Invite User')
      .should('exist')
      .click();

    // Fill out the form

    cy.get('[data-cy="group selector"]')
      .click()
      .contains('Investigators')
      .click();
    cy.get('.content .header').click();

    cy.get('[data-cy="study selector"]')
      .click()
      .contains('SD_ME0W')
      .click();
    cy.get('.content .header').click();

    cy.get('[data-cy="user email"]')
      .click()
      .type('test@example.com');

    cy.get('[data-cy="send invite"]').click();
  });
});
