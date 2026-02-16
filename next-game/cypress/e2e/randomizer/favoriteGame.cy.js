describe('Улюблені ігри', () => {
    it('повинен додати гру в улюблені та відобразити її в профілі', () => {

        cy.login('test@test.com', 'password123');


        cy.intercept('POST', '**/api/login').as('login');
        cy.wait("@login");

        cy.visit('/randomizer');
        cy.get('button').contains(/Рандом|Randomize/i).click();


        cy.get('h3').then(($h3) => {
            const gameName = $h3.text();
            cy.get('button').contains(/Зберегти|Save/i).click();
            cy.contains(/Профіль|Profile/i).click();


            cy.get('[class*="favoriteCard"]').should('contain', gameName);
            cy.contains(/Remove|Видалити/i).click();
        });
    });
});