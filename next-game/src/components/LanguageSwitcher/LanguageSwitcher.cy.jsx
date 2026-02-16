import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './LanguageSwitcher.module.css';

describe('<LanguageSwitcher />', () => {

    it('відображає поточну мову (EN) та приховане меню за замовчуванням', () => {
        cy.mountWithProviders(<LanguageSwitcher />, { language: 'en' });

        cy.get(`.${styles.currentLanguage}`).should('be.visible');
        cy.get(`.${styles.code}`).should('have.text', 'EN');
        cy.get(`.${styles.flag}`).should('have.text', '🇺🇸');
        cy.get(`.${styles.arrow}`).should('have.text', '▼');
        cy.get(`.${styles.languageMenu}`).should('not.exist');
    });

    it('відкриває меню при кліку та відображає список доступних мов', () => {
        cy.mountWithProviders(<LanguageSwitcher />, { language: 'en' });

        cy.get(`button[aria-label="Change language"]`).click();

        cy.get(`.${styles.languageMenu}`).should('be.visible');
        cy.get(`.${styles.arrow}`).should('have.text', '▲');
        cy.get(`.${styles.languageOption}`).should('have.length', 2);
        cy.contains(`.${styles.languageOption}`, 'English').should('be.visible');
        cy.contains(`.${styles.languageOption}`, 'Українська').should('be.visible');
    });

    it('змінює мову на українську та закриває меню після вибору', () => {
        cy.mountWithProviders(<LanguageSwitcher />, { language: 'en' });

        cy.get(`button[aria-label="Change language"]`).click();
        cy.contains(`.${styles.languageOption}`, 'Українська').click();

        cy.get(`.${styles.languageMenu}`).should('not.exist');
        cy.get(`.${styles.code}`).should('have.text', 'UA');
        cy.get(`.${styles.flag}`).should('have.text', '🇺🇦');
    });

    it('підсвічує обрану мову класом active у списку', () => {
        cy.mountWithProviders(<LanguageSwitcher />, { language: 'ua' });

        cy.get(`button[aria-label="Change language"]`).click();

        cy.contains(`.${styles.languageOption}`, 'Українська')
            .should('have.class', styles.active);

        cy.contains(`.${styles.languageOption}`, 'English')
            .should('not.have.class', styles.active);
    });

    it('закриває меню при повторному кліку на кнопку перемикача', () => {
        cy.mountWithProviders(<LanguageSwitcher />, { language: 'en' });

        cy.get(`button[aria-label="Change language"]`).click();
        cy.get(`.${styles.languageMenu}`).should('be.visible');

        cy.get(`button[aria-label="Change language"]`).click();
        cy.get(`.${styles.languageMenu}`).should('not.exist');
    });
}); 