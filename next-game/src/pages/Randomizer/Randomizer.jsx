import React, { useState } from 'react';
import { useRandomizer } from '../../hooks/useRandomizer';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Randomizer.module.css';

const Randomizer = () => {
  const { user } = useAuth();
  const { 
    randomGame, 
    isLoading, 
    error, 
    getRandomGame, 
    addToFavorites, 
    isFavorite 
  } = useRandomizer();
  
  const { t } = useLanguage();
  
  const [filters, setFilters] = useState({
    genre: 'all',
    platform: 'all',
    mode: 'all'
  });

  const handleRandomize = async () => {
    try {
      await getRandomGame(filters);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToFavorites = () => {
    if (randomGame) {
      const added = addToFavorites(randomGame);
      if (added) {
        alert(t('favorites.added'));
      } else {
        alert(t('favorites.alreadyAdded'));
      }
    }
  };

  const genres = ['all', 'Action', 'RPG', 'Adventure', 'Strategy', 'Sports', 'Simulation', 'Battle Royale', 'Party'];
  const platforms = ['all', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
  const modes = ['all', 'Singleplayer', 'Multiplayer', 'Co-op', 'Online', 'Offline'];

  return (
    <div className={styles.randomizer}>
      <div className={styles.header}>
        <h1>{t('randomizer.title')}</h1>
        <p>{t('randomizer.subtitle')}</p>
      </div>

      <div className={styles.filterSection}>
        <h2>{t('randomizer.preferences')}</h2>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>{t('randomizer.genre')}</label>
            <select 
              value={filters.genre}
              onChange={(e) => setFilters({...filters, genre: e.target.value})}
              className={styles.select}
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className={styles.option}>
                  {genre === 'all' ? t('randomizer.allGenres') : genre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>{t('randomizer.platform')}</label>
            <select 
              value={filters.platform}
              onChange={(e) => setFilters({...filters, platform: e.target.value})}
              className={styles.select}
            >
              {platforms.map(platform => (
                <option key={platform} value={platform} className={styles.option}>
                  {platform === 'all' ? t('randomizer.allPlatforms') : platform}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>{t('randomizer.mode')}</label>
            <select 
              value={filters.mode}
              onChange={(e) => setFilters({...filters, mode: e.target.value})}
              className={styles.select}
            >
              {modes.map(mode => (
                <option key={mode} value={mode} className={styles.option}>
                  {mode === 'all' ? t('randomizer.allModes') : mode}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleRandomize}
          disabled={isLoading}
          className={styles.randomizeButton}
        >
          {isLoading ? t('randomizer.rolling') : t('randomizer.randomize')}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          ⚠️ {t('randomizer.noGames')}
        </div>
      )}

      {randomGame && (
        <div className={styles.result}>
          <h2>{t('randomizer.result')}</h2>
          <div className={styles.gameCard}>
            <div className={styles.gameImage}>
              <img 
                src={randomGame.image} 
                alt={randomGame.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop';
                }}
              />
            </div>
            <div className={styles.gameInfo}>
              <h3>{randomGame.name}</h3>
              <div className={styles.gameMeta}>
                <span className={styles.genre}>{randomGame.genre}</span>
                <span className={styles.platform}>
                  {randomGame.platforms.join(', ')}
                </span>
                <span className={styles.mode}>
                  {randomGame.modes.join(', ')}
                </span>
              </div>
              <p className={styles.description}>{randomGame.description}</p>
              
              <div className={styles.actions}>
                <a 
                  href={randomGame.epicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.epicButton}
                >
                  {t('randomizer.actions.getEpic')}
                </a>
                
                {user && (
                  <button 
                    onClick={handleAddToFavorites}
                    className={styles.saveButton}
                    disabled={isFavorite(randomGame.id)}
                  >
                    {isFavorite(randomGame.id) ? '❤️ ' + t('favorites.inFavorites') : t('randomizer.actions.saveFavorite')}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleRandomize}
            className={styles.anotherButton}
          >
            {t('randomizer.another')}
          </button>
        </div>
      )}

      {!randomGame && !isLoading && !error && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>🎮</div>
          <h3>{t('randomizer.placeholder.title')}</h3>
          <p>{t('randomizer.placeholder.text')}</p>
        </div>
      )}
    </div>
  );
};

export default Randomizer;