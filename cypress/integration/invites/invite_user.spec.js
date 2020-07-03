/// <reference types="cypress" />

context('Invite User Modal', () => {
  before(() => {
    cy.resetdb();
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.as(['Administrators']);
  });

  it('invites successfully', () => {
    cy.contains('button', 'Invite User')
      .should('exist')
      .click();

    // Check permission group and go back
    cy.contains('button', 'Back').should('not.exist');
    cy.contains('button', 'See Permission Groups Detail')
      .should('exist')
      .click();
    cy.get('[data-testid="user-group-header"]').should('have.length', 5);
    cy.get('[data-testid="user-group-header"]')
      .first()
      .click();
    cy.contains('[data-testid="user-group-header"]', 'Services').click();
    cy.contains('button', 'Back')
      .should('exist')
      .scrollIntoView()
      .click();

    // Fill out the form

    cy.get('[data-cy="group selector"]')
      .click()
      .contains('Investigators')
      .click();
    cy.get('.content .header').click();
    cy.get('[data-testid="invite-button"]').should('be.disabled');

    cy.get('[data-cy="study selector"]')
      .click()
      .contains('SD_ME0W')
      .click();
    cy.get('.content .header').click();
    cy.get('[data-testid="invite-button"]').should('be.disabled');

    // Add and remove individual email
    cy.get('[data-cy="user email"]')
      .click()
      .type('to-be-removed');
    cy.contains('button', 'Add to Invite List').click();
    cy.get('[data-testid="remove-all-email"]').should('exist');
    cy.get('[data-testid="remove-one-email"]')
      .should('exist')
      .click();

    // Input proper email
    cy.get('[data-cy="user email"]')
      .click()
      .type('test@example.com');
    cy.contains('button', 'Add to Invite List').click();
    cy.get('[data-testid="invite-button"]').should('be.enabled');

    // Error on repeating email input
    cy.get('[data-cy="user email"]')
      .click()
      .type('test@example.com');
    cy.contains('button', 'Add to Invite List').click();
    cy.get('[placeholder="Address added already"]').should('exist');

    // Input invalid email address (has graphql error on submit)
    cy.get('[data-cy="user email"]')
      .click()
      .type('invalid_email');
    cy.contains('button', 'Add to Invite List').click();

    // Submit the invite
    cy.get('[data-testid="invite-button"]').click();

    // test@example.com is successfully sent and invalid_email gets error
    cy.get('[data-testid="email-sent"]').should('exist');
    cy.get('[data-testid="email-error"]').should('exist');

    // Remove all email from invite list
    cy.get('[data-testid="remove-all-email"]')
      .should('exist')
      .click();

    // Go to Pending Invites (admin) page to view newly created invite
    cy.contains('button', 'Cancel').click();
    cy.contains('div.ui.dropdown.link.item[role="listbox"]', 'Admin')
      .should('exist')
      .click();
    cy.contains('a', 'Pending Invites')
      .should('exist')
      .click();

    cy.url().should('include', '/pending-invites');
    cy.contains('h3', 'Data Tracker Pending Invites').should('exist');
    cy.contains('div', 'test@example.com').should('exist');
    cy.contains('div', 'Investigators').should('exist');
    cy.contains('div', 'Invitation sent by testuser').should('exist');
    cy.contains('div', ', waiting for response.').should('exist');
    cy.contains('p', '1 Assigned Studies')
      .should('exist')
      .click();
    cy.contains('a', "Mr. Meow's Memorable Meme Emporium")
      .should('exist')
      .click();
    cy.url().should('include', '/study/SD_ME0WME0W/basic-info/info');

    // Sent email that has valid refferal token will get graphql error
    cy.contains('button', 'Invite User').click();

    cy.get('[data-cy="group selector"]')
      .click()
      .contains('Investigators')
      .click();
    cy.contains('div', 'Invite a user by email').click();
    cy.get('[data-cy="study selector"]')
      .click()
      .contains('SD_ME0W')
      .click();
    cy.contains('div', 'Invite a user by email').click();
    cy.get('[data-cy="user email"]')
      .click()
      .type('test@example.com');
    cy.contains('button', 'Add to Invite List').click();

    cy.get('[data-testid="invite-button"]').click();

    cy.get('[data-testid="email-error"]').should('exist');
  });

  it('does not display for non-admins', () => {
    cy.as(['Investigators']);

    cy.contains('button', 'Invite User').should('not.exist');
  });
});
