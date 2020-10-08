/// <reference types="cypress" />

context('Add Study', () => {
  before(() => {
    cy.resetdb();
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.as(['Administrators']);
  });

  it('navigates to new study route', () => {
    cy.clearLocalStorage('onlyMyStudies');

    // Should have 4 studies to start
    cy.contains('a', 'Data Tracker').click();

    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 4);

    // Click on the add study button from the home screen
    cy.contains('a', 'Add Study')
      .should('exist')
      .click()
      .url()
      .should('include', '/new-study/info');

    // Info tab should be active and the submit button should not be enabled yet
    cy.contains('a', 'Info').should('have.class', 'active');
    cy.contains('button', 'SUBMIT').should('have.class', 'disabled');

    cy.get('input[name="name"]').type('My Study');

    // Submit should still not be active
    cy.contains('button', 'SUBMIT').should('have.class', 'disabled');

    // Go to next page
    cy.contains('button', 'NEXT').click();

    // External tab now active but the submit button should still be disabled
    cy.contains('a', 'External').should('have.class', 'active');
    cy.contains('button', 'SUBMIT').should('have.class', 'disabled');

    cy.get('input[name="externalId"]').type('phs00000000');

    // Submit button should be active now that all required fields are filled
    cy.contains('button', 'SUBMIT')
      .should('not.have.class', 'disabled')
      .click();

    cy.get('.modal').should('have.class', 'visible');
    cy.contains('div', 'Registered in Data Service');

    cy.contains('button', 'Skip ahead').click();
    cy.url().should('include', '/basic-info/info');

    // This should work if we simply navigate via the nav bar, but currently
    // the cache does not refresh when new studies are created so we need
    // to reload the page
    cy.visit('/');

    // There should now be 5 studies
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 5);
  });

  it('does not allow investigators to add studies', () => {
    cy.as(['Investigators']);
    cy.visit('/');

    // No show only my study checkbox
    cy.contains('label', 'Show only my studies').should('not.exist');

    // No add study button from the home screen
    cy.contains('a', 'Add Study').should('not.exist');
    // No access to add study pages
    cy.visit('/study/new-study/info');
    cy.contains('h2', 'Not allowed').should('exist');
    cy.visit('/study/new-study/external');
    cy.contains('h2', 'Not allowed').should('exist');
    cy.visit('/study/new-study/logistics');
    cy.contains('h2', 'Not allowed').should('exist');
  });
});
