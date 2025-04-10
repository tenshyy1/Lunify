import React from 'react';
import '../styles/swap.css';
import SideHeader from '../components/SideHeader';
import Header from '../components/Header';

const Swap = ({ onLogout, login, avatar }) => { // Принимаем onLogout как пропс
  return (
    <div className="swap-placeholder">
      <SideHeader activePage="swap" onLogout={onLogout} />
      <Header login={login} avatar={avatar} />
      
      <div className="swap-placeholder-content">
        <div className="swap-placeholder-item"></div>
        <div className="swap-placeholder-item"></div>
        <div className="swap-placeholder-item"></div>
      </div>
    </div>
  );
};

export default Swap;