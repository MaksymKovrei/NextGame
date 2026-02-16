import React from 'react';
import Profile from './Profile';
import styles from './Profile.module.css';

describe('<Profile />', () => {
    const mockUser = { id: '1', username: 'User', email: 'test@mail.com', role: 'user' };

    beforeEach(() => {
        cy.mockGamesAPI();
    });

    it('перенаправляє на сторінку входу, якщо користувач не авторизований', () => {
        cy.mountWithProviders(<Profile />, { user: null });
        cy.get(`.${styles.profileContainer}`).should('not.exist');
    });

    it('відображає дані користувача та список улюблених ігор', () => {
        cy.mockFavoritesAPI();
        cy.mountWithProviders(<Profile />, { user: mockUser });
        cy.wait('@getFavorites');

        cy.get(`.${styles.profileCard}`).should('contain', 'User');
        cy.get(`.${styles.statNumber}`).first().should('have.text', '2');
        cy.get(`.${styles.favoriteCard}`).should('have.length', 2);
    });

    it('скасовує очищення списку, якщо користувач не підтвердив дію (confirm: false)', () => {
        cy.mockFavoritesAPI();
        cy.mountWithProviders(<Profile />, { user: mockUser });
        cy.wait('@getFavorites');

        cy.on('window:confirm', () => false);
        cy.get(`.${styles.clearButton}`).click();

        cy.get(`.${styles.favoriteCard}`).should('have.length', 2);
    });

    it('успішно очищає всі улюблені ігри', () => {
        cy.mockFavoritesAPI();
        cy.mountWithProviders(<Profile />, { user: mockUser });
        cy.wait('@getFavorites');

        cy.on('window:confirm', () => true);
        cy.get(`.${styles.clearButton}`).click();

        cy.wait('@unlikeGame');
        cy.wait('@unlikeGame');

        cy.get(`.${styles.favoriteCard}`).should('not.exist');
        cy.get(`.${styles.emptyFavorites}`).should('be.visible');
    });

    it('показує alert, якщо видалення однієї гри завершилося помилкою', () => {
        cy.mockFavoritesAPI();

        // Переписуємо інтерцепт з аліасом прямо тут, щоб wait спрацював
        cy.intercept('DELETE', '**/api/games/*/like', {
            statusCode: 500,
            body: { error: 'Помилка видалення' }
        }).as('unlikeGameError');

        const alertStub = cy.stub().as('alertStub');
        cy.on('window:alert', alertStub);

        cy.mountWithProviders(<Profile />, { user: mockUser });
        cy.wait('@getFavorites');

        cy.get(`.${styles.removeButton}`).first().click();

        cy.wait('@unlikeGameError');
        cy.get('@alertStub').should('be.calledWith', 'Помилка видалення');
    });

    it('обробляє помилку під час масового очищення та перезавантажує список', () => {
        cy.mockFavoritesAPI();

        // Симулюємо помилку мережі
        cy.intercept('DELETE', '**/api/games/*/like', {
            forceNetworkError: true
        }).as('bulkDeleteError');

        cy.on('window:confirm', () => true);
        const alertStub = cy.stub().as('alertStubBulk');
        cy.on('window:alert', alertStub);

        // Cypress ламає тест на uncaught exceptions, тому ігноруємо їх для цього тесту
        cy.on('uncaught:exception', () => false);

        cy.mountWithProviders(<Profile />, { user: mockUser });
        cy.wait('@getFavorites');

        cy.get(`.${styles.clearButton}`).click();

        // Чекаємо на перший впавший запит
        cy.wait('@bulkDeleteError');

        // Перевіряємо, що спрацював reload (запит getFavorites в блоці catch)
        cy.wait('@getFavorites');
        cy.get('@alertStubBulk').should('be.called');
    });

    it('замінює картинку на дефолтну, якщо вона не завантажилася', () => {
        cy.mockFavoritesAPI();

        // Ігноруємо помилку, яку викидає Cypress при тригері error на img
        cy.on('uncaught:exception', () => false);

        cy.mountWithProviders(<Profile />, { user: mockUser });
        cy.wait('@getFavorites');

        cy.get(`.${styles.favoriteCard} img`).first().trigger('error');

        cy.get(`.${styles.favoriteCard} img`).first()
            .should('have.attr', 'src')
            .and('include', 'images.unsplash.com');
    });

    it('відображає повідомлення про помилку при збої завантаження', () => {
        cy.mockAPIError('GET', '**/api/users/*/favorites', 500, 'Сервер не відповідає');

        cy.mountWithProviders(<Profile />, { user: mockUser });

        cy.contains('Сервер не відповідає').should('be.visible');
    });

    it('виконує вихід із системи при кліку на кнопку logout', () => {
        cy.mockAPI('GET', '**/api/users/*/favorites', { favorites: [] });
        cy.mountWithProviders(<Profile />, { user: mockUser });

        cy.get(`.${styles.logoutButton}`).click();
        cy.get('@authLogout').should('have.been.called');
    });
});