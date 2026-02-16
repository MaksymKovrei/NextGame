export const MOCK_DATA = {
    users: {
        defaultUser: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
            "favorites": [
                "1",
            ],
        },
        adminUser: {
            id: '2',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin'
        },
    },

    games: [
        {
            "id": "1",
            "name": "Fortnite",
            "genre": "Battle Royale",
            "description": "Free-to-play battle royale game",
            "platforms": ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
            "modes": ["Multiplayer", "Co-op"],
            "epicUrl": "https://store.epicgames.com/en-US/p/fortnite",
            "steamUrl": null,
            "image": "https://cdn2.unrealengine.com/egs-social-fortnite-ch5s2-bp-1920x1080-1920x1080-83a7a3a8c3e5.jpg"
        },
        {
            "id": "2",
            "name": "The Witcher 3: Wild Hunt",
            "genre": "RPG",
            "description": "Action role-playing game set in a fantasy world",
            "platforms": ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
            "modes": ["Singleplayer"],
            "epicUrl": "https://store.epicgames.com/en-US/p/the-witcher-3-wild-hunt",
            "steamUrl": "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
            "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg"
        },
        {
            "id": "3",
            "name": "Rocket League",
            "genre": "Sports",
            "description": "Vehicular soccer video game",
            "platforms": ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
            "modes": ["Multiplayer", "Singleplayer"],
            "epicUrl": "https://store.epicgames.com/en-US/p/rocket-league",
            "steamUrl": "https://store.steampowered.com/app/252950/Rocket_League/",
            "image": "https://cdn2.unrealengine.com/egs-rocketleague-psyonixllc-g1a-03-1920x1080-6d3d4c5d8c3e.jpg"
        },
    ],

    tokens: {
        validToken: 'mock-jwt-token-valid',
        expiredToken: 'mock-jwt-token-expired',
    },
};

// Хелпер для додавання wildcard, якщо його немає
const normalizeUrl = (url) => {
    if (url.startsWith('**')) return url;
    if (url.startsWith('/')) return `**${url}`;
    return `**/${url}`;
};

Cypress.Commands.add('mockAllAPI', () => {
    cy.mockGamesAPI();
    cy.mockAuthAPI();
    cy.mockFavoritesAPI();
});

Cypress.Commands.add('mockGamesAPI', (games = MOCK_DATA.games) => {
    cy.intercept('GET', '**/api/games', {
        statusCode: 200,
        body: games,
    }).as('getGames');

    cy.intercept('GET', '**/api/random*', (req) => {
        const { genre, platform, mode } = req.query;
        let filtered = [...games];

        if (genre && genre !== 'all') {
            filtered = filtered.filter(g => g.genre && g.genre.toLowerCase().includes(genre.toLowerCase()));
        }
        if (platform && platform !== 'all') {
            filtered = filtered.filter(g =>
                g.platforms && g.platforms.some(p => p.toLowerCase().includes(platform.toLowerCase()))
            );
        }
        if (mode && mode !== 'all') {
            filtered = filtered.filter(g =>
                g.modes && g.modes.some(m => m.toLowerCase().includes(mode.toLowerCase()))
            );
        }

        if (filtered.length === 0) {
            req.reply({ statusCode: 404, body: { error: 'Ігор не знайдено' } });
        } else {
            const randomGame = filtered[Math.floor(Math.random() * filtered.length)];
            req.reply({ statusCode: 200, body: randomGame });
        }
    }).as('getRandomGame');
});

Cypress.Commands.add('mockAuthAPI', (options = {}) => {
    const { shouldLoginFail = false, shouldRegisterFail = false } = options;

    cy.intercept('POST', '**/api/login', (req) => {
        if (shouldLoginFail) {
            req.reply({
                statusCode: 401,
                body: { error: 'Невірна пошта або пароль' },
            });
        } else {
            req.reply({
                statusCode: 200,
                body: {
                    message: 'Успішний вхід',
                    user: MOCK_DATA.users.defaultUser,
                    token: MOCK_DATA.tokens.validToken,
                },
            });
        }
    }).as('login');

    cy.intercept('POST', '**/api/register', (req) => {
        if (shouldRegisterFail) {
            req.reply({
                statusCode: 400,
                body: { error: 'Користувач з такою поштою вже існує' },
            });
        } else {
            req.reply({
                statusCode: 201,
                body: {
                    message: 'Користувач успішно зареєстрований',
                    user: {
                        id: '999',
                        username: req.body.username,
                        email: req.body.email
                    },
                    token: MOCK_DATA.tokens.validToken,
                },
            });
        }
    }).as('register');
});

Cypress.Commands.add('mockFavoritesAPI', () => {
    let userFavorites = ['1', '2'];

    cy.intercept('POST', '**/api/games/*/like', (req) => {
        const match = req.url.match(/\/games\/([^\/]+)\/like/);
        const gameId = match ? match[1] : null;

        if (!gameId) {
            req.reply({ statusCode: 400, body: { error: 'Invalid ID' } });
            return;
        }

        if (userFavorites.includes(gameId)) {
            req.reply({
                statusCode: 400,
                body: { error: 'Гра вже в уподобаних' },
            });
        } else {
            userFavorites.push(gameId);
            req.reply({
                statusCode: 200,
                body: {
                    message: 'Гру додано до уподобаних',
                    favorites: userFavorites,
                },
            });
        }
    }).as('likeGame');

    cy.intercept('DELETE', '**/api/games/*/like', (req) => {
        const match = req.url.match(/\/games\/([^\/]+)\/like/);
        const gameId = match ? match[1] : null;

        if (gameId) {
            userFavorites = userFavorites.filter(id => id !== gameId);
        }

        req.reply({
            statusCode: 200,
            body: {
                message: 'Гру видалено з уподобаних',
                favorites: userFavorites,
            },
        });
    }).as('unlikeGame');

    cy.intercept('GET', '**/api/users/*/favorites', (req) => {
        const favoriteGames = MOCK_DATA.games.filter(game =>
            userFavorites.includes(game.id)
        );

        req.reply({
            statusCode: 200,
            body: {
                userId: MOCK_DATA.users.defaultUser.id,
                favorites: favoriteGames,
            },
        });
    }).as('getFavorites');
});

// === ВИПРАВЛЕНІ ХЕЛПЕРИ ===

Cypress.Commands.add('mockAPI', (method, url, response, alias = null) => {
    // АВТОМАТИЧНО ДОДАЄМО **
    const finalUrl = normalizeUrl(url);
    const intercept = cy.intercept(method, finalUrl, response);
    if (alias) {
        intercept.as(alias);
    }
    return intercept;
});

Cypress.Commands.add('mockAPIError', (method, url, statusCode, errorMessage) => {
    // АВТОМАТИЧНО ДОДАЄМО **
    const finalUrl = normalizeUrl(url);
    cy.intercept(method, finalUrl, {
        statusCode,
        body: { error: errorMessage },
    });
});

Cypress.Commands.add('waitForAPI', (alias, timeout = 10000) => {
    cy.wait(alias, { timeout });
});