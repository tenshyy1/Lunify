import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/profile.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import favicon from '../assets/favicon.png';
import penIcon from '../assets/pen.svg';
import { getProfile, updateProfile, updateAvatar, changePassword } from '../services/profile';

const API_URL = "http://localhost:8099";

const Profile = ({ onLogout, login, avatar, updateAvatarUrl }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAvatarPreview, setNewAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [activePeriod, setActivePeriod] = useState('Week');
  const [showChangeInDollars, setShowChangeInDollars] = useState(false);
  const [activeSection, setActiveSection] = useState('Transactions');
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const graphRef = useRef(null);
  const navigate = useNavigate();

  // Заглушки для balance card
  const portfolioValue = '$1,025,000';
  const balanceData = {
    Day: { total: '$1,023,460', change: '-$1,540', percentage: '-0.15%' },
    Week: { total: '$1,025,000', change: '$0', percentage: '0.00%' },
    Year: { total: '$1,177,780', change: '+$152,780', percentage: '+12.45%' },
  };

  // Transactions
  const allTransactions = [
    { id: 1, coin: "Bitcoin", qty: "0.221231", amount: "$45230.00", portfolio: "Portfolio 1", side: "SELL" },
    { id: 2, coin: "Ethereum", qty: "0.221231", amount: "$45230.00", portfolio: "Portfolio 2", side: "BUY" },
    { id: 3, coin: "Binance", qty: "0.221231", amount: "$45230.00", portfolio: "Portfolio 1", side: "SELL" },
    { id: 4, coin: "Tether", qty: "0.221231", amount: "$45230.00", portfolio: "Portfolio 2", side: "SELL" },
    { id: 5, coin: "Solana", qty: "0.221231", amount: "$45230.00", portfolio: "Portfolio 1", side: "SELL" },
    { id: 6, coin: "Cardano", qty: "0.221231", amount: "$45230.00", portfolio: "Portfolio 2", side: "BUY" },
    { id: 7, coin: "XRP", qty: "0.221231", amount: "$45230.00", portfolio: "Portfolio 1", side: "SELL" },
  ];
  const lastFiveTransactions = allTransactions.slice(0, 5);

  const filteredTransactions = allTransactions.filter(transaction =>
    transaction.coin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedTransactions = filteredTransactions.slice(0, itemsPerPage);

  useEffect(() => {
    document.title = 'Profile';
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = favicon;
    link.type = 'image/png';
    document.head.appendChild(link);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      navigate('/login');
      return;
    }

    getProfile()
      .then(data => {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
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
    const profileData = { first_name: firstName, last_name: lastName, email };
    updateProfile(profileData)
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
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
  
    const formData = new FormData();
    formData.append('avatar', selectedFile);
    try {
      const data = await updateAvatar(formData);
      const newAvatarUrl = `${API_URL}${data.avatar_url}`;
      updateAvatarUrl(newAvatarUrl);
      setIsModalOpen(false);
      setNewAvatarPreview(null);
      setSelectedFile(null);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error(`Failed to update avatar: ${error.message}`);
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 3) {
      toast.error('Password must be at least 3 characters');
      return;
    }
    try {
      await changePassword({
        new_password: newPassword,
      });
      toast.success('Password changed successfully');
      setIsChangePassModalOpen(false);
      setNewPassword('');
      setConfirmNewPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(`Failed to change password: ${error.message}`);
    }
  };

  const getAmountClass = (change) => {
    if (change === '$0') return 'profile-neutral';
    return change.startsWith('-') ? 'profile-negative' : 'profile-positive';
  };

  const getChangeClass = (change) => {
    if (change === '$0' || change === '0.00%') return 'profile-neutral';
    return change.startsWith('-') ? 'profile-negative-change' : 'profile-positive-change';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-profile-container">
      {/* Sidebar */}
      <SideHeader onLogout={onLogout} activePage="profile" />

      {/* Main Content */}
      <main className="profile-main-content">
        {/* Header */}
        <Header login={login} avatar={avatar} />
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
              <div className="profile-form-group" id='email_label'>
                <label>Email Address</label>
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

            {/* Edit and Change Password Buttons */}
            {!isEditing && (
              <div className="profile-edit-btn-wrapper">
                <button type="button" onClick={() => setIsChangePassModalOpen(true)} className="changepass-btn">
                  Change Password
                </button>
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
                    <label className="profile-modal-input">
                      <input type="file" accept="image/*" onChange={handleAvatarChange} />
                      <span>Choose File</span>
                    </label>
                    <button
                      style={{ marginTop: '100px' }}
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
                        <img src={newAvatarPreview} alt="50x50" style={{ width: '50px', height: '50px', marginTop: '150px' }} />
                        <span>50 x 50</span>
                      </div>
                      <div className="profile-preview-item">
                        <img src={newAvatarPreview} alt="200x200" style={{ width: '200px', height: '200px' }} />
                        <span>200 x 200</span>
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

          {/* Change Password Modal */}
          {isChangePassModalOpen && (
            <div className="changepass-modal-overlay">
              <div className="changepass-modal">
                <div className="changepass-modal-content">
                  <h3>Change Password</h3>
                  <form onSubmit={handleChangePassword}>
                    <div className="changepass-form-group">
                      <label>New Password</label>
                      <div className="changepass-input-wrapper">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="changepass-toggle-btn"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="changepass-form-group">
                      <label>Confirm New Password</label>
                      <div className="changepass-input-wrapper">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="changepass-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="changepass-modal-buttons">
                      <button type="submit" className="changepass-confirm-btn">Change Password</button>
                      <button
                        type="button"
                        className="changepass-cancel-btn"
                        onClick={() => {
                          setIsChangePassModalOpen(false);
                          setNewPassword('');
                          setConfirmNewPassword('');
                          setShowNewPassword(false);
                          setShowConfirmPassword(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Balance and Transactions */}
          <section className="profile-balance-transactions">
            {/* Balance Card */}
            <div className="profile-balance-card">
              <div className="profile-balance-header">
                <h3>Total Balance</h3>
                <div className="profile-tabs">
                  {['Day', 'Week', 'Year'].map((period) => (
                    <button
                      key={period}
                      className={`profile-tab ${activePeriod === period ? 'profile-active' : ''}`}
                      onClick={() => setActivePeriod(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="profile-portfolio-value">
                <span>Portfolio 1 Value: </span>
                <span className="profile-portfolio-amount">{portfolioValue}</span>
              </div>
              <div className="profile-balance-amount">
                <span className={getAmountClass(balanceData[activePeriod].change)}>
                  {balanceData[activePeriod].total}
                </span>
                <div className="profile-change-wrapper">
                  <span
                    className={getChangeClass(showChangeInDollars ? balanceData[activePeriod].change : balanceData[activePeriod].percentage)}
                    onClick={() => setShowChangeInDollars(!showChangeInDollars)}
                    style={{ cursor: 'pointer' }}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {showChangeInDollars
                      ? balanceData[activePeriod].change
                      : balanceData[activePeriod].percentage}
                  </span>
                </div>
              </div>
              <div className="profile-graph" ref={graphRef}>
                Graph Placeholder
              </div>
            </div>

            {/* Transactions and Achievements */}
            <div className="profile-transactions">
              <div className="profile-transactions-header">
                <h3>{activeSection === 'Transactions' ? 'Last 5 Transactions' : 'Achievements'}</h3>
                <div className="profile-transactions-tabs">
                  {['Transactions', 'Achievements'].map((section) => (
                    <button
                      key={section}
                      className={`profile-transactions-tab ${activeSection === section ? 'profile-transactions-active' : ''}`}
                      onClick={() => setActiveSection(section)}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              {activeSection === 'Transactions' ? (
                <div className="profile-transactions-content">
                  <table>
                    <thead>
                      <tr>
                        <th>NO</th>
                        <th>COIN NAME</th>
                        <th>TOTAL QTY</th>
                        <th>AMOUNT</th>
                        <th>PORTFOLIO</th>
                        <th>SIDE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastFiveTransactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                          <td>{index + 1}</td>
                          <td>{transaction.coin}</td>
                          <td>{transaction.qty}</td>
                          <td>{transaction.amount}</td>
                          <td>{transaction.portfolio}</td>
                          <td>
                            <span className={`profile-${transaction.side.toLowerCase()}`}>
                              {transaction.side}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="profile-see-all"
                    onClick={() => setIsTransactionsModalOpen(true)}
                  >
                    See All Transactions
                  </button>
                </div>
              ) : (
                <div className="profile-achievements-content">
                  <div className="profile-achievements-placeholder">
                    <h4>Achievements Coming Soon!</h4>
                    <p>Stay tuned for your rewards and milestones.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Transactions Modal */}
      {isTransactionsModalOpen && (
        <div className="profile-modal-overlay">
          <div className="profile-modal transactions-modal">
            <div className="profile-modal-content">
              <h3>All Transactions</h3>
              <button
                className="profile-modal-close-btn"
                onClick={() => setIsTransactionsModalOpen(false)}
              >
                ×
              </button>
              <div className="profile-transactions-controls">
                <div className="profile-search-bar">
                  <input
                    type="text"
                    placeholder="Search by coin (e.g., BTC)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="profile-items-per-page">
                  <label>Show: </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              <div className="profile-table-wrapper">
                <table className="profile-all-transactions-table">
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>COIN NAME</th>
                      <th>TOTAL QTY</th>
                      <th>AMOUNT</th>
                      <th>PORTFOLIO</th>
                      <th>SIDE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{transaction.coin}</td>
                        <td>{transaction.qty}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.portfolio}</td>
                        <td>
                          <span className={`profile-${transaction.side.toLowerCase()}`}>
                            {transaction.side}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Profile;