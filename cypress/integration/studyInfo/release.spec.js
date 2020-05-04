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
    // Show test relase
    cy.contains('a', '3.63.0 - Test Publish ').should('exist');
    // Show release description in markdown (strong text)
    cy.contains('strong', 'Release Description in markdown').should('exist');
    // Show release description in markdown (list)
    cy.get('ol')
      .find('li')
      .its('length')
      .should('eq', 2);
    // Show release description in markdown (table)
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 3);
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
