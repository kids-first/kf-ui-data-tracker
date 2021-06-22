/// <reference types="cypress" />

context('Admin Document Extract Config', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/documents/SF_00000016');
  });

  it('Show config button when file type is S3 Scrape', () => {
    // Config button is not showing for this non-s3 scrape file
    cy.get('[data-testid="config"]').should('not.exist');
    // Change file type to "S3 Bucket Inventory"
    cy.get('[data-testid="edit-type"]', {timeout: 10000}).click();
    cy.contains('p', 'Generated S3 bucket inventories.').click();
    cy.contains('button', 'SAVE').click();
    cy.reload()
    // Config button is now showing
    cy.get('[data-testid="config"]').should('exist');
    // Click on Config button to open config file modal
    cy.get('[data-testid="config"]')
      .eq(1)
      .click();
    cy.contains('code', 'FV_00000048_config.py').should('exist');
    cy.contains('span', 'file_ext').should('exist');
  });
});

context('Investigator Document Detail', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/study/SD_ME0WME0W/documents/SF_00000016');
  });

  it('Not show config button when file type is S3 Scrape', () => {
    // Config button is not showing for this non-s3 scrape file
    cy.get('[data-testid="config"]').should('not.exist');
    // Change file type to "S3 Bucket Inventory"
    cy.get('[data-testid="edit-type"]', {timeout: 10000}).click();
    cy.contains('p', 'Generated S3 bucket inventories.').click();
    cy.contains('button', 'SAVE').click();
    // Refresh the page
    cy.contains('button', 'All Documents').click();
    cy.contains('a', 'energy.gif').click();
    // Config button is still not showing even for a S3 Scrape
    cy.get('[data-testid="config"]').should('not.exist');
  });
});
