import React from 'react';
import '../styles/header.css';
import foto from '../assets/favicon.png';

export default function Header({ login }) {
  return (
    <header className="profile-top-bar">
      <h1>Profile</h1> 
      <div className="profile-user-info">
        <span className="profile-bell-icon">🔔</span>
        <img src={foto} alt="User Avatar" className="profile-avatar" />
        <span>{login || 'User'}</span> 
      </div>
    </header>
  );
}