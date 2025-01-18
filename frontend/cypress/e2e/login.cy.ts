describe('template spec', () => {
  it('passes', () => {
    cy.visit('/auth/login');
    cy.url().should('contain', '/auth/login');
    cy.get('#identifier').type('Bunte');
    cy.findByLabelText(/password/i).type(
      '$2b$10$eY8/c9ZmowANNdEheRd2C.MswcALaNcGMjKWR1nXYsoCoB./3xF5',
    );
    cy.findByText('Login User').click();

    cy.url().should('contain', '/home');
    cy.findByText('Classic').click();
    cy.url().should('contain', '/classic');
  });
});
