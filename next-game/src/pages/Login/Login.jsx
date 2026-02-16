import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Очистити помилку при зміні полів
        if (error) setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData.email, formData.password);

            // Зберегти налаштування "Запам'ятати мене"
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            // Успішний логін - перенаправити на головну
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);

            // Помилки вже українською з бекенду
            // "Невірна пошта або пароль", "Пошта та пароль обов'язкові", тощо
            setError(err.message || t('login.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginWrapper}>
                <div className={styles.leftPanel}>
                    <div className={styles.logo}>
                        <Link to="/">NEXTGAME</Link>
                    </div>
                    <h1 className={styles.leftTitle}>{t('app.tagline')}</h1>
                    <p className={styles.leftSubtitle}>{t('app.description')}</p>
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>🎮</span>
                            <span>{t('randomizer.actions.saveFavorite')}</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>⚡</span>
                            <span>{t('login.quick')}</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>🔗</span>
                            <span>{t('login.directLinks')}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.loginCard}>
                        <h2 className={styles.title}>{t('login.title')}</h2>
                        <p className={styles.subtitle}>{t('login.subtitle')}</p>

                        {error && <div className={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">{t('login.email')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="your.email@gmail.com"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password">{t('login.password')}</label>
                                <div className={styles.passwordInput}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? t('login.hide') : t('login.show')}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.optionsRow}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className={styles.checkbox}
                                        disabled={isLoading}
                                    />
                                    <span>{t('login.remember')}</span>
                                </label>
                                <Link to="/forgot-password" className={styles.forgotLink}>
                                    {t('login.forgot')}
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? t('login.loading') : t('login.submit')}
                            </button>

                            <div className={styles.divider}>
                                <span>{t('login.or')}</span>
                            </div>

                            <Link to="/register" className={styles.registerLink}>
                                {t('login.register')}
                            </Link>
                        </form>

                        <div className={styles.footer}>
                            <p>{t('footer.protected')}</p>
                            <p>{t('footer.policy')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;