/// <reference types="cypress" />

context('Admin Study Logs', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ODWXI1TE/logs');
  });

  it('Show study logs with event type filter', () => {
    // Show 20 logs
    cy.get('[data-testid="event-item"]')
      .its('length')
      .should('eq', 20);
    // Use event type filter dropdown select "Study File Created"
    cy.contains('div', 'Event Type').click();
    cy.contains('span', 'Study File Created').click();
    // Show 5 marching logs
    cy.get('[data-testid="event-item"]')
      .its('length')
      .should('eq', 5);
  });
});

context('Services Study Logs', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Services']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/logs');
  });

  it('No access showing study logs', () => {
    // Show no access warning
    cy.contains('div', "You don't have access to event logs.").should('exist');
    // No event type filter dropdown
    cy.contains('div', 'Event Type').should('not.exist');
  });
});
