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
    // Show missing value warning
    cy.contains('div', 'Missing values').should('exist');
    cy.contains('a', 'Study Short Name').should('exist');
    // Show info completion sign
    cy.contains('div', '2/3 fields complete').should('exist');
    // Show Save button
    cy.contains('button', 'SAVE').should('exist');
    // Add short name input "test short name"
    cy.get('input[aria-label="shortName"]')
      .focus()
      .type('test short name');
    // Info completion tacking shows completed
    cy.contains('div', '3/3 fields complete').should('exist');
    cy.contains('a', 'Study Short Name').should('not.exist');
    // Click on step title to go the Logistics step
    cy.contains('div', 'Logistics').click();
    // Show missing value warning on the field
    cy.get('i').should('have.class', 'asterisk');
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
    // No missing value warning
    cy.contains('div', 'Missing values').should('not.exist');
    // No info completion sign
    cy.contains('div', '3/3 fields complete').should('not.exist');
    // No Save button
    cy.contains('button', 'SAVE').should('not.exist');
    // Click on Next button to go to next step (x2)
    cy.contains('button', 'NEXT').click();
    cy.contains('button', 'NEXT').click();
    // No missing value warning on the field
    cy.get('i').should('not.have.class', 'asterisk');
  });
});
