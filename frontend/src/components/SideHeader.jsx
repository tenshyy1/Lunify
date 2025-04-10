import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import '../styles/sideheader.css';
import Overviews from '../assets/sideheader/overview-svg.svg';
import Trade from '../assets/sideheader/trade.svg';
import Wallet from '../assets/sideheader/crypto-wallet.svg';
import Swap from '../assets/sideheader/swap.svg';
import Profile from '../assets/sideheader/profile.svg';
import Logout from '../assets/sideheader/logout.svg';

export default function SideHeader({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwapClick = () => {
    navigate('/swap'); 
  };

  const handleFaqClick = () => {
    navigate('/faq');
  };

  return (
    <aside className="profile-sidebar">
      <div className="profile-logo">Lunify</div>
      <nav className="profile-navigation">
        <ul>
          <li className={location.pathname === '/' ? 'profile-active' : ''}>
            <a href="/">
              <img src={Overviews} alt="Overview" width="25" height="25" className="svg-icon-sideheader" />
              Overview
            </a>
          </li>
          <li className={location.pathname === '/trade' ? 'profile-active' : ''}>
            <a href="/trade">
              <img src={Trade} alt="Trade" width="25" height="25" className="svg-icon-sideheader" />
              Trade
            </a>
          </li>
          <li className={location.pathname === '/wallet' ? 'profile-active' : ''}>
            <a href="/wallet">
              <img src={Wallet} alt="Wallet" width="25" height="25" className="svg-icon-sideheader" />
              Wallet
            </a>
          </li>
          <li className={location.pathname === '/swap' ? 'profile-active' : ''}>
            <a href="#" onClick={handleSwapClick}>
              <img src={Swap} alt="Swap" width="25" height="25" className="svg-icon-sideheader" />
              Swap
            </a>
          </li>
          <li className={location.pathname === '/profile' ? 'profile-active' : ''}>
            <a href="/profile">
              <img src={Profile} alt="Profile" width="25" height="25" className="svg-icon-sideheader" />
              Profile
            </a>
          </li>
        </ul>
      </nav>
      <div className="profile-bottom-nav">
        <ul>
          <li className={location.pathname === '/faq' ? 'profile-active' : ''}>
            <a href="#" onClick={handleFaqClick}>
              <img src={Overviews} alt="FAQ" width="25" height="25" className="svg-icon-sideheader" />
              FAQ
            </a>
          </li>
          <li>
            <button onClick={onLogout} className="profile-logout-button">
              <img src={Logout} alt="Logout" width="25" height="25" className="svg-icon-sideheader" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}