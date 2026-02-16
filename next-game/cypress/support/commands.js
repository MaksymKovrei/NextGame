// ***********************************************************
// SHARED COMMANDS - ЗАГАЛЬНІ КОМАНДИ ДЛЯ E2E ТА COMPONENT
// ***********************************************************

/**
 * КОМАНДИ ДЛЯ АУТЕНТИФІКАЦІЇ
 */

//Логін користувача
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
});

// Логін через API

Cypress.Commands.add('loginAPI', (email, password) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/login',
        body: { email, password },
    }).then((response) => {
        // Зберігаємо token і user в localStorage
        window.localStorage.setItem('nextgame_token', response.body.token);
        window.localStorage.setItem('nextgame_user', JSON.stringify(response.body.user));
    });
});

// Реєстрація нового користувача
Cypress.Commands.add('register', (userData) => {
    cy.visit('/register');
    cy.get('[name="username"]').type(userData.username);
    cy.get('[name="email"]').type(userData.email);
    cy.get('[name="password"]').type(userData.password);
    cy.get('[name="confirmPassword"]').type(userData.password);

    cy.get('input[type="checkbox"]').check();

    cy.get('button[type="submit"]').click();
});

// Реєстрація через API
Cypress.Commands.add('registerAPI', (userData) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/register',
        body: {
            username: userData.username,
            email: userData.email,
            password: userData.password,
        },
    }).then((response) => {
        window.localStorage.setItem('nextgame_token', response.body.token);
        window.localStorage.setItem('nextgame_user', JSON.stringify(response.body.user));
    });
});

// Вихід користувача
Cypress.Commands.add('logout', () => {
    cy.visit('/');

    cy.window().then((win) => {
        const lang = win.localStorage.getItem('nextgame_language') || 'en';


        const logoutText = lang === 'ua' ? 'Вийти' : 'Logout';

        cy.contains('button', logoutText).click();
    });
});

// Вихід через очищення localStorage
Cypress.Commands.add('logoutAPI', () => {
    window.localStorage.removeItem('nextgame_token');
    window.localStorage.removeItem('nextgame_user');
});

// Перевіряє чи користувач авторизований
Cypress.Commands.add('shouldBeAuthenticated', () => {
    cy.window().then((win) => {
        const user = win.localStorage.getItem('nextgame_user');
        const token = win.localStorage.getItem('nextgame_token');
        expect(user).to.exist;
        expect(token).to.exist;
    });
});

// Перевіряє чи користувач не авторизований
Cypress.Commands.add('shouldNotBeAuthenticated', () => {
    cy.window().then((win) => {
        const user = win.localStorage.getItem('nextgame_user');
        const token = win.localStorage.getItem('nextgame_token');
        expect(user).to.be.null;
        expect(token).to.be.null;
    });
});


// Навігація на певну сторінку
Cypress.Commands.add('navigateTo', (page) => {
    const routes = {
        home: '/',
        randomizer: '/randomizer',
        login: '/login',
        register: '/register',
        profile: '/profile',
    };

    const route = routes[page] || `/${page}`;
    cy.visit(route);
});

// Клік по навігаційному лінку
Cypress.Commands.add('clickNav', (linkText) => {
    cy.contains('nav a', linkText).click();
});

// Перевіряє чи активний певний навігаційний лінк
Cypress.Commands.add('navShouldBeActive', (linkText) => {
    cy.contains('nav a', linkText).should('have.class', 'active');
});

// Вибирає фільтри для randomizer
Cypress.Commands.add('setRandomizerFilters', (filters) => {
    if (filters.genre) {
        cy.get('select').eq(0).select(filters.genre);
    }
    if (filters.platform) {
        cy.get('select').eq(1).select(filters.platform);
    }
    if (filters.mode) {
        cy.get('select').eq(2).select(filters.mode);
    }
});

// Натискає кнопку "Randomize"
Cypress.Commands.add('clickRandomize', () => {
    cy.contains('button', /Randomize|Рандом/).click();
});

// Додає гру до улюблених
Cypress.Commands.add('addToFavorites', () => {
    cy.contains('button', /Save to Favorites|Зберегти в обране/).click();
});

// Перевіряє чи відображається результат гри
Cypress.Commands.add('shouldShowGameResult', () => {
    cy.get('[data-testid="game-result"]').should('be.visible');
    // або cy.contains('Your Random Game').should('be.visible');
});

// Перевіряє чи форма має помилку валідації
Cypress.Commands.add('shouldShowFormError', (errorMessage) => {
    cy.contains(errorMessage).should('be.visible');
});

//Перевіряє чи форма відправлена успішно
Cypress.Commands.add('shouldShowSuccess', () => {
    cy.url().should('not.include', '/login');
    cy.url().should('not.include', '/register');
});


// Перемикає мову інтерфейсу

Cypress.Commands.add('switchLanguage', (langCode) => {
    cy.get('button[aria-label="Change language"]').click();

    const langNames = {
        en: 'English',
        ua: 'Українська'
    };

    const targetName = langNames[langCode];

    cy.contains('button', targetName).should('be.visible').click();
});

// Перевіряє чи сторінка на правильній мові
Cypress.Commands.add('shouldBeInLanguage', (lang) => {
    cy.window().then((win) => {
        const currentLang = win.localStorage.getItem('nextgame_language');
        expect(currentLang).to.equal(lang);
    });
});