import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/profile.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import foto from '../assets/favicon.png';
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
      console.error('No token found');
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
        console.log('Avatar URL set to:', avatarUrl);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setLoading(false);
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const profileData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    updateProfile(token, profileData)
      .then(data => {
        console.log('Profile updated:', data);
        toast.success('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
      });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setNewAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('No file selected');
    }
  };

  const handleAvatarUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a file');
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
      console.log('New avatar URL set to:', newAvatarUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(`Failed to update avatar: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-profile-container">
      <SideHeader onLogout={onLogout} activePage="profile" />
      <main className="profile-main-content">
        <Header login={login} />
        <div className="profile-content-wrapper">
          <section className="profile-profile-details">
            <div className="profile-header">
              <div className="profile-profile-picture">
                <img src={avatar} alt="Profile" onError={() => console.log('Failed to load avatar:', avatar)} />
                <button
                  className="profile-edit-avatar-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  Edit Avatar
                </button>
              </div>
              <h2>{firstName && lastName ? `${firstName} ${lastName}` : 'Your Name'}</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Last Name
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label>
                First Name
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button type="submit">Save</button>
            </form>
          </section>

          {isModalOpen && (
            <div className="profile-modal-overlay">
              <div className="profile-modal">
                {!newAvatarPreview ? (
                  <>
                    <h3>Change Avatar</h3>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                  </>
                ) : (
                  <>
                    <h3>Preview</h3>
                    <div className="profile-avatar-preview">
                      <img src={newAvatarPreview} alt="32x32" style={{ width: '32px', height: '32px' }} />
                      <img src={newAvatarPreview} alt="128x128" style={{ width: '128px', height: '128px' }} />
                    </div>
                    <button onClick={handleAvatarUpdate}>Update</button>
                    <button onClick={() => { setNewAvatarPreview(null); setSelectedFile(null); }}>
                      Cancel
                    </button>
                  </>
                )}
                <button className="profile-modal-close" onClick={() => { setIsModalOpen(false); setNewAvatarPreview(null); setSelectedFile(null); }}>
                  Close
                </button>
              </div>
            </div>
          )}

          <section className="profile-balance-transactions">
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
            <div className="profile-transactions">
              <h3>Last 10 Transactions</h3>
              <table>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>COIN NAME</th>
                    <th>TOTAL QTY</th>
                    <th>AMOUNT</th>
                    <th>SIDE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Bitcoin</td>
                    <td>0.221231</td>
                    <td>$45230.00</td>
                    <td><span className="profile-sell">SELL</span></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Ethereum</td>
                    <td>0.221231</td>
                    <td>$45230.00</td>
                    <td><span className="profile-buy">BUY</span></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Binance</td>
                    <td>0.221231</td>
                    <td>$45230.00</td>
                    <td><span className="profile-sell">SELL</span></td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Tether</td>
                    <td>0.221231</td>
                    <td>$45230.00</td>
                    <td><span className="profile-sell">SELL</span></td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Solana</td>
                    <td>0.221231</td>
                    <td>$45230.00</td>
                    <td><span className="profile-sell">SELL</span></td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>XRP</td>
                    <td>0.221231</td>
                    <td>$45230.00</td>
                    <td><span className="profile-sell">SELL</span></td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>USD</td>
                    <td>0.221231</td>
                    <td>$45230.00</td>
                    <td><span className="profile-sell">SELL</span></td>
                  </tr>
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