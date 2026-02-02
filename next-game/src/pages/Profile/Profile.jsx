import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Завантаження улюблених ігор з localStorage
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('nextgame_favorites');
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          console.log('Loaded favorites:', parsedFavorites); // Для дебагу
          setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
    
    // Слухач для оновлення при зміні у localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'nextgame_favorites') {
        loadFavorites();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const removeFromFavorites = (gameId) => {
    const newFavorites = favorites.filter(game => game.id !== gameId);
    setFavorites(newFavorites);
    localStorage.setItem('nextgame_favorites', JSON.stringify(newFavorites));
  };

  const clearAllFavorites = () => {
    if (window.confirm(t('favorites.clearConfirm'))) {
      setFavorites([]);
      localStorage.removeItem('nextgame_favorites');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>{t('profile.title')}</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          {t('nav.logout')}
        </button>
      </div>
      
      <div className={styles.profileCard}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className={styles.userDetails}>
            <h2>{user.username || 'User'}</h2>
            <p className={styles.email}>{user.email || 'No email'}</p>
            <p className={styles.role}>{t('profile.role')}: {user.role || 'user'}</p>
          </div>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{favorites.length}</span>
            <span className={styles.statLabel}>{t('profile.stats.favorites')}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>{t('profile.stats.played')}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>{t('profile.stats.reviews')}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.favoritesSection}>
        <div className={styles.favoritesHeader}>
          <h3>{t('profile.favorites')} ({favorites.length})</h3>
          {favorites.length > 0 && (
            <button 
              onClick={clearAllFavorites}
              className={styles.clearButton}
            >
              {t('favorites.clearAll')}
            </button>
          )}
        </div>
        
        {loading ? (
          <div className={styles.loading}>
            <p>Loading favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className={styles.favoritesList}>
            {favorites.map(game => (
              <div key={game.id} className={styles.favoriteCard}>
                <img 
                  src={game.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop'} 
                  alt={game.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop';
                  }}
                />
                <div className={styles.favoriteInfo}>
                  <h4>{game.name || 'Unknown Game'}</h4>
                  <p className={styles.gameGenre}>{game.genre || 'Unknown Genre'}</p>
                  <p className={styles.gamePlatforms}>
                    {(game.platforms && game.platforms.length > 0) 
                      ? game.platforms.join(', ') 
                      : 'No platforms'}
                    {game.modes && game.modes.length > 0 && ` | ${game.modes.join(', ')}`}
                  </p>
                  <div className={styles.gameActions}>
                    {game.epicUrl && (
                      <a 
                        href={game.epicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.gameLink}
                      >
                        {t('randomizer.actions.getEpic')}
                      </a>
                    )}
                    <button 
                      onClick={() => removeFromFavorites(game.id)}
                      className={styles.removeButton}
                    >
                      🗑️ {t('favorites.remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyFavorites}>
            <p>{t('profile.emptyFavorites')}</p>
            <button 
              onClick={() => navigate('/randomizer')}
              className={styles.exploreButton}
            >
              {t('profile.explore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;