const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const NODE_ENV = process.env.NODE_ENV || 'development';

const corsOptions = {
    // В production використовуємо CORS_ORIGIN з environment
    // В development дозволяємо localhost
    origin: function (origin, callback) {
        // Allowed origins
        const allowedOrigins = [
            process.env.CORS_ORIGIN, // Production frontend URL
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
        ].filter(Boolean); // Видаляємо undefined

        // Дозволяємо requests без origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        // Перевіряємо чи origin в списку дозволених
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            console.log(`Allowed origins:`, allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// Застосувати CORS
app.use(cors(corsOptions));
app.use(express.json());

// Шляхи до файлів
const DATA_DIR = path.join(__dirname, 'data');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Допоміжні функції для роботи з файлами
async function readGames() {
    try {
        const data = await fs.readFile(GAMES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading games:', error);
        return [];
    }
}

async function writeGames(games) {
    try {
        await fs.writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
    } catch (error) {
        console.error('Error writing games:', error);
    }
}

async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
}

async function writeUsers(users) {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users:', error);
    }
}

// Для перевірки токена
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Необхідний токен доступу' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недійсний або прострочений токен' });
        }
        req.user = user;
        next();
    });
}

// ============ ЕНДПОІНТИ АУТЕНТИФІКАЦІЇ ============

// Реєстрація
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Всі поля обов\'язкові' });
        }

        const users = await readUsers();

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Користувач з такою поштою вже існує' });
        }

        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Це ім\'я користувача вже зайняте' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            favorites: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeUsers(users);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Користувач успішно зареєстрований',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Пошта та пароль обов\'язкові' });
        }

        const users = await readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Невірна пошта або пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Невірна пошта або пароль' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Успішний вхід',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// ============ ЕНДПОІНТИ ІГОР ============

// Отримати всі ігри
app.get('/api/games', async (req, res) => {
    try {
        const games = await readGames();
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Додати нову гру
app.post('/api/games', authenticateToken, async (req, res) => {
    try {
        const games = await readGames();

        const newGame = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };

        games.push(newGame);
        await writeGames(games);

        res.status(201).json(newGame);
    } catch (error) {
        console.error('Error adding game:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Отримати рандомну гру з фільтрами
app.get('/api/random', async (req, res) => {
    try {
        const { genre, platform, mode } = req.query;
        const games = await readGames();

        let filteredGames = [...games];

        if (genre && genre !== 'all') {
            filteredGames = filteredGames.filter(game =>
                game.genre.toLowerCase().includes(genre.toLowerCase())
            );
        }

        if (platform && platform !== 'all') {
            filteredGames = filteredGames.filter(game =>
                game.platforms.some(p =>
                    p.toLowerCase().includes(platform.toLowerCase())
                )
            );
        }

        if (mode && mode !== 'all') {
            filteredGames = filteredGames.filter(game =>
                game.modes.some(m =>
                    m.toLowerCase().includes(mode.toLowerCase())
                )
            );
        }

        if (filteredGames.length === 0) {
            return res.status(404).json({ error: 'Ігор не знайдено' });
        }

        const randomIndex = Math.floor(Math.random() * filteredGames.length);
        res.json(filteredGames[randomIndex]);
    } catch (error) {
        console.error('Error getting random game:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// ============ ЕНДПОІНТИ УПОДОБАНЬ ============

// Уподобати гру
app.post('/api/games/:gameId/like', authenticateToken, async (req, res) => {
    try {
        const { gameId } = req.params;
        // Беремо userId з токена або з query (для гнучкості)
        const userId = req.query.userId || req.user.id;

        const users = await readUsers();
        const games = await readGames();

        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }

        const game = games.find(g => g.id === gameId);
        if (!game) {
            return res.status(404).json({ error: 'Гру не знайдено' });
        }

        // Перевірка чи вже уподобана
        if (user.favorites.includes(gameId)) {
            return res.status(400).json({ error: 'Гра вже в уподобаних' });
        }

        // Додати до уподобань
        user.favorites.push(gameId);
        await writeUsers(users);

        res.json({
            message: 'Гру додано до уподобаних',
            favorites: user.favorites
        });
    } catch (error) {
        console.error('Error liking game:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Видалити з уподобань
app.delete('/api/games/:gameId/like', authenticateToken, async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.query.userId || req.user.id;

        const users = await readUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }

        user.favorites = user.favorites.filter(id => id !== gameId);
        await writeUsers(users);

        res.json({
            message: 'Гру видалено з уподобаних',
            favorites: user.favorites
        });
    } catch (error) {
        console.error('Помилка видалення з уподобання:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Отримати всі уподобані ігри користувача
app.get('/api/users/:userId/favorites', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const users = await readUsers();
        const games = await readGames();

        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }

        // Отримати повну інформацію про уподобані ігри
        const favoriteGames = games.filter(game =>
            user.favorites.includes(game.id)
        );

        res.json({
            userId: user.id,
            username: user.username,
            favorites: favoriteGames
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});



app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});