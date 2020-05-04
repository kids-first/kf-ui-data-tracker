/// <reference types="cypress" />

context('Admin Study Releases', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/releases');
  });

  it('Show study release information', () => {
    // Show release tab from study sub navigation bar
    cy.contains('a', 'Releases').should('exist');
    // No missing release info warning
    cy.contains('p', 'No release information found.').should('not.exist');
    // Shows releases
    cy.get('div.comment')
      .its('length')
      .should('be.gt', 0);
  });
});

context('Investigator Study Releases', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/releases');
  });

  it('No access showing release information', () => {
    // Show no access warning
    cy.contains('div', "You don't have access to release information.").should(
      'exist',
    );
    // No release tab from study sub navigation bar
    cy.contains('a', 'Releases').should('not.exist');
  });
});
