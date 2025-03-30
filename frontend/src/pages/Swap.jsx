import React from 'react';
import '../styles/swap.css';
import SideHeader from '../components/SideHeader';

const Swap = ({ onLogout }) => { // Принимаем onLogout как пропс
  return (
    <div className="swap-placeholder">
      <SideHeader activePage="swap" onLogout={onLogout} />
      <div className="swap-placeholder-content">
        <div className="swap-placeholder-item"></div>
        <div className="swap-placeholder-item"></div>
        <div className="swap-placeholder-item"></div>
      </div>
    </div>
  );
};

export default Swap;