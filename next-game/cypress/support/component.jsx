import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { AuthContext } from '../../src/contexts/AuthContext';
import '@cypress/code-coverage/support';

import './commands';
import './api-mocks';

Cypress.Commands.add('mount', mount);

Cypress.Commands.add('mountWithProviders', (component, options = {}) => {
    const {
        user = null,
        language = 'en',
        initialRoute = '/',
        authContextValue = null,
        ...mountOptions
    } = options;

    const defaultAuthValue = {
        user,
        isLoading: false,
        isAuthenticated: !!user,
        login: cy.spy().as('authLogin'),
        register: cy.spy().as('authRegister'),
        logout: cy.spy().as('authLogout'),
    };

    const authValue = authContextValue || defaultAuthValue;

    if (user) {
        window.localStorage.setItem('nextgame_token', 'mock-valid-token');
        window.localStorage.setItem('nextgame_user', JSON.stringify(user));
    } else {
        // Якщо юзера немає, чистимо, щоб не було артефактів від попередніх тестів
        window.localStorage.removeItem('nextgame_token');
        window.localStorage.removeItem('nextgame_user');
    }
    if (language) {
        window.localStorage.setItem('nextgame_language', language);
    }

    const wrapped = (
        <MemoryRouter initialEntries={[initialRoute]}>
            <LanguageProvider>
                <AuthContext.Provider value={authValue}>
                    {component}
                </AuthContext.Provider>
            </LanguageProvider>
        </MemoryRouter>
    );

    return mount(wrapped, mountOptions);
});

Cypress.Commands.add('shouldHaveTranslation', (key, lang) => {
    const translations = {
        en: {
            'nav.home': 'Home',
            'nav.logout': 'Logout',
            'profile.welcome': 'Welcome',
        },
        ua: {
            'nav.home': 'Головна',
            'nav.logout': 'Вийти',
            'profile.welcome': 'Ласкаво просимо',
        },
    };

    const currentLang = lang || window.localStorage.getItem('nextgame_language') || 'en';
    const expectedText = translations[currentLang]?.[key] || key;

    cy.contains(expectedText, { timeout: 10000 }).should('be.visible');
});