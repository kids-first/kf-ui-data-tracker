context('Join screen', () => {
  before(() => cy.resetdb());

  beforeEach(() => {
    cy.login([]);
  });

  it('displays error when token is invalid', () => {
    cy.visit('/join?token=abc');

    cy.contains('Error').should('exist');

    cy.visit('/join?token=00000000-0000-0000-0000-000000000000');
    cy.contains('Error').should('exist');
  });

  it('directs back to home with no token', () => {
    cy.visit('/join');

    cy.location('pathname').should('eq', '/');
  });
});
