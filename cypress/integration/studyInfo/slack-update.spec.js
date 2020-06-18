/// <reference types="cypress" />

context('Admin Study Basic Info', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ODWXI1TE/basic-info/info');
  });

  it('Show study basic info in edit mode', () => {
    // Show slack channel name or empty message
    cy.contains('span', 'No Slack Channel').should('exist');
    // Show edit slack channel button
    cy.get('[data-testid="edit-slack"]')
      .should('exist')
      .click();
    // Input the slack name "test-slack"
    cy.get('input[aria-label="edit slack channel"]')
      .focus()
      .type('test-slack');
    cy.get('[data-testid="submit-slack"]').click();
  });
});

context('Investigator Study Basic Info', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/basic-info/info');
  });

  it('Show study basic info in read-only mode', () => {
    // Show slack channel name or empty message
    cy.contains('span', 'No Slack Channel').should('exist');
    // No edit slack channel button
    cy.get('[data-testid="edit-slack"]').should('not.exist');
  });
});
