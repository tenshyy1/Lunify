import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import '../styles/home.css';
import { getProfile } from '../services/profile'; 
import favicon from '../assets/favicon.png'

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const Home = () => {
  const [login, setLogin] = useState(''); 
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); 
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Home Page';
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = favicon;
    link.type = 'image/png';
    document.head.appendChild(link);
    const token = localStorage.getItem('token');
    if (token) {
      getProfile(token)
        .then(data => {
          setLogin(data.login || 'User'); 
          setIsLoggedIn(true); 
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setIsLoggedIn(false); 
          localStorage.removeItem('token'); 
          navigate('/login'); 
        });
    }
  }, [navigate]);

  const popularCryptos = [
    {
      name: 'BTC',
      fullName: 'Bitcoin',
      price: '100,623.54',
      change: '+1.41%',
      icon: (
        <svg width="40px" height="40px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fill-rule="evenodd">
            <circle cx="16" cy="16" r="16" fill="#F7931A"/>
            <path fill="#FFF" fill-rule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
          </g>
        </svg>
      ),
      chartData: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            data: [100000, 100500, 100200, 100800, 100600, 101000, 100623.54],
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.3)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
    },
    {
      name: 'ETH',
      fullName: 'Ethereum',
      price: '4,267.90',
      change: '+2.23%',
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg"
          aria-label="Ethereum" role="img"
          viewBox="0 0 512 512"><rect
          width="20px" height="20px"
          rx="15%"
          fill="#ffffff"/><path
          fill="#3C3C3B" d="m256 362v107l131-185z"/><path
          fill="#343434" d="m256 41l131 218-131 78-132-78"/><path
          fill="#8C8C8C" d="m256 41v158l-132 60m0 25l132 78v107"/><path
          fill="#141414" d="m256 199v138l131-78"/><path
          fill="#393939" d="m124 259l132-60v138"/></svg>
      ),
      chartData: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            data: [4200, 4250, 4220, 4300, 4280, 4260, 4267.9],
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.3)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
    },
    {
      name: 'BNB',
      fullName: 'Binance',
      price: '587.74',
      change: '+0.82%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L3 9l9 9 9-9-9-9zm0 16.5L5.25 9.75 12 3l6.75 6.75L12 16.5z" fill="#F3BA2F"/>
          <path d="M7.5 9.75L12 14.25l4.5-4.5L12 5.25 7.5 9.75z" fill="#F3BA2F"/>
        </svg>
      ),
      chartData: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            data: [580, 582, 585, 583, 586, 584, 587.74],
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.3)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
    },
    {
      name: 'USDT',
      fullName: 'Tether',
      price: '0.9998',
      change: '+0.03%',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm1.5-6h-3v-1h3v1zm0-2h-3v-4h3v4zm0-6h-3V7h3v1z" fill="#26A17B"/>
        </svg>
      ),
      chartData: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            data: [0.9995, 0.9996, 0.9997, 0.9996, 0.9998, 0.9997, 0.9998],
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.3)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="home-container">

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>LUNIFY</h1>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/trade">Trade</Link></li>
          <li><Link to="/wallet">Wallet</Link></li>
          <li><Link to="/swap">Swap</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="user-info">
              <span className="user-login">{login || 'User'}</span>
            </div>
          ) : (
            <>
              <Link to="/login" className="sign-in-btn">Sign in</Link>
              <Link to="/register" className="get-started-btn">Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Start and Build Your <span>Crypto Portfolio</span> Here</h1>
        <p>Only at Lunify, you can build a good portfolio & learn the best practices about cryptocurrency.</p>
        {!isLoggedIn && <button className="hero-btn">Get Started</button>}
      </section>

      {/* Most Popular Section */}
      <section className="popular-section">
        <h2>Most Popular</h2>
        <div className="crypto-cards">
          {popularCryptos.map((crypto, index) => (
            <div key={index} className="crypto-card">
              <div className="crypto-content">
                <div className="crypto-header">
                  <span className="crypto-icon">{crypto.icon}</span>
                  <div className="crypto-name">
                    <span className="name">{crypto.name}</span>
                    <span className="full-name">{crypto.fullName}</span>
                  </div>
                </div>
                <div className="crypto-price">
                  <span>${crypto.price}</span>
                  <span className={`price-change ${crypto.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {crypto.change}
                  </span>
                </div>
              </div>
              <div className="crypto-chart-wrapper">
                <div className="crypto-chart">
                  <Line data={crypto.chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*Features section */}
      <section className="features-section">
      <h2>Lunify Amazing Features</h2>
      <p>Explore sensational features to prepare your best investment in cryptocurrency</p>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <span>C</span>
          </div>
          <h3>Manage Portfolio</h3>
          <p>Buy and sell popular digital currencies, keep track of them in the one place.</p>
          <a href="#" className="feature-link">
            See Explained <span className="arrow">→</span>
          </a>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <span>₿</span>
          </div>
          <h3>Cryptocurrency Variety</h3>
          <p>Supports a variety of the most popular digital currencies and always up-to-date.</p>
          <a href="#" className="feature-link">
            See Explained <span className="arrow">→</span>
          </a>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <span>📖</span>
          </div>
          <h3>Learn Best Practice</h3>
          <p>Easy to know how to cryptocurrency works and friendly to newbie.</p>
          <a href="#" className="feature-link">
            See Explained <span className="arrow">→</span>
          </a>
        </div>
      </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span>LUNIFY</span>
            <span className="dot">.</span>
          </div>
          <div className="footer-socials">
            <span className="socials-label">SOCIALS</span>
            <div className="socials-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"></a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer"></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"></a>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>Copyright © 2025 LUNIFY | ALL RIGHTS RESERVED</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;