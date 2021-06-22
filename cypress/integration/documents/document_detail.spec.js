/// <reference types="cypress" />

context('Admin Document Detail', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_W2PQV9FJ/documents');
  });

  it('Edit document approval status and add tags', () => {
    cy.wait(500)
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

    // List out all the documents
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 7);
    // Click on the first document to go to detail page
    cy.contains('a', 'international.webm').click();
    // Add tag
    cy.get('[data-testid="tag-file"]')
      .first()
      .click();
    cy.get('[data-testid="tag-dropdown"] > .search').type('abc{enter}');
    cy.get('[data-testid="tag-file-add"]').click();
    // Go back to document list
    cy.contains('button', 'All Documents').click();
    // Filter the document by tag Email with 1 return
    cy.get('[data-testid="file-list-mode"]').click();
    cy.contains('div', 'Tag').click();
    cy.contains('span', 'Email').click();
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 3);
  });

  it('Show document detail with delete button and edit button', () => {
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

    // List out all the documents
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 7);
    // Click on the first document to go to detail page
    cy.contains('a', 'international.webm').click();
    // No delete button
    cy.get('i').should('have.class', 'trash');
    // No edit button
    cy.get('i').should('have.class', 'pencil');
    // No add tag button
    cy.get('i').should('have.class', 'add');
  });
});

context('Investigator Document Detail', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/documents');
  });

  it('Show document detail with edit button without delete button', () => {
    // Set to file list mode
    cy.get('[data-testid="file-list-mode"]').click();

    // List out all the documents
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 6);
    // Click on the first document to go to detail page
    cy.contains('a', 'energy.gif').click();
    // No delete button
    cy.get('i').should('not.have.class', 'trash');
    // Has edit button
    cy.get('[data-testid="edit-title"]').should('exist');
    // Has add tag button
    cy.get('[data-testid="tag-file"]').should('exist');
    // Has remove tag button
    cy.get('[data-testid="remove-tag"]').should('exist');
  });
});
