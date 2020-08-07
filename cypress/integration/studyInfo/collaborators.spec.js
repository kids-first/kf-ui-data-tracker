/// <reference types="cypress" />

context('Admin Study Collaborators', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ODWXI1TE/collaborators');
  });

  it('Show collaborators information with add and remove access', () => {
    // Show no collaborator message
    cy.contains('h2', 'No Collaborators Yet').should('exist');
    // Click add collaborator button to add a user
    cy.contains('button', 'ADD COLLABORATOR').click();
    cy.contains('div', 'Choose a user').click();
    cy.contains('span', 'Michael Newman').click();
    cy.contains('div', 'Choose role').click();
    cy.get('[data-testid="add-button"]').click();
    // Show newly added collaborator
    cy.contains('div', 'Michael Newman').should('exist');
    // Close collaborator modal
    cy.get('div.actions')
      .contains('button', 'Close')
      .click();
    // Click remove collaborator button to remove the user
    cy.contains('button', 'Remove').click();
    cy.get('[data-testid="remove-confirm"]').click();
    // Show no collaborator message
    cy.contains('h2', 'No Collaborators Yet').should('exist');
  });
});

context('Investigator Study Collaborators', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/collaborators');
  });

  it('Show collaborators information without add or remove access', () => {
    // Show test collaborator
    cy.contains('div', 'Bobby Tables').should('exist');
    // No add collaborators button
    cy.contains('button', 'ADD COLLABORATOR').should('not.exist');
    // No remove collaborator button
    cy.contains('button', 'Remove').should('not.exist');
  });
});
