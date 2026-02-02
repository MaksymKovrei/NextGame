import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Randomizer from './pages/Randomizer/Randomizer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/randomizer" element={<Randomizer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;