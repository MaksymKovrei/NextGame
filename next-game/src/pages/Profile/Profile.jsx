import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { gamesAPI } from '../../api/games.js';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Profile.module.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Завантаження улюблених ігор з backend
        const loadFavorites = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await gamesAPI.getFavorites(user.id);
                console.log('Loaded favorites from backend:', data.favorites);

                setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
            } catch (err) {
                console.error('Error loading favorites:', err);
                setError(err.message || 'Помилка завантаження уподобаних');
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const removeFromFavorites = async (gameId) => {
        try {
            // Видалити з backend
            await gamesAPI.unlike(gameId);

            // Оновити локальний state
            const newFavorites = favorites.filter(game => game.id !== gameId);
            setFavorites(newFavorites);

            console.log('Game removed from favorites');
        } catch (err) {
            console.error('Error removing from favorites:', err);
            alert(err.message || 'Помилка видалення з уподобаних');
        }
    };

    const clearAllFavorites = async () => {
        if (!window.confirm(t('favorites.clearConfirm'))) {
            return;
        }

        try {
            // Видалити всі ігри по черзі
            const deletePromises = favorites.map(game => gamesAPI.unlike(game.id));
            await Promise.all(deletePromises);

            // Очистити локальний state
            setFavorites([]);

            console.log('All favorites cleared');
        } catch (err) {
            console.error('Error clearing favorites:', err);
            alert(err.message || 'Помилка очищення уподобаних');

            // Перезавантажити список на випадок часткового видалення
            try {
                const data = await gamesAPI.getFavorites(user.id);
                setFavorites(data.favorites || []);
            } catch (reloadErr) {
                console.error('Error reloading favorites:', reloadErr);
            }
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

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

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
                                        {game.steamUrl && (
                                            <a
                                                href={game.steamUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.gameLink}
                                            >
                                                Steam
                                            </a>
                                        )}
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