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
    cy.get('[data-testid="invite-button"]').should('be.disabled');

    cy.get('[data-cy="study selector"]')
      .click()
      .contains('SD_ME0W')
      .click();
    cy.get('.content .header').click();
    cy.get('[data-testid="invite-button"]').should('be.disabled');

    cy.get('[data-cy="user email"]')
      .click()
      .type('test@example.com');
    cy.get('[data-testid="invite-button"]').should('be.enabled');

    cy.get('[data-testid="invite-button"]').click();

    cy.contains('.message', 'Invite Sent')
      .should('exist')
      .contains('test@example.com')
      .should('exist');
  });

  it('errors on bad email', () => {
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
      .type('test@example');

    cy.get('[data-testid="invite-button"]').click();

    cy.contains('.message', 'Error')
      .should('exist')
      .contains('Enter a valid email')
      .should('exist');
  });

  it('does not display for non-admins', () => {
    cy.as(['Investigators']);

    cy.contains('button', 'Invite User').should('not.exist');
  });
});
