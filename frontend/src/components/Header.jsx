import React, { useState } from 'react';
import '../styles/header.css';
import BellIcon from '../assets/header/notif.svg';
import { useLocation } from 'react-router-dom';

export default function Header({ login, avatar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const notifications = [
    { text: "New message received", read: false },
    { text: "Payment confirmed", read: true },
    { text: "Update available", read: false }
  ];

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/profile':
        return 'Profile';
      case '/swap':
        return 'Swaper';
      case '/wallet':
        return 'Wallet';
      case '/trade':
        return 'Market';
      default:
        return 'Profile';
    }
  };

  const handleBellClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="profile-top-bar">
      <h1>{getPageTitle(location.pathname)}</h1>
      <div className="profile-user-info">
        <button className="profile-bell-button" onClick={handleBellClick}>
          <img src={BellIcon} alt="Notifications" className="profile-bell-icon" />
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
          )}
        </button>
        {isModalOpen && (
          <div className="notifications-modal">
            {notifications.length === 0 ? (
              <p className="no-notifications">No new notifications</p>
            ) : (
              <ul className="notifications-list">
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className={notification.read ? 'read' : ''}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {notification.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <img src={avatar} alt="User Avatar" className="profile-avatar" />
        <span>{login || 'User'}</span>
      </div>
    </header>
  );
}