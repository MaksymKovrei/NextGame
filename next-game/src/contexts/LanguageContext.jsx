import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.randomizer': 'Randomizer',
    'nav.profile': 'Profile',
    'nav.login': 'Log In',
    'nav.register': 'Create Account',
    'nav.logout': 'Logout',
    'randomizer.title': '🎲 Game Randomizer',
    'randomizer.subtitle': 'Can\'t decide what to play? Let us choose for you!',
    'randomizer.preferences': 'Set Your Preferences',
    'randomizer.genre': 'Genre',
    'randomizer.platform': 'Platform',
    'randomizer.mode': 'Game Mode',
    'randomizer.allGenres': 'All Genres',
    'randomizer.allPlatforms': 'All Platforms',
    'randomizer.allModes': 'All Modes',
    'randomizer.randomize': '🎲 Randomize Game!',
    'randomizer.rolling': 'Rolling...',
    'randomizer.result': '🎮 Your Random Game:',
    'randomizer.another': '🎲 Try Another Game',
    'randomizer.noGames': 'No games match your filters. Try changing them!',
    'randomizer.placeholder.title': 'Ready to discover your next game?',
    'randomizer.placeholder.text': 'Set your preferences and click \'Randomize Game!\' to get started.',
    'randomizer.actions.getEpic': 'Get on Epic Games Store',
        'randomizer.actions.getSteam': 'Get on Steam',
    'randomizer.actions.saveFavorite': '💾 Save to Favorites',
    'app.tagline': 'What to play today?',
    'app.description': 'Can\'t decide what game to play? Let our randomizer choose for you!',
    'home.randomize': '🎲 Randomize Now',
    'login.title': 'Login',
    'login.subtitle': 'Enter your credentials to access your account',
    'login.email': 'E-mail address',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.submit': 'Log In',
    'login.loading': 'Logging in...',
    'login.or': 'or',
    'login.register': 'Create an account',
    'login.error': 'Invalid email or password',
    'login.quick': 'Quick and easy to use',
    'login.directLinks': 'Direct links to stores',
    'register.title': 'Create an account',
    'register.subtitle': 'Join NEXTGAME and discover your next favorite game',
    'register.joinCommunity': 'Join our gaming community',
    'register.saveGames': 'Save your favorite games',
    'register.personalized': 'Personalized recommendations',
    'register.exclusive': 'Access exclusive features',
    'register.username': 'Login',
    'register.email': 'E-mail address',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.robot': '☐ I am not a robot',
    'register.captcha': 'CAPTCHA',
    'register.submit': 'Create an account',
    'register.loading': 'Creating account...',
    'register.login': 'Log In',
    'register.error.robot': 'Please confirm you are not a robot',
    'register.error.passwordMatch': 'Passwords do not match',
    'register.error.passwordLength': 'Password must be at least 6 characters long',
    'profile.title': 'Profile',
    'profile.welcome': 'Welcome, {username}!',
    'profile.email': 'Email',
    'profile.role': 'Role',
    'profile.stats.favorites': 'Favorite Games',
    'profile.stats.played': 'Games Played',
    'profile.stats.reviews': 'Reviews',
    'profile.favorites': 'Favorite Games',
    'profile.emptyFavorites': 'No favorite games yet. Start adding games from the randomizer!',
    'profile.explore': '🎲 Explore Games',
    'favorites.added': 'Game added to favorites!',
    'favorites.alreadyAdded': 'This game is already in your favorites',
    'favorites.inFavorites': 'In Favorites',
    'favorites.remove': 'Remove',
    'favorites.clearAll': 'Clear All',
    'favorites.clearConfirm': 'Are you sure you want to remove all favorite games?',
    'footer.protected': 'This site is protected by reCAPTCHA Enterprise and the',
    'footer.policy': 'Google Privacy Policy and Terms of Service apply'
  },
  
  ua: {
    'nav.home': 'Головна',
    'nav.randomizer': 'Рандомайзер',
    'nav.profile': 'Профіль',
    'nav.login': 'Увійти',
    'nav.register': 'Створити акаунт',
    'nav.logout': 'Вийти',
    'randomizer.title': '🎲 Рандомайзер ігор',
    'randomizer.subtitle': 'Не можете вирішити, в що пограти? Дозвольте нам вибрати за вас!',
    'randomizer.preferences': 'Встановіть свої уподобання',
    'randomizer.genre': 'Жанр',
    'randomizer.platform': 'Платформа',
    'randomizer.mode': 'Режим гри',
    'randomizer.allGenres': 'Усі жанри',
    'randomizer.allPlatforms': 'Усі платформи',
    'randomizer.allModes': 'Усі режими',
    'randomizer.randomize': '🎲 Рандомна гра!',
    'randomizer.rolling': 'Вибираємо...',
    'randomizer.result': '🎮 Ваша рандомна гра:',
    'randomizer.another': '🎲 Спробувати іншу гру',
    'randomizer.noGames': 'Жодна гра не відповідає вашим фільтрам. Спробуйте змінити їх!',
    'randomizer.placeholder.title': 'Готові відкрити свою наступну гру?',
    'randomizer.placeholder.text': 'Встановіть свої уподобання та натисніть \'Рандомна гра!\' щоб почати.',
    'randomizer.actions.getEpic': 'Отримати в Epic Games Store',
      'randomizer.actions.getSteam': 'Отримати в Steam',
    'randomizer.actions.saveFavorite': '💾 Зберегти в обране',
    'app.tagline': 'Що пограти сьогодні?',
    'app.description': 'Не можете вирішити, в яку гру пограти? Дозвольте нашому рандомайзеру вибрати за вас!',
    'home.randomize': '🎲 Зараз рандом',
    'login.title': 'Вхід',
    'login.subtitle': 'Введіть свої облікові дані для доступу до акаунту',
    'login.email': 'Електронна адреса',
    'login.password': 'Пароль',
    'login.remember': 'Запам\'ятати мене',
    'login.forgot': 'Забули пароль?',
    'login.submit': 'Увійти',
    'login.loading': 'Вхід...',
    'login.or': 'або',
    'login.register': 'Створити акаунт',
    'login.error': 'Невірна електронна адреса або пароль',
    'login.quick': 'Швидко та просто',
    'login.directLinks': 'Прямі посилання на магазини',
    'register.title': 'Створити акаунт',
    'register.subtitle': 'Приєднуйтесь до NEXTGAME та відкривайте свої наступні улюблені ігри',
    'register.joinCommunity': 'Приєднуйтесь до нашої ігрової спільноти',
    'register.saveGames': 'Зберігайте улюблені ігри',
    'register.personalized': 'Персоналізовані рекомендації',
    'register.exclusive': 'Доступ до ексклюзивних функцій',
    'register.username': 'Логін',
    'register.email': 'Електронна адреса',
    'register.password': 'Пароль',
    'register.confirmPassword': 'Підтвердити пароль',
    'register.robot': '☐ Я не робот',
    'register.captcha': 'CAPTCHA',
    'register.submit': 'Створити акаунт',
    'register.loading': 'Створення акаунту...',
    'register.login': 'Увійти',
    'register.error.robot': 'Будь ласка, підтвердіть що ви не робот',
    'register.error.passwordMatch': 'Паролі не співпадають',
    'register.error.passwordLength': 'Пароль має бути не менше 6 символів',
    'profile.title': 'Профіль',
    'profile.welcome': 'Ласкаво просимо, {username}!',
    'profile.email': 'Електронна адреса',
    'profile.role': 'Роль',
    'profile.stats.favorites': 'Улюблені ігри',
    'profile.stats.played': 'Зіграно ігор',
    'profile.stats.reviews': 'Відгуки',
    'profile.favorites': 'Улюблені ігри',
    'profile.emptyFavorites': 'Ще немає улюблених ігор. Почніть додавати ігри з рандомайзера!',
    'profile.explore': '🎲 Дослідити ігри',
    'favorites.added': 'Гру додано до улюблених!',
    'favorites.alreadyAdded': 'Ця гра вже в ваших улюблених',
    'favorites.inFavorites': 'В улюблених',
    'favorites.remove': 'Видалити',
    'favorites.clearAll': 'Очистити все',
    'favorites.clearConfirm': 'Ви впевнені, що хочете видалити всі улюблені ігри?',
    'footer.protected': 'Цей сайт захищений reCAPTCHA Enterprise та',
    'footer.policy': 'Політикою конфіденційності та Умовами використання Google'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('nextgame_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang] && lang !== language) {
      setLanguage(lang);
      localStorage.setItem('nextgame_language', lang);
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || key;
    
    Object.keys(params).forEach(paramKey => {
      translation = translation.replace(`{${paramKey}}`, params[paramKey]);
    });
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};