import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Randomizer from './Randomizer';
import styles from './Randomizer.module.css';

describe('<Randomizer />', () => {

    beforeEach(() => {
        cy.mockGamesAPI();
        cy.mockFavoritesAPI();
    });

    it('відображає початковий стан з фільтрами та плейсхолдером', () => {
        cy.mountWithProviders(<Randomizer />, { user: null });

        cy.get(`.${styles.header}`).should('be.visible');
        cy.get(`.${styles.filterSection}`).should('be.visible');
        cy.get('select').should('have.length', 3);
        cy.get(`.${styles.randomizeButton}`).should('be.visible');
        cy.get(`.${styles.placeholder}`).should('be.visible');
    });

    it('дозволяє змінювати фільтри', () => {
        cy.mountWithProviders(<Randomizer />, { user: null });

        cy.get('select').eq(0).select('RPG').should('have.value', 'RPG');
        cy.get('select').eq(1).select('PC').should('have.value', 'PC');
        cy.get('select').eq(2).select('Singleplayer').should('have.value', 'Singleplayer');
    });

    it('отримує та відображає випадкову гру при натисканні кнопки', () => {
        cy.mountWithProviders(<Randomizer />, { user: null });

        cy.get(`.${styles.randomizeButton}`).click();
        cy.wait('@getRandomGame');

        cy.get(`.${styles.result}`).should('be.visible');
        cy.get(`.${styles.gameInfo} h3`).should('not.be.empty');
    });

    it('відображає помилку, якщо ігор не знайдено', () => {
        cy.intercept('GET', '**/api/random*', {
            statusCode: 404,
            body: { error: 'Ігор не знайдено' }
        }).as('getNoGames');

        cy.mountWithProviders(<Randomizer />, { user: null });

        cy.get(`.${styles.randomizeButton}`).click();
        cy.wait('@getNoGames');

        cy.get(`.${styles.error}`).should('be.visible');
    });

    it('авторизований користувач може додати гру до улюблених', () => {
        cy.mockAPI('GET', '**/api/users/*/favorites', { favorites: [] });

        const mockUser = { id: '1', username: 'Gamer' };
        cy.mountWithProviders(<Randomizer />, { user: mockUser });

        cy.get(`.${styles.randomizeButton}`).click();
        cy.wait('@getRandomGame');

        cy.get(`.${styles.saveButton}`).should('not.be.disabled').click();
        cy.wait('@likeGame');

        cy.get(`.${styles.saveButton}`).should(($btn) => {
            const isDisabled = $btn.is(':disabled');
            const hasText = $btn.text().includes('В уподобаних');
            expect(isDisabled || hasText).to.be.true;
        });
    });

    it('неавторизований користувач перенаправляється на логін при спробі зберегти', () => {
        // Щоб перевірити навігацію, ми монтуємо Randomizer разом із фейковим роутом /login
        cy.mountWithProviders(
            <Routes>
                <Route path="/" element={<Randomizer />} />
                <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            </Routes>,
            { user: null, initialRoute: '/' }
        );

        cy.get(`.${styles.randomizeButton}`).click();
        cy.wait('@getRandomGame');

        cy.get(`.${styles.loginButton}`).click();

        // Тепер ми перевіряємо не URL, а те, чи з'явився контент сторінки логіну
        cy.get('[data-testid="login-page"]').should('be.visible');
    });

    it('кнопка "Ще раз" генерує нову гру', () => {
        cy.mountWithProviders(<Randomizer />, { user: null });

        cy.get(`.${styles.randomizeButton}`).click();
        cy.wait('@getRandomGame');

        cy.get(`.${styles.anotherButton}`).should('be.visible').click();
        cy.wait('@getRandomGame');

        cy.get(`.${styles.result}`).should('be.visible');
    });
});