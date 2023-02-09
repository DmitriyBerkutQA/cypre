describe('Тестирование формы авторизации', () => {
  it('1.1 — Позитивная проверка входа', () => {
    cy.visit('https://login.qa.studio/');
    cy.get('#mail').type('german@dolnikov.ru');
    cy.get('#pass').type('iLoveqastudio1');
    cy.get('#loginButton').click();
    cy.get('#message').should('contain', 'Авторизация прошла успешно');
    cy.get('#exitMessageButton').should('be.visible');
  });

  it('1.2 — Проверка восстановления пароля', () => {
    cy.visit('https://login.qa.studio/');
    cy.get('#forgotEmailButton').click();
    cy.get('#mailForgot').type('german@dolnikov.ru');
    cy.get('#restoreEmailButton').click();
    cy.get('#message').should('contain', 'Успешно отправили пароль на e-mail');
    cy.get('#exitMessageButton').should('be.visible');
  });

  it('1.3 — Негативная проверка входа (неверный пароль)', () => {
    cy.visit('https://login.qa.studio/');
    cy.get('#mail').type('german@dolnikov.ru');
    cy.get('#pass').type('badPassword');
    cy.get('#loginButton').click();
    cy.get('#message').should('contain', 'Такого логина или пароля нет');
    cy.get('#exitMessageButton').should('be.visible');
  });

  it('1.4 — Негативная проверка входа (неверный логин)', () => {
    cy.visit('https://login.qa.studio/');
    cy.get('#mail').type('man@dolnikov.ru');
    cy.get('#pass').type('iLoveqastudio1');
    cy.get('#loginButton').click();
    cy.get('#message').should('contain', 'Такого логина или пароля нет');
    cy.get('#exitMessageButton').should('be.visible');
  });

  it('1.5 — Негативная проверка входа (логин без @)', () => {
    cy.visit('https://login.qa.studio/');
    cy.get('#mail').type('germandolnikov.ru');
    cy.get('#pass').type('iLoveqastudio1');
    cy.get('#loginButton').click();
    cy.get('#message').should('contain', 'Нужно исправить проблему валидации');
    cy.get('#exitMessageButton').should('be.visible');
  });

  it('1.6 — Проверка привидения логина к нижнему регистру', () => {
    cy.visit('https://login.qa.studio/');
    cy.get('#mail').type('GerMan@Dolnikov.ru');
    cy.get('#pass').type('iLoveqastudio1');
    cy.get('#loginButton').click();
    cy.get('#message').should('contain', 'Авторизация прошла успешно');
    cy.get('#exitMessageButton').should('be.visible');
  });
});