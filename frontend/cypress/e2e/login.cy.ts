describe('template spec', () => {
  function generateRandomString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  function generateRandomEmail() {
    const randomString = generateRandomString(8);
    return `${randomString}@example.com`;
  }

  it('passes', () => {
    const randomUsername = generateRandomString(10);
    const randomEmail = generateRandomEmail();

    cy.visit('/auth/register');
    cy.url().should('contain', '/auth/register');
    cy.findByLabelText(/username/i).type(randomUsername);
    cy.findByLabelText(/e-mail/i).type(randomEmail);
    cy.findByLabelText(/password/i).type('Test123456');
    cy.findByText('register').click();

    cy.url().should('contain', '/home');
    cy.findByText('Classic').click();
    cy.url().should('contain', '/classic');
  });
});
