import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import '../styles/sideheader.css';

export default function SideHeader({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий путь

  const handleSwapClick = () => {
    navigate('/swap'); 
  };

  return (
    <aside className="profile-sidebar">
      <div className="profile-logo">Lunify</div>
      <nav className="profile-navigation">
        <ul>
          <li>
            <a href="/">Overview</a>
          </li>
          <li className={location.pathname === '/trade' ? 'profile-active' : ''}>
            <a href="/trade">Trade</a>
          </li>
          <li className={location.pathname === '/portfolio' ? 'profile-active' : ''}>
            <a href="/portfolio">Portfolio</a>
          </li>
          <li className={location.pathname === '/swap' ? 'profile-active' : ''}>
            <a href="#" onClick={handleSwapClick}>Swap</a>
          </li>
          <li className={location.pathname === '/profile' ? 'profile-active' : ''}>
            <a href="/profile">Profile</a>
          </li>
        </ul>
      </nav>
      <div className="profile-bottom-nav">
        <ul>
          <li><a href="#">FAQ</a></li>
          <li>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </li>
        </ul>
      </div>
    </aside>
  );
}