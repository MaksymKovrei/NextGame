describe('Авторизація', () => {
    it('повинен успішно залогінити існуючого користувача', () => {
    const userData = {email: "test@test.com", password: "password123"};
        cy.login(userData.email, userData.password);

        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.get('header').should('be.visible');
        cy.get('header').should('contain', 'Profile');
        cy.visit("/profile");
        cy.contains(userData.email);
    });

    it('повинен показати помилку при невірних даних', () => {
        cy.login('wrong@mail.com', 'wrongpass');
        cy.get('[class*="error"]').should('be.visible');
    });
});