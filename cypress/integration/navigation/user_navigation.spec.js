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
});
