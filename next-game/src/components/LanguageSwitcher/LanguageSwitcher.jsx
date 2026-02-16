    import React, { useState } from 'react';
    import { useLanguage } from '../../contexts/LanguageContext';
    import styles from './LanguageSwitcher.module.css';

    const LanguageSwitcher = () => {
      const { language, changeLanguage } = useLanguage();
      const [isOpen, setIsOpen] = useState(false);

      const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ua', name: 'Українська', flag: '🇺🇦' }
      ];

      const currentLanguage = languages.find(lang => lang.code === language);

      const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
      };

      return (
        <div className={styles.languageSwitcher}>
          <button
            className={styles.currentLanguage}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Change language"
          >
            <span className={styles.flag}>{currentLanguage?.flag}</span>
            <span className={styles.code}>{currentLanguage?.code.toUpperCase()}</span>
            <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
          </button>

          {isOpen && (
            <div className={styles.languageMenu}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`${styles.languageOption} ${language === lang.code ? styles.active : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className={styles.optionFlag}>{lang.flag}</span>
                  <span className={styles.optionName}>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    };

    export default LanguageSwitcher;