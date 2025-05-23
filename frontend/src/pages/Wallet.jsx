import React, { useState, useEffect, useRef } from 'react';
import '../styles/wallet.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import walletApi from '../services/wallet';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Wallet = ({ onLogout, login, avatar }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [activePortfolioId, setActivePortfolioId] = useState(() => {
    return localStorage.getItem('activePortfolioId') || null;
  });
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [newPortfolio, setNewPortfolio] = useState({ name: '', description: '' });
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0 });
  const portfolioRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPortfolios();
    const interval = setInterval(fetchPortfolios, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activePortfolioId) {
      localStorage.setItem('activePortfolioId', activePortfolioId);
    } else {
      localStorage.removeItem('activePortfolioId');
    }
  }, [activePortfolioId]);

  const fetchPortfolios = async () => {
    try {
      let portfoliosData = await walletApi.getPortfolios();
      portfoliosData = Array.isArray(portfoliosData) ? portfoliosData : [];

      const updatedPortfolios = await Promise.all(
        portfoliosData.map(async (portfolio) => {
          const coins = await fetchPortfolioCoins(portfolio.id);
          const totalValue = coins.reduce((sum, coin) => {
            const value = parseFloat(coin.value.replace('$', '').replace(/,/g, '')) || 0;
            return sum + value;
          }, 0);
          return { ...portfolio, coins, total_value: totalValue };
        })
      );

      setPortfolios(updatedPortfolios);
      if (activePortfolioId && !updatedPortfolios.some(p => p.id === parseInt(activePortfolioId))) {
        setActivePortfolioId(null);
      }
      if (selectedPortfolio) {
        const updatedSelected = updatedPortfolios.find(p => p.id === selectedPortfolio.id);
        if (updatedSelected) {
          setSelectedPortfolio(updatedSelected);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch portfolios');
      setPortfolios([]);
    }
  };

  const handleCreatePortfolio = async () => {
    if (!newPortfolio.name) {
      toast.error('Portfolio name is required');
      return;
    }

    try {
      const response = await walletApi.createPortfolio(newPortfolio);
      const newPortfolioData = response || {};
      setPortfolios([...portfolios, { ...newPortfolioData, coins: [], total_value: 0 }]);
      setIsCreateModalOpen(false);
      setNewPortfolio({ name: '', description: '' });
      toast.success('Portfolio created successfully');
      if (portfolios.length === 0) {
        setActivePortfolioId(newPortfolioData.id.toString());
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create portfolio');
    }
  };

  const handleDeletePortfolio = async () => {
    try {
      await walletApi.deletePortfolio(portfolioToDelete.id);
      setPortfolios(portfolios.filter((p) => p.id !== portfolioToDelete.id));
      setIsDeleteModalOpen(false);
      setPortfolioToDelete(null);
      if (activePortfolioId === portfolioToDelete.id.toString()) {
        setActivePortfolioId(null);
      }
      if (selectedPortfolio && selectedPortfolio.id === portfolioToDelete.id) {
        setSelectedPortfolio(null);
      }
      toast.success('Portfolio deleted successfully');
      localStorage.setItem('portfolioDeleted', Date.now().toString());
    } catch (error) {
      toast.error(error.message || 'Failed to delete portfolio');
    }
  };

  const handleSetActivePortfolio = async (portfolioId) => {
    try {
      await walletApi.setActivePortfolio(portfolioId);
      setActivePortfolioId(portfolioId.toString());
      toast.success('Active portfolio updated');
    } catch (error) {
      toast.error(error.message || 'Failed to set active portfolio');
    }
  };

  const fetchPortfolioCoins = async (portfolioId) => {
    try {
      const response = await walletApi.getPortfolioCoins(portfolioId);
      const coins = Array.isArray(response) ? response : [];
      return coins.map((coin) => ({
        currency: coin.currency || 'Unknown',
        ticker: coin.ticker || 'UNKNOWN',
        logo_url: coin.logo_url || 'https://via.placeholder.com/40',
        amount: coin.amount || 0,
        value: `$${coin.value_usd ? coin.value_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`,
        change: `${coin.change_percent > 0 ? '+' : ''}${coin.change_percent ? coin.change_percent.toFixed(2) : '0.00'}%`,
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch portfolio coins');
      return [];
    }
  };

  const handlePortfolioHover = (index) => {
    const portfolioCard = portfolioRefs.current[index];
    if (portfolioCard) {
      const rect = portfolioCard.getBoundingClientRect();
      const containerRect = portfolioCard.parentElement.getBoundingClientRect();
      const left = rect.left - containerRect.left;
      const width = rect.width;
      setLineStyle({ left, width });
    }
  };

  const handlePortfolioLeave = () => {
    setLineStyle({ left: 0, width: 0 });
  };

  const formatTotalValue = (totalValue) => {
    if (totalValue === null || totalValue === undefined) return '0.00';
    return totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="wallet-container">
      <SideHeader onLogout={onLogout} activePage="wallet" />
      <main className="wallet-main-content">
        <Header login={login} avatar={avatar} />
        <div className="wallet-content-wrapper">
          <section className="wallet-section">
            <div className="wallet-content-container">
              {!selectedPortfolio ? (
                portfolios.length === 0 ? (
                  <div className="empty-portfolio">
                    <div className="create-portfolio-btn" onClick={() => setIsCreateModalOpen(true)}>
                      <span className="plus-icon">+</span>
                      <span>Create your first portfolio</span>
                    </div>
                  </div>
                ) : (
                  <div className="portfolio-grid">
                    <div className="portfolio-grid-header">
                      <h2>Your Portfolios</h2>
                      <div
                        className="portfolio-follow-line"
                        style={{ left: lineStyle.left, width: lineStyle.width }}
                      />
                      <button className="add-portfolio-btn" onClick={() => setIsCreateModalOpen(true)}>
                        Add Portfolio
                      </button>
                    </div>
                    <div className="portfolio-grid-items">
                      {portfolios.map((portfolio, index) => (
                        <div
                          key={portfolio.id}
                          className={`portfolio-card ${activePortfolioId === portfolio.id.toString() ? 'portfolio-card-active' : ''}`}
                          ref={(el) => (portfolioRefs.current[index] = el)}
                          onMouseEnter={() => handlePortfolioHover(index)}
                          onMouseLeave={handlePortfolioLeave}
                        >
                          <div className="portfolio-card-content" onClick={() => setSelectedPortfolio(portfolio)}>
                            <h3>{portfolio.name}</h3>
                            <p>{portfolio.description || 'No description'}</p>
                            <div className="portfolio-card-value">
                              <span>Total Value: ${formatTotalValue(portfolio.total_value)}</span>
                            </div>
                          </div>
                          <button
                            className="portfolio-set-active-btn"
                            onClick={() => handleSetActivePortfolio(portfolio.id)}
                            disabled={activePortfolioId === portfolio.id.toString()}
                          >
                            {activePortfolioId === portfolio.id.toString() ? 'Active' : 'Set Active'}
                          </button>
                          <button
                            className="portfolio-delete-btn"
                            onClick={() => {
                              setPortfolioToDelete(portfolio);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="portfolio-details">
                  <div className="portfolio-header">
                    <button className="portfolio-back-btn" onClick={() => setSelectedPortfolio(null)}>
                      <FaArrowLeft className="back-icon" />
                      Back
                    </button>
                    <h2>{selectedPortfolio.name || 'Unnamed Portfolio'}</h2>
                    <p>{selectedPortfolio.description || 'No description'}</p>
                  </div>
                  <div className="portfolio-stats">
                    <div className="portfolio-balance">
                      <h3>Balance</h3>
                      <div className="balance-value">
                        <span>${formatTotalValue(selectedPortfolio.total_value)}</span>
                        <span className="balance-change">+0%</span>
                      </div>
                      <div className="balance-details">
                        <div className="balance-income">
                          <span>Income</span>
                          <span>$0.00</span>
                        </div>
                        <div className="balance-expenses">
                          <span>Expenses</span>
                          <span>$0.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="portfolio-distribution">
                      <h3>Distribution</h3>
                      <div className="distribution-chart">
                        <div className="chart-placeholder">📊</div>
                      </div>
                      <div className="distribution-list">
                        {(() => {
                          const sortedCoins = [...(selectedPortfolio.coins || [])].sort((a, b) => {
                            const valueA = parseFloat(a.value.replace('$', '').replace(/,/g, '')) || 0;
                            const valueB = parseFloat(b.value.replace('$', '').replace(/,/g, '')) || 0;
                            return valueB - valueA;
                          });
                          const top5Coins = sortedCoins.slice(0, 5);
                          const remainingCoins = sortedCoins.slice(5);

                          return (
                            <>
                              {top5Coins.length > 0 ? (
                                top5Coins.map((coin, index) => (
                                  <div key={index} className="distribution-item">
                                    <img
                                      src={coin.logo_url}
                                      alt={coin.ticker}
                                      className="distribution-icon"
                                      style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                                    />
                                    <span className="distribution-currency">{coin.currency}</span>
                                    <span className="distribution-amount">{coin.amount}</span>
                                    <span className="distribution-value">{coin.value}</span>
                                    <span
                                      className={`distribution-change ${
                                        coin.change.includes('+') ? 'positive' : 'negative'
                                      }`}
                                    >
                                      {coin.change}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p>No coins in this portfolio.</p>
                              )}
                              {remainingCoins.length > 0 && (
                                <button className="open-all-btn" onClick={() => setIsModalOpen(true)}>
                                  See All{' '}
                                  <FaArrowRight
                                    style={{
                                      marginLeft: '5px',
                                      transition: 'transform 0.3s ease',
                                      transform: 'translateX(0)',
                                    }}
                                    onMouseEnter={(e) => (e.target.style.transform = 'translateX(5px)')}
                                    onMouseLeave={(e) => (e.target.style.transform = 'translateX(0)')}
                                  />
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="portfolio-coins-table">
                    <table className="wallet-coins-table">
                      <thead>
                        <tr>
                          <th>Coin</th>
                          <th>Amount</th>
                          <th>Value</th>
                          <th>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedPortfolio.coins && selectedPortfolio.coins.length > 0) ? (
                          selectedPortfolio.coins.map((coin, index) => (
                            <tr key={index}>
                              <td>
                                <img src={coin.logo_url} alt={coin.ticker} className="coin-icon" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                                {coin.currency}
                              </td>
                              <td>{coin.amount}</td>
                              <td>{coin.value}</td>
                              <td className={coin.change.includes('+') ? 'positive' : 'negative'}>
                                {coin.change}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                              No coins available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            className="wallet-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="wallet-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Create New Portfolio</h2>
              <p>Enter details to create a new portfolio.</p>
              <div className="wallet-modal-input-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                  placeholder="Portfolio Name"
                />
              </div>
              <div className="wallet-modal-input-group">
                <label>Description (Optional)</label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  placeholder="Portfolio Description"
                />
              </div>
              <div className="wallet-modal-actions">
                <button className="wallet-modal-cancel-btn" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button className="wallet-modal-create-btn" onClick={handleCreatePortfolio}>
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="wallet-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="wallet-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Delete Portfolio</h2>
              <p>Are you sure you want to delete "{portfolioToDelete?.name}"? This action cannot be undone.</p>
              <div className="wallet-modal-actions">
                <button className="wallet-modal-cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button className="wallet-modal-delete-btn" onClick={handleDeletePortfolio}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="distribution_modalscreen-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="distribution_modalscreen"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>All Assets</h2>
              <div className="distribution_modal-content">
                {[...(selectedPortfolio.coins || [])]
                  .sort((a, b) => {
                    const valueA = parseFloat(a.value.replace('$', '').replace(/,/g, '')) || 0;
                    const valueB = parseFloat(b.value.replace('$', '').replace(/,/g, '')) || 0;
                    return valueB - valueA;
                  })
                  .map((coin, index) => (
                    <div key={index} className="distribution-item">
                      <img
                        src={coin.logo_url}
                        alt={coin.ticker}
                        className="distribution-icon"
                        style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                      />
                      <span className="distribution-currency">{coin.currency}</span>
                      <span className="distribution-amount">{coin.amount}</span>
                      <span className="distribution-value">{coin.value}</span>
                      <span
                        className={`distribution-change ${
                          coin.change.includes('+') ? 'positive' : 'negative'
                        }`}
                      >
                        {coin.change}
                      </span>
                    </div>
                  ))}
              </div>
              <button className="distribution_close-btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default Wallet;