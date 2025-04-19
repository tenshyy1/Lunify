import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import '../styles/home.css';
import { getProfile } from '../services/profile';
import marketApi from '../services/market';
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

const CryptoIcon = ({ name, iconFromApi }) => {
  if (iconFromApi) {
    return (
      <img
        src={iconFromApi}
        alt={name}
        style={{ width: '40px', height: '45px' }}
        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
      />
    );
  }

  return (
    <svg width="40px" height="45px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#ccc" />
    </svg>
  );
};

const Home = () => {
  const [login, setLogin] = useState('');
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [popularCryptos, setPopularCryptos] = useState([]);
  const [cryptoDataByCategory, setCryptoDataByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ["Popular", "Metaverse", "Entertainment", "Energy", "Gaming", "Music"];

  // Получаем данные из API
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const cachedData = localStorage.getItem('marketData');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          processMarketData(parsedData);
          setIsLoading(false);
          fetchAndUpdateData();
        } else {
          await fetchAndUpdateData();
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
        setPopularCryptos([]);
        setCryptoDataByCategory({});
        setIsLoading(false);
      }
    };

    const fetchAndUpdateData = async () => {
      try {
        const coins = await marketApi.getMarketCoins();
        localStorage.setItem('marketData', JSON.stringify(coins));
        processMarketData(coins);
        setIsLoading(false);
      } catch (error) {
        console.error('Error updating market data:', error);
        setIsLoading(false);
      }
    };

    const processMarketData = (coins) => {
      // Форматируем данные для Most Popular (первые 4 монеты)
      const formattedPopularCryptos = coins.slice(0, 4).map((coin, index) => {
        const currentPrice = coin.price_usd;
        const chartDataPoints = Array(7).fill(0).map((_, i) => {
          const variation = (Math.random() - 0.5) * currentPrice * 0.05;
          return Math.max(currentPrice + variation * (i / 6), 0);
        });
        chartDataPoints[6] = currentPrice;

        return {
          name: coin.ticker,
          fullName: coin.currency,
          price: currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }),
          change: `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h}%`,
          logo_url: coin.logo_url || 'https://via.placeholder.com/40',
          chartData: {
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: chartDataPoints,
                borderColor: coin.change_24h >= 0 ? '#34c759' : '#ff3b30',
                backgroundColor: coin.change_24h >= 0 ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
              },
            ],
          },
        };
      });
      setPopularCryptos(formattedPopularCryptos);

      // Форматируем данные для Market Update
      const allCoinsFormatted = coins.map((coin, index) => {
        const currentPrice = coin.price_usd;
        const chartDataPoints = Array(7).fill(0).map((_, i) => {
          const variation = (Math.random() - 0.5) * currentPrice * 0.05;
          return Math.max(currentPrice + variation * (i / 6), 0);
        });
        chartDataPoints[6] = currentPrice;

        return {
          id: (index % 7) + 1,
          name: coin.ticker,
          price: `$${coin.price_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          change: `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h}%`,
          changePositive: coin.change_24h > 0,
          ticker: coin.ticker,
          logo_url: coin.logo_url || 'https://via.placeholder.com/40',
          chartData: {
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                data: chartDataPoints,
                borderColor: coin.change_24h >= 0 ? '#34c759' : '#ff3b30',
                backgroundColor: coin.change_24h >= 0 ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
              },
            ],
          },
        };
      });

      // Распределяем монеты по категориям (по 7 в каждую)
      const dataByCategory = {};
      categories.forEach((category, index) => {
        const startIndex = index * 7;
        const endIndex = startIndex + 7;
        dataByCategory[category] = allCoinsFormatted.slice(startIndex, endIndex).map((coin, idx) => ({
          ...coin,
          id: idx + 1,
        }));
      });

      setCryptoDataByCategory(dataByCategory);
    };

    fetchMarketData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      if (currentScrollPos > 0) {
        setHasScrolled(true);
      }

      if (hasScrolled) {
        setIsNavVisible(
          prevScrollPos > currentScrollPos || currentScrollPos < 50
        );
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, hasScrolled]);

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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

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
      <nav className={`navbar ${isNavVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
        <div className="navbar-header">
          <div className="navbar-logo">
            <h1>LUNIFY</h1>
          </div>
          <div className="navbar-menu-wrapper">
            <button className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <span className="close-icon">✕</span>
              ) : (
                <span className="burger-icon">☰</span>
              )}
            </button>
          </div>
        </div>
        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/trade" onClick={() => setIsMenuOpen(false)}>Trade</Link></li>
            <li><Link to="/wallet" onClick={() => setIsMenuOpen(false)}>Wallet</Link></li>
            <li><Link to="/swap" onClick={() => setIsMenuOpen(false)}>Swap</Link></li>
            <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
          </ul>
          <div className="navbar-actions">
            {isLoggedIn ? (
              <div className="user-info">
                <span className="user-login">{login || 'User'}</span>
              </div>
            ) : (
              <>
                <Link to="/login" className="sign-in-btn" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="get-started-btn" onClick={() => setIsMenuOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
        {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
        <ul className="navbar-links desktop-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/trade">Trade</Link></li>
          <li><Link to="/wallet">Wallet</Link></li>
          <li><Link to="/swap">Swap</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
        <div className="navbar-actions desktop-actions">
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
          {isLoading ? (
            <p>Loading popular cryptos...</p>
          ) : popularCryptos.length > 0 ? (
            popularCryptos.map((crypto, index) => (
              <div key={index} className="crypto-card">
                <div className="crypto-content">
                  <div className="crypto-header">
                    <span className="crypto-icon">
                      <CryptoIcon name={crypto.name} iconFromApi={crypto.logo_url} />
                    </span>
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
            ))
          ) : (
            <p>No popular cryptos available.</p>
          )}
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
            {isLoading ? (
              <div className="mu-table-row">
                <span colSpan="6">Loading market data...</span>
              </div>
            ) : cryptoDataByCategory[activeCategory] && cryptoDataByCategory[activeCategory].length > 0 ? (
              cryptoDataByCategory[activeCategory].map((crypto) => (
                <div key={crypto.id} className="mu-table-row">
                  <span>{crypto.id}</span>
                  <span className="mu-crypto-name">
                    <CryptoIcon name={crypto.name} iconFromApi={crypto.logo_url} />
                    {crypto.name}
                  </span>
                  <span>{crypto.price}</span>
                  <span className={crypto.changePositive ? "mu-change-positive" : "mu-change-negative"}>
                    {crypto.change}
                  </span>
                  <span className="mu-market-stats">
                    <div className="mu-market-chart">
                      <Line data={crypto.chartData} options={chartOptions} />
                    </div>
                  </span>
                  {isLoggedIn ? (
                    <Link to="/trade">
                      <button className="mu-trade-btn">Trade</button>
                    </Link>
                  ) : (
                    <button className="mu-trade-btn mu-trade-btn-disabled" disabled title="Please login to trade">
                      Trade
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="mu-table-row">
                <span colSpan="6">No data available for this category.</span>
              </div>
            )}
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