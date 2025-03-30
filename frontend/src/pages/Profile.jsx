import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/profile.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import foto from '../assets/favicon.png';

const Profile = ({ onLogout }) => { 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setLoading(false);
      navigate('/login'); 
    }

    fetch('http://localhost:8080/profile', {
      method: 'GET',
      headers: {
        'Authorization': token,
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
      })
      .then(data => {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setLogin(data.login || '');
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

    fetch('http://localhost:8080/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
      }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
      })
      .then(data => {
        console.log('Profile updated:', data);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-profile-container">
      <SideHeader onLogout={onLogout} activePage="profile" /> {/* Передаём onLogout */}
      <main className="profile-main-content">
        <Header login={login} />
        <div className="profile-content-wrapper">
          <section className="profile-profile-details">
            <div className="profile-profile-picture">
              <img src={foto} alt="Profile" />
            </div>
            <h2>{firstName && lastName ? `${firstName} ${lastName}` : 'Your Name'}</h2>
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
    </div>
  );
};

export default Profile;