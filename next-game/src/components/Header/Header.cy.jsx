import React from 'react';
import Header from './Header';
import styles from './Header.module.css';

describe('<Header />', () => {

    it('відображає навігацію для гостя та активне посилання на головну', () => {
        cy.mountWithProviders(<Header />, {
            user: null,
            initialRoute: '/'
        });

        cy.get('nav').contains('Home').should('have.class', styles.active);
        cy.get('nav').contains('Randomizer').should('not.have.class', styles.active);

        cy.contains('Log In').should('have.attr', 'href', '/login');
        cy.contains('Create Account').should('have.attr', 'href', '/register');
    });

    it('підсвічує активне посилання відповідно до поточного маршруту', () => {
        cy.mountWithProviders(<Header />, {
            user: null,
            initialRoute: '/randomizer'
        });

        cy.get('nav').contains('Randomizer').should('have.class', styles.active);
        cy.get('nav').contains('Home').should('not.have.class', styles.active);

        cy.get('nav').contains('Home').click();
        cy.get('nav').contains('Home').should('have.class', styles.active);
        cy.get('nav').contains('Randomizer').should('not.have.class', styles.active);
    });

    it('відображає навігацію для авторизованого користувача та профіль', () => {
        const mockUser = { username: 'ProGamer', email: 'test@test.com' };

        cy.mountWithProviders(<Header />, {
            user: mockUser,
            initialRoute: '/profile'
        });

        cy.contains(`Welcome, ${mockUser.username}!`).should('be.visible');

        cy.get('nav').contains('Profile').should('have.class', styles.active);
        cy.get('nav').contains('Profile').should('have.attr', 'href', '/profile');

        cy.contains('Log In').should('not.exist');
        cy.contains('Create Account').should('not.exist');
    });

    it('коректно змінює мову інтерфейсу', () => {
        cy.mountWithProviders(<Header />, { language: 'en' });

        cy.contains('Home').should('be.visible');

        cy.switchLanguage('ua');

        cy.contains('Головна').should('be.visible');
        cy.contains('Home').should('not.exist');
    });

    it('виконує функцію виходу при кліку на кнопку', () => {
        const mockUser = { username: 'User' };

        cy.mountWithProviders(<Header />, { user: mockUser });

        cy.contains('button', 'Logout').click();
        cy.get('@authLogout').should('have.been.calledOnce');
    });
});