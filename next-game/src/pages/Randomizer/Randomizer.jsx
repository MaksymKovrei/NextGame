import React, { useState } from 'react';
import { useRandomizer } from '../../hooks/useRandomizer';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import styles from './Randomizer.module.css';

const Randomizer = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        randomGame,
        isLoading,
        error,
        getRandomGame,
        addToFavorites,
        isFavorite
    } = useRandomizer(user);

    const { t } = useLanguage();

    const [filters, setFilters] = useState({
        genre: 'all',
        platform: 'all',
        mode: 'all'
    });
    const [actionLoading, setActionLoading] = useState(false);

    const handleRandomize = async () => {
        try {
            await getRandomGame(filters);
        } catch (err) {
            console.error('Помилка рандомайзера:', err);
        }
    };

    const handleAddToFavorites = async () => {
        if (!user) {
            if (window.confirm('Потрібно увійти в систему. Перейти на сторінку входу?')) {
                navigate('/login');
            }
            return;
        }

        if (!randomGame) return;

        try {
            setActionLoading(true);
            const added = await addToFavorites(randomGame);

            if (added) {
                alert(t('favorites.added') || 'Гру додано до уподобаних!');
            } else {
                alert(t('favorites.alreadyAdded') || 'Ця гра вже в уподобаних!');
            }
        } catch (err) {
            console.error('Error adding to favorites:', err);

            if (err.message === 'Гра вже в уподобаних') {
                alert(t('favorites.alreadyAdded') || 'Ця гра вже в уподобаних!');
            } else if (err.message === 'Потрібно увійти в систему') {
                if (window.confirm('Потрібно увійти в систему. Перейти на сторінку входу?')) {
                    navigate('/login');
                }
            } else {
                alert(err.message || 'Помилка додавання до уподобаних');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const genres = ['all', 'RPG', 'Battle Royale', 'Sports', 'FPS', 'Action', 'Sandbox', 'Roguelike', 'Party', 'Simulation'];
    const platforms = ['all', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
    const modes = ['all', 'Singleplayer', 'Multiplayer', 'Co-op'];

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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                    ⚠️ {error === 'Ігор не знайдено' ? t('randomizer.noGames') : error}
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
                  {randomGame.platforms?.join(', ') || 'N/A'}
                </span>
                                <span className={styles.mode}>
                  {randomGame.modes?.join(', ') || 'N/A'}
                </span>
                            </div>
                            <p className={styles.description}>{randomGame.description}</p>

                            <div className={styles.actions}>
                                {randomGame.steamUrl && (
                                    <a
                                        href={randomGame.steamUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.steamButton}
                                    >
                                        {t('randomizer.actions.getSteam')}
                                    </a>
                                )}

                                {randomGame.epicUrl && (
                                    <a
                                        href={randomGame.epicUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.epicButton}
                                    >
                                        {t('randomizer.actions.getEpic')}
                                    </a>
                                )}

                                {user ? (
                                    <button
                                        onClick={handleAddToFavorites}
                                        className={styles.saveButton}
                                        disabled={isFavorite(randomGame.id) || actionLoading}
                                    >
                                        {actionLoading
                                            ? '...'
                                            : isFavorite(randomGame.id)
                                                ? '❤️ ' + (t('favorites.inFavorites') || 'В уподобаних')
                                                : (t('randomizer.actions.saveFavorite') || 'Зберегти')
                                        }
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className={styles.loginButton}
                                    >
                                        Увійти щоб зберегти
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleRandomize}
                        className={styles.anotherButton}
                        disabled={isLoading}
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