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
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

    // All documents should be displayed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);

    // Filter the document by name using the search box with one return
    cy.get('input[aria-label="file-search-input"]')
      .focus()
      .type('room.bmp');
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 2);
    cy.get('input[aria-label="file-search-input"]')
      .focus()
      .clear();

    // Search by file Kids First ID
    cy.get('input[aria-label="file-search-input"]')
      .focus()
      .type('SF_00000005');
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
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

    // All documents should be displayed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);

    cy.get('tr')
      .eq(1)
      .should('contain', 'room.bmp');

    // Sort documents by create date using the last updated column
    cy.contains('th', 'Last Updated').click();
    cy.get('tr')
      .eq(1)
      .should('contain', 'above.jpeg');
    cy.get('tr')
      .eq(5)
      .should('contain', 'room.bmp');

    // Reverse sort
    cy.contains('th', 'Last Updated').click();
    cy.get('tr')
      .eq(5)
      .should('contain', 'above.jpeg');
    cy.get('tr')
      .eq(1)
      .should('contain', 'room.bmp');

    // Sort by name
    cy.contains('th', 'Document Details').click();
    cy.get('tr')
      .eq(1)
      .should('contain', 'above.jpeg');
    cy.get('tr')
      .eq(5)
      .should('contain', 'unit.docx');

    // Sort by Kids First ID
    cy.contains('label', 'Show Kids First ID').click();
    cy.contains('th', 'Kids First ID').click();
    cy.get('tr')
      .eq(1)
      .should('contain', 'SF_00000001');
    cy.get('tr')
      .eq(5)
      .should('contain', 'SF_00000017');
  });

  it('toggles file Kids First ID column', () => {
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

    // Make sure there's no saved file ID column toggle state
    expect(localStorage.getItem('showFileId')).to.be.null;

    // Kids First ID column should not show
    cy.contains('th', 'Kids First ID').should('not.exist');
    cy.contains('code', 'SF_00000005').should('not.exist');

    // Check to show file Kids First ID column
    cy.contains('label', 'Show Kids First ID').click();

    // Kids First ID column should show
    cy.contains('th', 'Kids First ID').should('exist');
    cy.contains('code', 'SF_00000005').should('exist');

    // Clear storage for other tests
    cy.clearLocalStorage('showFileId');
  });

  it('List out document with delete buttons', () => {
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

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

  it('Add, remove tags and filter by tags', () => {
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

    // List out all the documents
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);
    // DCC has a used tag should show in filter and tag option
    cy.contains('span', 'DCC').should('exist');
    cy.contains('div', 'DCC').should('exist');
    // Delete DCC tag (not used in this study)
    cy.contains('a', 'DCC')
      .children()
      .click();
    // Tag filter and tag option would remove DCC too
    cy.contains('span', 'DCC').should('not.exist');
    cy.contains('div', 'DCC').should('not.exist');
    // Add new tag NEW
    cy.get('[data-testid="tag-file"]')
      .first()
      .click();
    cy.get('[data-testid="tag-dropdown"]')
      .children()
      .first()
      .focus()
      .type('NEW');
    cy.contains('span', 'Add ').click();
    cy.get('[data-testid="tag-file-add"]').click();
    // NEW tag should appear in filter and tag option
    cy.contains('span', 'NEW').should('exist');
    cy.contains('div', 'NEW').should('exist');
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
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

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
