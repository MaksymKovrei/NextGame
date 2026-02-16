describe('Локалізація', () => {
    it('повинен змінювати мову інтерфейсу', () => {
        cy.visit('/');

        cy.switchLanguage('ua');
        cy.get('h1').should('contain', 'Що пограти сьогодні?');

        cy.switchLanguage('en');
        cy.get('h1').should('contain', 'What to play today?');
    });
});