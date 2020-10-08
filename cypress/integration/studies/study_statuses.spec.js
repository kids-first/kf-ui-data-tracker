/// <reference types="cypress" />

context('Admin Study Status', () => {
  before(() => {
    cy.clearLocalStorage('onlyMyStudies');
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
    // Always enable the status columns
    cy.contains('span.ui.dropdown', 'Change Columns').click();
    cy.contains('label', 'Sequencing Status').click();
    cy.contains('label', 'Ingestion Status').click();
    cy.contains('label', 'Phenotype Status').click();
    cy.contains('span.ui.dropdown', 'Change Columns').click();
  });

  it('changes sequencing status', () => {
    // All documents should have unknown sequencing status
    cy.get('[data-cy="sequencing status cell"]')
      .its('length')
      .should('eq', 4);

    cy.get('[data-cy="sequencing status cell"]')
      .find('div.ui.dropdown')
      .should('exist');

    // Change status of first Unknown study
    cy.contains('[data-cy="sequencing status cell"]', 'Unknown')
      .should('have.class', 'error')
      .click()
      .contains('span.text', 'Not Started')
      .click();

    cy.get('[data-cy="sequencing status cell"]')
      .filter('.error')
      .should('have.length', 3);
  });

  it('changes ingestion status', () => {
    // All documents should have unknown ingestion status
    cy.get('[data-cy="ingestion status cell"]')
      .its('length')
      .should('eq', 4);

    cy.get('[data-cy="ingestion status cell"]')
      .find('div.ui.dropdown')
      .should('exist');

    // Change status of first Unknown study
    cy.contains('[data-cy="ingestion status cell"]', 'Unknown')
      .click()
      .contains('Not Started')
      .click();

    cy.get('[data-cy="ingestion status cell"]')
      .filter('.error')
      .should('have.length', 3);
  });

  it('changes phenotype status', () => {
    // All documents should have unknown phenotype status
    cy.get('[data-cy="phenotype status cell"]')
      .its('length')
      .should('eq', 4);

    cy.get('[data-cy="phenotype status cell"]')
      .find('div.ui.dropdown')
      .should('exist');

    // Change status of first Unknown study
    cy.contains('[data-cy="phenotype status cell"]', 'Unknown').click();
    cy.contains('span.text', 'Not Received').click();

    cy.get('[data-cy="phenotype status cell"]')
      .filter('.error')
      .should('have.length', 3);
  });
});

context('Investigator Study Status', () => {
  before(() => {
    cy.clearLocalStorage('onlyMyStudies');
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.contains('span.ui.dropdown', 'Change Columns').click();
    cy.contains('label', 'Sequencing Status').click();
    cy.contains('label', 'Ingestion Status').click();
    cy.contains('label', 'Phenotype Status').click();
    cy.contains('span.ui.dropdown', 'Change Columns').click();
  });

  it('cannot change sequencing status', () => {
    // Only one study should be available
    cy.get('[data-cy="sequencing status cell"]')
      .its('length')
      .should('eq', 1);

    // There should be no dropdown to change status
    cy.get('[data-cy="sequencing status cell"]')
      .find('div.ui.dropdown')
      .should('not.exist');
  });

  it('cannot change ingestion status', () => {
    // Only one study should be available
    cy.get('[data-cy="ingestion status cell"]')
      .its('length')
      .should('eq', 1);

    // There should be no dropdown to change status
    cy.get('[data-cy="ingestion status cell"]')
      .find('div.ui.dropdown')
      .should('not.exist');
  });

  it('cannot change phenotype status', () => {
    // Only one study should be available
    cy.get('[data-cy="phenotype status cell"]')
      .its('length')
      .should('eq', 1);

    // There should be no dropdown to change status
    cy.get('[data-cy="phenotype status cell"]')
      .find('div.ui.dropdown')
      .should('not.exist');
  });
});
