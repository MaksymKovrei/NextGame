import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          NEXTGAME
        </Link>
        
        <div className={styles.rightSection}>
          <nav className={styles.nav}>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink 
              to="/randomizer" 
              className={({ isActive }) => 
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {t('nav.randomizer')}
            </NavLink>
            {user && (
              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {t('nav.profile')}
              </NavLink>
            )}
          </nav>

          <div className={styles.rightControls}>
            <div className={styles.authSection}>
              <LanguageSwitcher />
              
              {user ? (
                <div className={styles.userSection}>
                  <span className={styles.greeting}>{t('profile.welcome', { username: user.username })}</span>
                  <div className={styles.userButtons}>
                    <Link to="/profile" className={styles.profileButton}>
                      {t('nav.profile')}
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.authButtons}>
                  <Link to="/login" className={styles.loginButton}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className={styles.registerButton}>
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;