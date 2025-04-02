import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import '../styles/home.css';
import { getProfile } from '../services/profile';
import favicon from '../assets/favicon.png';
import nftInvesting from '../assets/news/nft-investing.jpg';
import news2 from '../assets/news/news2.jpg';
import news3 from '../assets/news/news3.jpeg';
import news4 from '../assets/news/news4.png';
import news5 from '../assets/news/news5.jpg';
import x from '../assets/socials/x.svg';
import telegram from '../assets/socials/telegram.svg';
import youtube from '../assets/socials/youtube.svg';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

//change to api
const CryptoIcon = ({ name, iconFromApi }) => {
  const fallbackIcons = {
    btc: (
      <svg width="40px" height="45px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path
            fill="#FFF"
            fillRule="nonzero"
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
          />
        </g>
      </svg>
    ),
    eth: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 32 32">
        <g fill="none" fillRule="evenodd">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <g fill="#FFF" fillRule="nonzero">
            <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
            <path d="M16.498 4L9 16.22l7.498-3.35z" />
            <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
            <path d="M16.498 27.995v-6.028L9 17.616z" />
            <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
            <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
          </g>
        </g>
      </svg>
    ),
    bnb: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 2000 2000">
        <g fill="#f3ba2f">
          <path d="M611.59 840.42l388.4-388.39 388.6 388.59 226-226L999.99 0 385.6 614.42l225.99 226"/>
          <path d="M.006 999.969l226.007-226.007 225.992 225.993L226 1225.96z"/>
          <path d="M611.59 1159.58l388.4 388.39 388.59-388.58 226.12 225.88-.11.12L999.99 2000l-614.41-614.4-.32-.32 226.33-225.7"/>
          <path d="M1548.013 1000.093l226.007-226.006 225.992 225.992-226.006 226.007z"/>
          <path d="M1229.22 999.88h.1L999.99 770.55 830.51 940.03h-.01l-19.47 19.48-40.16 40.17-.32.31.32.33 229.12 229.13 229.33-229.33.11-.13-.21-.11"/>
        </g>
      </svg>
    ),
    usdt: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40px" height="45px">
        <circle cx="24" cy="24" r="20" fill="#26a69a"/>
        <rect width="18" height="5" x="15" y="13" fill="#fff"/>
        <path fill="#fff" d="M24,21c-4.457,0-12,0.737-12,3.5S19.543,28,24,28s12-0.737,12-3.5S28.457,21,24,21z M24,26 c-5.523,0-10-0.895-10-2c0-1.105,4.477-2,10-2s10,0.895,10,2C34,25.105,29.523,26,24,26z"/>
        <path fill="#fff" d="M24,24c1.095,0,2.093-0.037,3-0.098V13h-6v10.902C21.907,23.963,22.905,24,24,24z"/>
        <path fill="#fff" d="M25.723,25.968c-0.111,0.004-0.223,0.007-0.336,0.01C24.932,25.991,24.472,26,24,26 s-0.932-0.009-1.387-0.021c-0.113-0.003-0.225-0.006-0.336-0.01c-0.435-0.015-0.863-0.034-1.277-0.06V36h6V25.908 C26.586,25.934,26.158,25.953,25.723,25.968z"/>
      </svg>
    )
  };

  // Если есть иконка из API
  // if (iconFromApi) {
  //   return <img src={iconFromApi} alt={name} style={{ width: '40px', height: '45px' }} />;
  // }

  // серый круг для неизвестных криптовалют
  return fallbackIcons[name.toLowerCase()] || (
    <svg width="40px" height="45px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#ccc" />
    </svg>
  );
};

