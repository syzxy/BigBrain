import { cyan } from "@material-ui/core/colors"

context('happy2', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/');
  });
  it('successfully done login flow', () => {
    const email = 'sam@fakemail.com';
    const password = '1';

    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=password')
      .focus()
      .type(password);

    cy.get('button[type = submit]')
      .click();

    // Success
    // start a game, end a game
    cy.get('Button[name="startgamebutton0"]')
      .click();
    cy.contains('Start')
      .click();
    cy.contains('Next')
      .click();
    cy.contains('End')
      .click();
    cy.contains('YES')
      .click();

    // log out
    cy.get('button[name=logout]')
      .click();

    // log in again
    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=password')
      .focus()
      .type(password);

    cy.get('button[type = submit]')
      .click();
  })
})
