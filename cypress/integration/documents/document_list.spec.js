/// <reference types="cypress" />

context('Admin Document List', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ODWXI1TE/documents');
  });

  it('document filter and search actions', () => {
    // All documents should be displayed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);

    // Filter the document by name using the search box with one return
    cy.get('input[aria-label="file-search-input"]')
      .focus()
      .type('wonder');
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 2);
    cy.get('input[aria-label="file-search-input"]')
      .focus()
      .clear();

    // Filter the document by type using the type dropdown with two return
    cy.contains('div', 'Document type').click();
    cy.contains('small', 'Other').click();
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 3);

    // Add: Filter the document by tag using the tag dropdown with 1 return
    cy.contains('div', 'Tag').click();
    cy.contains('span', 'dbGaP').click();
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 2);
  });

  it('sorts documents', () => {
    // All documents should be displayed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);

    cy.get('tr')
      .eq(1)
      .should('contain', 'word.js');

    // Sort documents by create date using the last updated column
    cy.contains('th', 'Last Updated').click();
    cy.get('tr')
      .eq(1)
      .should('contain', 'old.doc');
    cy.get('tr')
      .eq(5)
      .should('contain', 'word.js');

    // Reverse sort
    cy.contains('th', 'Last Updated').click();
    cy.get('tr')
      .eq(5)
      .should('contain', 'old.doc');
    cy.get('tr')
      .eq(1)
      .should('contain', 'word.js');

    // Sort by name
    cy.contains('th', 'Document Details').click();
    cy.get('tr')
      .eq(1)
      .should('contain', 'cover.key');
    cy.get('tr')
      .eq(5)
      .should('contain', 'word.js');
  });

  it('List out document with delete buttons', () => {
    // List out all the documents
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);
    // Has delete, copy and download button for each document
    cy.get('[data-testid="delete-button"]').should('have.length', 5);
    cy.get('[data-testid="copy-file-id"]').should('have.length', 5);
    cy.get('[data-testid="download-file"]').should('have.length', 5);
    // Select all the documents
    cy.get('tr th:first').click();
    // Has batch download button and batch delete button
    cy.get('[data-testid="batch-download"]').should('exist');
    cy.get('[data-testid="batch-delete"]').should('exist');
  });
});

context('Investigator Document List', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/documents');
  });

  it('List out document without delete buttons', () => {
    // List out all the documents
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);
    // No delete button on the document list actions
    cy.get('i').should('not.have.class', 'trash');
    // Has copy and download button for each document
    cy.get('[data-testid="copy-file-id"]').should('have.length', 5);
    cy.get('[data-testid="download-file"]').should('have.length', 5);
    // Select all the documents
    cy.get('tr th:first').click();
    // Has batch download button but no batch delete button
    cy.get('[data-testid="batch-download"]').should('exist');
    cy.get('[data-testid="batch-delete"]').should('not.exist');
  });
});
