import { generateRandomString, generateRandomEmail } from './loginHelper';

describe('template spec', () => {
  it('passes', () => {
    const randomUsername = generateRandomString(10);
    const randomEmail = generateRandomEmail();
    const updatedPasswd = generateRandomString(11);

    cy.visit('/auth/register');
    cy.url().should('contain', '/auth/register');
    cy.findByLabelText(/username/i).type(randomUsername);
    cy.findByLabelText(/e-mail/i).type(randomEmail);
    cy.findByLabelText(/password/i).type('Test123456');
    cy.findByText('register').click();

    cy.url().should('contain', '/home');
    cy.get('span.chakra-button__icon.css-1hzyiq5').click();
    // go to profile page
    cy.get('button[id="menu-list-:r9:-menuitem-:rb:"]').click();

    // change username
    cy.contains('p.chakra-text.css-0', randomUsername).should('exist');
    cy.contains('p.chakra-text.css-0', randomUsername)
      .parent()
      .within(() => {
        cy.get('button[aria-label="Edit"]').click();
      });
    cy.get('input[name="username"]').type(generateRandomString(9));
    cy.get('button[type="submit"]').click();
    cy.contains('div.chakra-alert__title', 'Update Successful').should('exist');
    cy.get('div#toast-1-title').should('exist');
    cy.get('div#toast-1-description').should(
      'contain',
      'Your username has been updated successfully.',
    );

    // change email
    cy.contains('p.chakra-text.css-0', randomEmail).should('exist');
    cy.contains('p.chakra-text.css-0', randomEmail)
      .parent()
      .within(() => {
        cy.get('button[aria-label="Edit"]').click();
      });
    cy.get('input[name="email"]').type(generateRandomEmail());
    cy.get('button[type="submit"]').click();

    cy.get('div#toast-2-title').should('exist');
    cy.get('div#toast-2-description').should(
      'contain',
      'Your email has been updated successfully.',
    );

    // change password
    cy.contains('p.chakra-text.css-0', '********').should('exist');
    cy.contains('p.chakra-text.css-0', '********')
      .parent()
      .within(() => {
        cy.get('button[aria-label="Edit"]').click();
      });
    cy.get('input[name="password"]').type(updatedPasswd);
    cy.get('button[type="submit"]').click();

    cy.get('div#toast-3-title').should('exist');
    cy.get('div#toast-3-description').should(
      'contain',
      'Your password has been updated successfully.',
    );

    // delete account
    cy.get('button[aria-label="Delete"]').click();
    cy.get('input[name="password"]').type(updatedPasswd);
    cy.get('button[type="submit"]').click();
    cy.visit('/profile');
    cy.location('pathname').should('equal', '/auth/login');
  });
});
