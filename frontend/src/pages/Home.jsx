import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import '../styles/home.css';


// Регистрируем компоненты Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const Home = () => {
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L1.5 12 12 18 22.5 12 12 0zm0 16.5L3 12l9-10.5 9 10.5-9 4.5z" fill="#627EEA"/>
          <path d="M12 18v6l9-10.5L12 18z" fill="#627EEA"/>
          <path d="M12 18v6L3 13.5 12 18z" fill="#627EEA"/>
        </svg>
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
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/market">Market</Link>
          </li>
          <li>
            <Link to="/learn">Learn</Link>
          </li>
        </ul>
        <div className="navbar-actions">
          <Link to="/login" className="sign-in-btn">
            Sign in
          </Link>
          <button className="get-started-btn">Get started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>
          Start and Build Your <span>Crypto Portfolio</span> Here
        </h1>
        <p>Only at Lunify, you can build a good portfolio & learn the best practices about cryptocurrency.</p>
        <button className="hero-btn">Get Started</button>
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

      <Footer />
    </div>
  );
};

export default Home;