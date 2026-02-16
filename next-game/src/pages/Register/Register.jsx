import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRobot, setIsRobot] = useState(false);

    const { register } = useAuth();
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

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валідація на фронтенді
        if (!isRobot) {
            setError(t('register.error.robot'));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(t('register.error.passwordMatch'));
            return;
        }

        if (formData.password.length < 6) {
            setError(t('register.error.passwordLength'));
            return;
        }

        if (formData.username.length < 3) {
            setError('Ім\'я користувача має бути мінімум 3 символи');
            return;
        }

        setIsLoading(true);

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Успішна реєстрація - перенаправити на головну
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);

            // Помилки вже українською з бекенду
            // "Користувач з такою поштою вже існує", "Це ім'я користувача вже зайняте", тощо
            setError(err.message || 'Помилка реєстрації');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerWrapper}>
                <div className={styles.leftPanel}>
                    <div className={styles.logo}>
                        <Link to="/">NEXTGAME</Link>
                    </div>
                    <h1 className={styles.leftTitle}>{t('register.joinCommunity')}</h1>
                    <p className={styles.leftSubtitle}>{t('register.subtitle')}</p>
                    <div className={styles.benefits}>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>💾</span>
                            <span>{t('register.saveGames')}</span>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>🎯</span>
                            <span>{t('register.personalized')}</span>
                        </div>
                        <div className={styles.benefit}>
                            <span className={styles.benefitIcon}>🚀</span>
                            <span>{t('register.exclusive')}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.registerCard}>
                        <h2 className={styles.title}>{t('register.title')}</h2>
                        <p className={styles.subtitle}>{t('register.subtitle')}</p>

                        {error && <div className={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>{t('register.username')}</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder={t('register.username')}
                                    disabled={isLoading}
                                    minLength={3}
                                    autoComplete="username"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>{t('register.email')}</label>
                                <input
                                    type="email"
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
                                <label>{t('register.password')}</label>
                                <div className={styles.passwordInput}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => togglePasswordVisibility('password')}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>{t('register.confirmPassword')}</label>
                                <div className={styles.passwordInput}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.captchaSection}>
                                <label className={styles.captchaLabel}>
                                    <input
                                        type="checkbox"
                                        checked={isRobot}
                                        onChange={(e) => setIsRobot(e.target.checked)}
                                        className={styles.captchaCheckbox}
                                        disabled={isLoading}
                                    />
                                    <span className={styles.captchaText}>{t('register.robot')}</span>
                                </label>
                                <div className={styles.captchaBrand}>
                                    <span className={styles.captchaIcon}>🔒</span>
                                    <span className={styles.captchaName}>{t('register.captcha')}</span>
                                </div>
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    type="submit"
                                    className={styles.createButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('register.loading') : t('register.submit')}
                                </button>

                                <Link to="/login" className={styles.loginLink}>
                                    {t('register.login')}
                                </Link>
                            </div>
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

export default Register;