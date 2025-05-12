import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import SideHeader from '../components/SideHeader';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "http://localhost:8099";

const Admin = ({ onLogout, login, avatar }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/users`, {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error(error.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleBan = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to ban user');
      }
      setUsers(users.map(user => user.id === userId ? { ...user, is_banned: true } : user));
      toast.success('User banned successfully');
    } catch (error) {
      toast.error(error.message || 'Error banning user');
    }
  };

  const handleUnban = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to unban user');
      }
      setUsers(users.map(user => user.id === userId ? { ...user, is_banned: false } : user));
      toast.success('User unbanned successfully');
    } catch (error) {
      toast.error(error.message || 'Error unbanning user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Error deleting user');
      }
    }
  };

  return (
    <div className="admin-container">
      <SideHeader activePage="admin" onLogout={onLogout} />
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