const Home = () => {
  const [login, setLogin] = useState('');
  const [activeCategory, setActiveCategory] = useState("Popular");
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

  //change to api
  const popularCryptos = [
    {
      name: 'BTC',
      fullName: 'Bitcoin',
      price: '100,623.54',
      change: '+1.41%',
      icon: <CryptoIcon name="BTC" />,
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
      icon: <CryptoIcon name="ETH" />,
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
      icon: <CryptoIcon name="BNB" />,
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
      icon: <CryptoIcon name="USDT" />,
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
  //change to api
  const categories = ["Popular", "Metaverse", "Entertainment", "Energy", "Gaming", "Music"];
  const cryptoDataByCategory = {
    Popular: popularCryptos.map((crypto, index) => ({
      id: index + 1,
      name: crypto.name,
      price: `$${crypto.price}`,
      change: crypto.change,
      changePositive: crypto.change.startsWith('+')
    })),
    Metaverse: [{ id: 1, name: "Decentraland", price: "$3.45", change: "-0.42%", changePositive: false }],
    Entertainment: [{ id: 1, name: "Theta", price: "$7.89", change: "2.01%", changePositive: true }],
    Energy: [{ id: 1, name: "Power Ledger", price: "$0.59", change: "-1.21%", changePositive: false }],
    Gaming: [{ id: 1, name: "Axie Infinity", price: "$72.13", change: "0.78%", changePositive: true }],
    Music: [{ id: 1, name: "Audius", price: "$1.24", change: "-0.90%", changePositive: false }],
  };

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

  const learnAboutData = [
    {
      category: 'CRYPTO BASIC',
      title: 'All about investing in NFTs and related risks',
      description: '',
      image: nftInvesting,
      isLarge: true,
    },
    {
      category: 'CRYPTO BASIC',
      title: 'Cryptocurrencies are basically digital assets. It is secured by cryptography',
      description: '',
      image: news2,
      isLarge: false,
    },
    {
      category: 'CRYPTO BASIC',
      title: 'From direct deposit to earning yield, key ways crypto can help take control',
      description: '',
      image: news3,
      isLarge: false,
    },
    {
      category: 'TIPS & TRICKS',
      title: 'When prices are fluctuating, how do you know when to buy?',
      description: '',
      image: news4,
      isLarge: false,
    },
    {
      category: 'TIPS & TRICKS',
      title: 'Welcome to decentralized finance (DeFi), the new frontier of crypto that',
      description: '',
      image: news5,
      isLarge: false,
    },
  ];

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
        {!isLoggedIn && <Link to="/register" className="hero-btn">Get Started</Link>}
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

      {/* Features Section */}
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
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>₿</span>
            </div>
            <h3>Cryptocurrency Variety</h3>
            <p>Supports a variety of the most popular digital currencies and always up-to-date.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>📖</span>
            </div>
            <h3>Learn Best Practice</h3>
            <p>Easy to know how to cryptocurrency works and friendly to newbie.</p>
          </div>
        </div>
      </section>

      {/* Market Update Section */}
      <section className="mu-section">
        <h2>Market Update</h2>
        <div className="mu-filters">
          <div className="mu-categories">
            {categories.map((category) => (
              <span
                key={category}
                className={`mu-category ${activeCategory === category ? "mu-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="mu-table">
          <div className="mu-table-header">
            <span>NO</span>
            <span>NAME</span>
            <span>LAST PRICE</span>
            <span>CHANGE</span>
            <span>MARKET STATS</span>
            <span>TRADE</span>
          </div>
          <div className="mu-table-body" key={activeCategory}>
            {cryptoDataByCategory[activeCategory].map((crypto) => (
              <div key={crypto.id} className="mu-table-row">
                <span>{crypto.id}</span>
                <span className="mu-crypto-name">
                  {crypto.icon ? (
                    crypto.icon
                  ) : (
                    <CryptoIcon name={crypto.name} />
                  )}
                  {crypto.name}
                </span>
                <span>{crypto.price}</span>
                <span className={crypto.changePositive ? "mu-change-positive" : "mu-change-negative"}>
                  {crypto.change}
                </span>
                <span className="mu-market-stats">
                  <div className="mu-chart-placeholder"></div>
                </span>
                <button className="mu-trade-btn">Trade</button>
              </div>
            ))}
          </div>
        </div>
        <a href="/trade" className="mu-see-all-coins">
          See All Coins
        </a>
      </section>

      {/* Learn About Section */}
      <section className="la-section">
        <h2>Learn About Cryptocurrency</h2>
        <p>Learn all about cryptocurrency to start investing</p>
        <div className="la-grid">
          {learnAboutData.map((item, index) => (
            <div key={index} className={`la-card ${item.isLarge ? 'la-card-large' : ''}`}>
              <img src={item.image} alt={item.title} className="la-image" />
              <div className="la-content">
                <span className="la-category">{item.category}</span>
                <h3 className="la-title">{item.title}</h3>
                {item.description && <p className="la-description">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Generation Section */}
      {!isLoggedIn && (
        <section className="ng-section">
          <div className="ng-content">
            <h2>Join a new generation of investors</h2>
            <Link to="/register" className="ng-btn">Get started</Link>
          </div>
        </section>
      )}

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
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={x} alt="Twitter" className="social-icon" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <img src={telegram} alt="Discord" className="social-icon" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img src={youtube} alt="YouTube" className="social-icon" />
              </a>
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