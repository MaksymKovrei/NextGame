describe('Рандомайзер', () => {
    beforeEach(() => {
        cy.visit('/randomizer');
    });

    it('повинен видати випадкову гру за вибраними фільтрами', () => {
        cy.get('select').eq(0).select('RPG');
        cy.get('select').eq(1).select('PC');

        cy.get('button').contains(/Рандом|Randomize/i).click();

        cy.get('[class*="result"]').should('be.visible');
        cy.get('h3').should('not.be.empty');
    });
});