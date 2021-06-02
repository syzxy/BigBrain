context('signUp-creatGame-startSession-endSession-viewResult-logOut-log-In happy path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/signup');
  });
  it('Successfilly done!', () => {
    const email = 'neweruser@fakemail.com';
    const username = 'Bigbrain User';
    const password = 'new123';
    const comfirm = 'new123';

    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=username]')
      .focus()
      .type(username);

    cy.get('input[name=password]')
      .focus()
      .type(password);

    cy.get('input[name=confirm]')
      .focus()
      .type(comfirm);

    cy.get('button[type=submit]')
      .click();
    // Success

    // Create new game, update game card
    cy.get('button[name=addgame]')
      .click();

    // add game submit
    const gamename = 'game1';
    cy.get('input[name=gamename')
      .focus()
      .type(gamename);

    cy.get('button[name=submit')
      .click();

    cy.get('span[name=closeform]')
      .click();

    // start a game, end a game
    cy.get('Button[name="startgamebutton0"]')
      .click();
    cy.contains('Start')
      .click();

    // see session result
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

    cy.get('button[type=submit]')
      .click();
  })
})
