import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Home.module.css';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{t('app.tagline')}</h1>
        <p className={styles.subtitle}>{t('app.description')}</p>
        <div className={styles.ctaButtons}>
          <Link to="/randomizer" className={styles.primaryButton}>
            {t('home.randomize')}
          </Link>
          {/* <Link to="/catalog" className={styles.secondaryButton}>
            {t('home.browse')}
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Home;