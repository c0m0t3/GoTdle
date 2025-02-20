import { generateRandomString, generateRandomEmail } from './loginHelper';

describe('template spec', () => {
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
