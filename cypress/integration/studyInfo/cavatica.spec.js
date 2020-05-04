/// <reference types="cypress" />

context('Admin Study Cavatica', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ODWXI1TE/cavatica');
  });

  it('Show study Cavatica project in edit mode', () => {
    // Show missing project warning
    cy.contains('div', 'Missing projects').should('exist');
    // Show no project warning
    cy.contains('div', 'No linked Cavatica projects.').should('exist');
    // Show link project button
    cy.contains('button', 'LINK PROJECT').should('exist');
    // Show add project button
    cy.contains('button', 'NEW PROJECT').should('exist');
    // Click open the link project modal
    cy.contains('button', 'LINK PROJECT').click();
    // Show sync project button
    cy.contains('button', 'SYNC PROJECTS').should('exist');
    // Show sync project warning
    cy.contains(
      'p',
      'Projects created recently from Cavatica may require a sync before being available for linking.',
    ).should('exist');
  });
});

context('Investigator Study Cavatica', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/cavatica');
  });

  it('Show study Cavatica project in read-only mode', () => {
    // No missing project warning
    cy.contains('div', 'Missing projects').should('not.exist');
    // Show no project warning
    cy.contains('div', 'No linked Cavatica projects.').should('exist');
    // No link project button
    cy.contains('button', 'LINK PROJECT').should('not.exist');
    // No add project button
    cy.contains('button', 'NEW PROJECT').should('not.exist');
  });
});
