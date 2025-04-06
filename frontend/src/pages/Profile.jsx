import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/profile.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import foto from '../assets/favicon.png';
import penIcon from '../assets/pen.svg';
import { getProfile, updateProfile, updateAvatar } from '../services/profile';

const API_URL = "http://localhost:8099";

const Profile = ({ onLogout }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(foto);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAvatarPreview, setNewAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Profile';
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = foto;
    link.type = 'image/png';
    document.head.appendChild(link);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      navigate('/login');
      return;
    }

    getProfile(token)
      .then(data => {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setLogin(data.login || '');
        const avatarUrl = data.avatar_url ? `${API_URL}${data.avatar_url}` : foto;
        setAvatar(avatarUrl);
        setInitialData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
        });
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [navigate]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => {
    setFirstName(initialData.first_name);
    setLastName(initialData.last_name);
    setEmail(initialData.email);
    setIsEditing(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const profileData = { first_name: firstName, last_name: lastName, email };
    updateProfile(token, profileData)
      .then(data => {
        toast.success('Profile updated successfully');
        setInitialData(profileData);
        setIsEditing(false);
      })
      .catch(() => toast.error('Failed to update profile'));
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setNewAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error('No file selected');
    }
  };
  const handleAvatarUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedFile) {
      toast.error(!token ? 'No token found' : 'Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);
    try {
      const data = await updateAvatar(token, formData);
      const newAvatarUrl = `${API_URL}${data.avatar_url}`;
      setAvatar(newAvatarUrl);
      setIsModalOpen(false);
      setNewAvatarPreview(null);
      setSelectedFile(null);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error(`Failed to update avatar: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-profile-container">
      {/* Sidebar */}
      <SideHeader onLogout={onLogout} activePage="profile" />

      {/* Main Content */}
      <main className="profile-main-content">
        {/* Header */}
        <Header login={login} />

        <div className="profile-content-wrapper">
          {/* Profile Details */}
          <section className="profile-profile-details">
            <div className="profile-header">
              <div className="profile-profile-picture">
                <img src={avatar} alt="Profile" />
                {isEditing && (
                  <button className="profile-edit-avatar-btn" onClick={() => setIsModalOpen(true)}>
                    <img src={penIcon} alt="Edit" className="pen-icon" />
                  </button>
                )}
              </div>
              <h2>{firstName && lastName ? `${firstName} ${lastName}` : 'Your Name'}</h2>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>
              <div className="profile-form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>
              <div className="profile-form-group">
                <label style={{ marginLeft: "-66%" }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={isEditing ? 'editable' : 'disabled'}
                />
              </div>

              {/* Edit Buttons */}
              {isEditing && (
                <div className="profile-edit-buttons">
                  <button type="button" onClick={handleCancel} className="profile-cancel-btn">Cancel</button>
                  <button type="submit" className="profile-confirm-btn">Save Change</button>
                </div>
              )}
            </form>

            {/* Edit Profile Button */}
            {!isEditing && (
              <div className="profile-edit-btn-wrapper">
                <button type="button" onClick={handleEditClick} className="profile-edit-btn">
                  <img src={penIcon} alt="Edit" className="pen-icon" />
                </button>
              </div>
            )}
          </section>

          {/* Avatar Modal */}
          {isModalOpen && (
            <div className="profile-modal-overlay">
              <div className="profile-modal">
                {!newAvatarPreview ? (
                  <div className="profile-modal-content">
                    <h3>Change Avatar</h3>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                    <button
                      className="profile-modal-close"
                      onClick={() => { setIsModalOpen(false); setNewAvatarPreview(null); setSelectedFile(null); }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <h3>Preview</h3>
                    <div className="profile-avatar-preview">
                      <div className="profile-preview-item">
                        <img src={newAvatarPreview} alt="32x32" style={{ width: '32px', height: '32px' }} />
                        <span>32 x 32</span>
                      </div>
                      <div className="profile-preview-item">
                        <img src={newAvatarPreview} alt="128x128" style={{ width: '128px', height: '128px' }} />
                        <span>128 x 128</span>
                      </div>
                    </div>
                    <div className="profile-modal-buttons">
                      <button onClick={handleAvatarUpdate}>Update</button>
                      <button onClick={() => { setNewAvatarPreview(null); setSelectedFile(null); }}>Cancel</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Balance and Transactions */}
          <section className="profile-balance-transactions">
            {/* Balance Card */}
            <div className="profile-balance-card">
              <h3>Total Balance</h3>
              <div className="profile-tabs">
                <button>Day</button>
                <button className="profile-active">Week</button>
              </div>
              <div className="profile-balance-amount">
                <span className="profile-positive">+$28,320</span>
                <span className="profile-percentage">+0.82%</span>
              </div>
              <div className="profile-graph">Graph Placeholder</div>
            </div>

            {/* Transactions Table */}
            <div className="profile-transactions">
              <h3>Last 10 Transactions</h3>
              <table>
                <thead>
                  <tr><th>NO</th><th>COIN NAME</th><th>TOTAL QTY</th><th>AMOUNT</th><th>SIDE</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Bitcoin</td><td>0.221231</td><td>$45230.00</td><td><span className="profile-sell">SELL</span></td></tr>
                  <tr><td>2</td><td>Ethereum</td><td>0.221231</td><td>$45230.00</td><td><span className="profile-buy">BUY</span></td></tr>
                  <tr><td>3</td><td>Binance</td><td>0.221231</td><td>$45230.00</td><td><span className="profile-sell">SELL</span></td></tr>
                  <tr><td>4</td><td>Tether</td><td>0.221231</td><td>$45230.00</td><td><span className="profile-sell">SELL</span></td></tr>
                  <tr><td>5</td><td>Solana</td><td>0.221231</td><td>$45230.00</td><td><span className="profile-sell">SELL</span></td></tr>
                  <tr><td>6</td><td>XRP</td><td>0.221231</td><td>$45230.00</td><td><span className="profile-sell">SELL</span></td></tr>
                  <tr><td>7</td><td>USD</td><td>0.221231</td><td>$45230.00</td><td><span className="profile-sell">SELL</span></td></tr>
                </tbody>
              </table>
              <a href="#" className="profile-see-all">See All Transactions</a>
            </div>
          </section>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Profile;