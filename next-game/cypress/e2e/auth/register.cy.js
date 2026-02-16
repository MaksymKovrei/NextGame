describe('Реєстрація', () => {
    const uniqueEmail = `user_${Date.now()}@test.com`;
    const uniqueUsername = `User${Date.now()}`;
    it('повинен успішно зареєструвати нового користувача', () => {
        cy.visit('/register');
        cy.get('input[name="username"]').type(uniqueUsername);
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[name="password"]').type('password123');
        cy.get('input[name="confirmPassword"]').type('password123');


        cy.get('input[type="checkbox"]').check();

        cy.get('button[type="submit"]').click();


        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.get('header').should('contain', uniqueUsername);
    });
});