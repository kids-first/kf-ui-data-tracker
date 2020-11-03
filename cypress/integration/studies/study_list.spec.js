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

  it('toggles table columns', () => {
    // Make sure there's no saved sorting state
    expect(localStorage.getItem('studyColumns')).to.be.null;

    // Select slack channle and bucket columns from option
    cy.contains('span.ui.dropdown', 'Change Columns').click();
    cy.contains('label', 'Slack Channel').click();
    cy.contains('label', 'Bucket').click();
    cy.contains('span.ui.dropdown', 'Change Columns').click();

    // Select slack channle and bucket columns should show on table
    cy.contains('th', 'Slack Channel').should('exist');
    cy.contains('th', 'Bucket').should('exist');

    // Clear storage for other tests
    cy.clearLocalStorage('studyColumns');
  });

  it('filters studies by name', () => {
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

  it('sorts studies', () => {
    // Make sure there's no saved sorting state
    expect(localStorage.getItem('studyColumns')).to.be.null;

    // All studies should be displayed
    cy.get('table')
      .find('tr')
      .its('length')
      .should('eq', 5);

    // By default (sorting by study name in descending order)
    cy.get('td')
      .eq(0)
      .should('contain', "Mr. Meow's Memorable Meme Emporium");

    // Click on kfId column title to sort by kfId
    cy.contains('th', 'Kids First ID')
      .click()
      .should(() => {
        expect(
          JSON.parse(localStorage.getItem('studyColumns')).allStudySorting
            .column,
        ).to.be.eq('kfId');
        expect(
          JSON.parse(localStorage.getItem('studyColumns')).allStudySorting
            .direction,
        ).to.be.eq('ascending');
      });

    // Click on kfId column title again to change sorting direction
    cy.contains('th', 'Kids First ID')
      .click()
      .should(() => {
        expect(
          JSON.parse(localStorage.getItem('studyColumns')).allStudySorting
            .column,
        ).to.be.eq('kfId');
        expect(
          JSON.parse(localStorage.getItem('studyColumns')).allStudySorting
            .direction,
        ).to.be.eq('descending');
      });

    // First study should change to "incentivize leading-edge functionalities"
    cy.get('td')
      .eq(0)
      .should('contain', 'incentivize leading-edge functionalities');

    // Clear storage for other tests
    cy.clearLocalStorage('studyColumns');
  });

  it('toggles my studies', () => {
    cy.clearLocalStorage('onlyMyStudies');

    // Make sure there's no saved state
    expect(localStorage.getItem('onlyMyStudies')).to.be.null;
    // We should see all the studies
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 4);

    // Turn on only show my studies
    cy.get('[data-cy="toggle my studies"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('onlyMyStudies')).to.be.eq('true');
      });

    // We should see onlt my studies
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 1);

    // Turn off only show my studies
    cy.get('[data-cy="toggle my studies"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('onlyMyStudies')).to.be.eq('false');
      });

    // We should only see our studies
    cy.get('[data-cy="study name"]')
      .its('length')
      .should('eq', 4);

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

  it('only shows my studies', () => {
    // Select a study to be added to
    cy.contains('monetize').click();

    // Add self to that study
    cy.get('[href="/study/SD_ODWXI1TE/collaborators"]').click();
    cy.contains('button', 'ADD COLLABORATOR')
      .click()
      .get('input.search')
      .first()
      .click();
    cy.contains('div[role="option"]', 'Bobby Tables').click();
    cy.contains('div', 'Choose role').click();
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
  it('redirects to welcome page', () => {
    cy.url().should('contain', '/welcome');
    cy.contains('h1', 'Welcome').should('exist');
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
