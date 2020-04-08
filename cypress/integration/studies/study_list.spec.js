/// <reference types="cypress" />

context('Study List', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('filters studies by name', () => {
    // All studies should be displayed
    // Need to figure out state restoration
    /*
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 4);
    */

    // Filter the studies by name using the search box
    cy.get('input[aria-label="search studies"]')
      .focus()
      .type('bench');

    // Only one study should be listed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 2);
  });

  it('toggles grid and list views', () => {
    // Should default to the table view
    cy.get('button[aria-label="see studies in list view"]').should(
      'have.class',
      'active',
    );

    // Click on the toggle button
    cy.get('button[aria-label="see studies in grid view"]')
      .should('not.have.class', 'active')
      .click()
      .should('have.class', 'active');
    cy.url().should('include', '#grid');

    // Toggle back to list view
    cy.get('button[aria-label="see studies in list view"]')
      .should('not.have.class', 'active')
      .click()
      .should('have.class', 'active');

    cy.url().should('include', '#list');
    cy.get('button[aria-label="see studies in grid view"]').should(
      'not.have.class',
      'active',
    );
  });
});
