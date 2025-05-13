import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import SideHeader from '../components/SideHeader';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUsers, banUser, unbanUser, deleteUser } from '../services/admin';
import favicon from '../assets/favicon.png';

const Admin = ({ onLogout, login, avatar }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Page';
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = favicon;
    document.head.appendChild(link);
    return () => {
      document.title = '';
      if (link) document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleBan = async (userId) => {
    try {
      await banUser(userId);
      setUsers(users.map(user => user.id === userId ? { ...user, is_banned: true } : user));
      toast.success('User banned successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUnban = async (userId) => {
    try {
      await unbanUser(userId);
      setUsers(users.map(user => user.id === userId ? { ...user, is_banned: false } : user));
      toast.success('User unbanned successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="admin-container">
      <SideHeader activePage="admin" onLogout={onLogout}/>
      <main className="admin-main-content">
        <Header login={login} avatar={avatar} />
        <div className="admin-content-wrapper">
          <section className="admin-section">
            <div className="admin-content-container">
              <h2>Users Management</h2>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ textAlign: 'center', padding: '20px' }}
                  >
                    <div className="loading-dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                    <p style={{ color: '#a0aec0' }}>Fetching users...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <table className="admin-users-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Login</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Banned</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <td>{user.id}</td>
                            <td>{user.login}</td>
                            <td>{user.email || 'N/A'}</td>
                            <td>{user.role}</td>
                            <td>{user.is_banned ? 'Yes' : 'No'}</td>
                            <td>
                              <button
                                className="admin-action-btn ban-btn"
                                onClick={() => handleBan(user.id)}
                                disabled={user.is_banned}
                              >
                                Ban
                              </button>
                              <button
                                className="admin-action-btn unban-btn"
                                onClick={() => handleUnban(user.id)}
                                disabled={!user.is_banned}
                              >
                                Unban
                              </button>
                              <button
                                className="admin-action-btn delete-btn"
                                onClick={() => handleDelete(user.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Admin;