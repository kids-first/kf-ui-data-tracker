/// <reference types="cypress" />

context('Admin Study List', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Administrators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('filters studies by name', () => {
    cy.contains('label', 'Show only my studies').click();
    // All studies should be displayed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 5);

    // Filter the studies by name using the search box
    cy.get('input[aria-label="search studies"]')
      .focus()
      .type('embrace');

    // Only one study should be listed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 2);
  });

  it('toggles my studies', () => {
    cy.clearLocalStorage('onlyMyStudies');

    // Make sure there's no saved state
    expect(localStorage.getItem('onlyMyStudies')).to.be.null;
    // We should only see our studies
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 1);

    // Turn off only show my studies
    cy.get('[data-cy="toggle my studies"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('onlyMyStudies')).to.be.eq('false');
      });

    // We should see all studies
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 4);

    // Turn back on only show my studies
    cy.get('[data-cy="toggle my studies"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('onlyMyStudies')).to.be.eq('true');
      });

    // We should only see our studies
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 1);

    // Clear storage for other tests
    cy.clearLocalStorage('onlyMyStudies');
  });

  it('toggles full width', () => {
    cy.clearLocalStorage('fullWidth');

    // Make sure there's no saved state
    expect(localStorage.getItem('fullWidth')).to.be.null;

    // The table row should be in a container same as the heading
    cy.get('div.page')
      .find('.ui.container.grid')
      .its('length')
      .should('eq', 2);

    // Toggle into full width mode and check that it's saved in localStorage
    cy.get('[data-cy="toggle width button"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('fullWidth')).to.be.eq('true');
      });

    // The table row should no longer be in a container
    cy.get('div.page')
      .find('.ui.container.grid')
      .its('length')
      .should('eq', 1);

    // Toggle back into compressed mode
    cy.get('[data-cy="toggle width button"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('fullWidth')).to.be.eq('false');
      });

    // Clear storage for other tests
    cy.clearLocalStorage('fullWidth');
  });

  it('toggles grid and list views', () => {
    cy.contains('label', 'Show only my studies').click();
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

  it('only shows my studies', () => {
    cy.get('[data-cy="toggle my studies"]').click();
    // Select a study to be added to
    cy.contains('monetize').click();

    // Add self to that study
    cy.get('[href="/study/SD_ODWXI1TE/collaborators"]').click();
    cy.contains('button', 'ADD COLLABORATOR')
      .click()
      .get('input.search')
      .click();
    cy.contains('div[role="option"]', 'testuser').click();
    cy.contains('button', 'Add').click();

    cy.visit('/');

    // The user should be in two studies now
    cy.get('[data-cy="toggle my studies"]').click();
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 2);

    // All studies should still be visible
    cy.get('[data-cy="toggle my studies"]').click();
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 4);
  });
  it('has notifications', () => {
    cy.get('table').should('not.exist');
  });
});

context('Unauthed Study List', () => {
  before(() => cy.as([]));

  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('displays no studies', () => {
    // Should test that no studies are displayed and the user is told that
    // they are not allowed to view any studies
    cy.get('table').should('not.exist');
  });
});

context('Investigator Study List', () => {
  before(() => {
    cy.resetdb();
    cy.as(['Investigators']);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it("only shows investigator's studies", () => {
    cy.contains('label', 'Show only my studies').should('not.exist');

    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 2);
  });
});
