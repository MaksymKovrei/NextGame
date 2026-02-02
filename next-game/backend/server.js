const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Прості дані ігор
const games = [
  {
    id: '1',
    name: 'Fortnite',
    genre: 'Battle Royale',
    description: 'Free-to-play battle royale game',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    modes: ['Multiplayer', 'Co-op'],
    epicUrl: 'https://store.epicgames.com/en-US/p/fortnite',
    image: 'https://cdn2.unrealengine.com/egs-social-fortnite-ch5s2-bp-1920x1080-1920x1080-83a7a3a8c3e5.jpg'
  },
  {
    id: '2',
    name: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    description: 'Action role-playing game set in a fantasy world',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    modes: ['Singleplayer'],
    epicUrl: 'https://store.epicgames.com/en-US/p/the-witcher-3-wild-hunt',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg'
  }
];

// API для ігор
app.get('/api/games', (req, res) => {
  res.json(games);
});

app.post('/api/games', (req, res) => {
  const newGame = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  games.push(newGame);
  res.status(201).json(newGame);
});

app.get('/api/random', (req, res) => {
  const { genre, platform, mode } = req.query;
  
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
    return res.status(404).json({ error: 'No games found' });
  }
  
  const randomIndex = Math.floor(Math.random() * filteredGames.length);
  res.json(filteredGames[randomIndex]);
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});