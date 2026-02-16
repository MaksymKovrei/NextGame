import React from 'react';
import Home from './Home';
import styles from './Home.module.css';

describe('<Home />', () => {

    it('відображає головний екран із заголовком та підзаголовком', () => {
        cy.mountWithProviders(<Home />, { language: 'en' });

        cy.get(`.${styles.home}`).should('be.visible');
        cy.get(`.${styles.hero}`).should('be.visible');
        cy.get(`.${styles.title}`).should('be.visible').and('not.be.empty');
        cy.get(`.${styles.subtitle}`).should('be.visible').and('not.be.empty');
    });

    it('містить активну кнопку заклику до дії з правильним посиланням', () => {
        cy.mountWithProviders(<Home />, { language: 'en' });

        cy.get(`.${styles.ctaButtons}`).should('exist');
        cy.get(`.${styles.primaryButton}`)
            .should('be.visible')
            .should('have.attr', 'href', '/randomizer');
    });

    it('не відображає приховану кнопку каталогу', () => {
        cy.mountWithProviders(<Home />);

        cy.get(`.${styles.secondaryButton}`).should('not.exist');
    });

    it('відображає контент українською мовою при відповідному налаштуванні', () => {
        cy.mountWithProviders(<Home />, { language: 'ua' });

        cy.get(`.${styles.title}`).should('not.be.empty');
        cy.get(`.${styles.subtitle}`).should('not.be.empty');
        cy.get(`.${styles.primaryButton}`).should('not.be.empty');
    });
});