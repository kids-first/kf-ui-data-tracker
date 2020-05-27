/// <reference types="cypress" />

context('Invite to study', () => {
  before(() => {
    cy.resetdb();
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.as(['Administrators']);
  });

  it('invites successfully', () => {
    cy.get('[href="/study/SD_ME0WME0W/collaborators"]')
      .should('exist')
      .trigger('mouseover');

    cy.contains('button', 'Add Collaborator').click();

    cy.get('#email')
      .click()
      .type('test@example.com');

    cy.get('[data-testid=invite-button]')
      .should('be.enabled')
      .click();

    cy.contains('.message', 'Invite Sent')
      .should('exist')
      .contains('sent to test@example.com')
      .should('exist');
  });

  it('does not double invite', () => {
    cy.resetdb();
    cy.visit('/');

    cy.get('[href="/study/SD_ME0WME0W/collaborators"]')
      .should('exist')
      .trigger('mouseover');

    cy.contains('button', 'Add Collaborator').click();

    cy.get('#email')
      .click()
      .type('test@example.com');

    cy.get('[data-testid=invite-button]')
      .should('be.enabled')
      .click();

    cy.contains('.message', 'Invite Sent')
      .should('exist')
      .contains('sent to test@example.com')
      .should('exist');

    cy.get('[data-testid=invite-button]')
      .should('be.enabled')
      .click();

    cy.contains('.negative', 'Invite already sent').should('exist');
  });
});
