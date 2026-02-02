import React from 'react';
import Header from '../Header/Header';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>This site is protected by reCAPTCHA Enterprise and the</p>
        <p>Google Privacy Policy and Terms of Service apply.</p>
      </footer>
    </div>
  );
};

export default Layout;