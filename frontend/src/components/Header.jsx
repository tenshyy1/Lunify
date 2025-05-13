import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import BellIcon from '../assets/header/notif.svg';
import { useLocation } from 'react-router-dom';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Header({ login, avatar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAdmin = token ? JSON.parse(atob(token.split('.')[1])).role === 'admin' : false;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      console.log('Fetched notifications:', data); 
      if (!Array.isArray(data) || data.some(n => !n.title || !n.description)) {
        console.warn('Invalid notification data:', data); 
      }
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch notifications');
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications([]);
    } catch (error) {
      toast.error(error.message || 'Failed to delete all notifications');
    }
  };

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
      case '/admin':
        return 'Admin Dashboard';
      case '/faq':
        return 'POPULAR QUESTIONS';
      default:
        return 'Profile';
    }
  };

  return (
    <header className="profile-top-bar">
      <h1>{getPageTitle(location.pathname)}</h1>
      <div className="profile-user-info">
        <button className="profile-bell-button" onClick={handleBellClick}>
          <img src={BellIcon} alt="Notifications" className="profile-bell-icon" />
          {notifications.length > 0 && (
            <span className="notification-badge">
              {notifications.length}
            </span>
          )}
        </button>
        {isModalOpen && (
          <div className="notifications-modal">
            {loading ? (
              <p className="no-notifications">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="no-notifications">No new notifications</p>
            ) : (
              <>
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button onClick={handleMarkAllAsRead} className="mark-all-btn">
                    Mark All as Read
                  </button>
                </div>
                <ul className="notifications-list">
                  {notifications.map((notification, index) => (
                    <li
                      key={notification.id}
                      className="notification-entry"
                    >
                      <div className="notification-content">
                        <h4>{notification.title || 'No title'}</h4>
                        <p>{notification.description || 'No description'}</p>
                        <span className="notification-date">
                          {notification.created_at
                            ? new Date(notification.created_at).toLocaleString()
                            : 'No date'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="notification-mark-read-btn"
                      >
                        Mark as Read
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
        <img src={avatar} alt="User Avatar" className="profile-avatar" />
        <div className="profile-user-details">
          <span className="profile-user-login">{login || 'User'}</span>
          {isAdmin && <span className="profile-user-role">Admin</span>}
        </div>
      </div>
      <ToastContainer />
    </header>
  );
}