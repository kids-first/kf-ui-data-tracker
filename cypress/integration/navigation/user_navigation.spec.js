/// <reference types="cypress" />

context('User Navigation', () => {
  before(() => {
    cy.resetdb();
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('User Profile', () => {
    // Click on the add study button from the home screen
    cy.contains('div', 'testuser')
      .should('exist')
      .click()

    cy.contains('a', 'Profile')
      .should('exist')
      .click();

    // Should now be on the user's profile page
    cy.url().should('include', '/profile');
    cy.contains('h3', 'Your Profile');
  });

  it('User Logout', () => {
    // Click on the add study button from the home screen
    cy.contains('div', 'testuser')
      .should('exist')
      .click()
      .url()
      .should('include', '/');

    cy.contains('a', 'Logout')
      .should('exist')
      .click();

    // Should have recieved a logged out message
    cy.url().should('include', '/logout');
    cy.contains('h3', 'been logged out');
  });
});
