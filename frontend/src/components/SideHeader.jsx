import React from 'react';
import '../styles/sideheader.css';

export default function SideHeader({ onLogout }) {
  return (
    <aside className="profile-sidebar">
      <div className="profile-logo">Lunify</div>
      <nav className="profile-navigation">
        <ul>
          <li><a href="#">Overview</a></li>
          <li><a href="#">Trade</a></li>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">Swap</a></li>
          <li className="profile-active"><a href="#">Profile</a></li>
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