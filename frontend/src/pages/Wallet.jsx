import React, { useState, useEffect, useRef } from 'react';
import '../styles/wallet.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import walletApi from '../services/wallet';
import { FaArrowLeft } from 'react-icons/fa'; 

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

  useEffect(() => {
    fetchPortfolios();
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
      const response = await walletApi.getPortfolios();
      const portfoliosData = Array.isArray(response) ? response : [];
      setPortfolios(portfoliosData);
      if (activePortfolioId && !portfoliosData.some(p => p.id === parseInt(activePortfolioId))) {
        setActivePortfolioId(null);
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
      setPortfolios([...portfolios, newPortfolioData]);
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

  const handleSetActivePortfolio = (portfolioId) => {
    setActivePortfolioId(portfolioId.toString());
    toast.success('Active portfolio updated');
  };

  const fetchPortfolioCoins = async (portfolioId) => {
    try {
      const response = await walletApi.getPortfolioCoins(portfolioId);
      const coins = Array.isArray(response) ? response : [];
      return coins.map((coin) => ({
        currency: coin.currency || 'Unknown',
        ticker: coin.ticker || 'UNKNOWN',
        logo_url: coin.logo_url || 'https://via.placeholder.com/40', // Убедились, что logo_url передаётся
        amount: coin.amount || 0,
        value: `$${coin.value_usd ? coin.value_usd.toLocaleString('en-US') : '0.00'}`,
        change: `${coin.change_percent > 0 ? '+' : ''}${coin.change_percent || 0}%`,
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
                      {portfolios.map((portfolio, index) => {
                        const totalValue = (portfolio.coins || []).reduce((sum, coin) => {
                          const value = parseFloat(coin.value.replace('$', '').replace(',', '')) || 0;
                          return sum + value;
                        }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

                        return (
                          <div
                            key={portfolio.id}
                            className={`portfolio-card ${activePortfolioId === portfolio.id.toString() ? 'portfolio-card-active' : ''}`}
                            ref={(el) => (portfolioRefs.current[index] = el)}
                            onMouseEnter={() => handlePortfolioHover(index)}
                            onMouseLeave={handlePortfolioLeave}
                          >
                            <div className="portfolio-card-content" onClick={async () => {
                              const coins = await fetchPortfolioCoins(portfolio.id);
                              setSelectedPortfolio({ ...portfolio, coins });
                            }}>
                              <h3>{portfolio.name}</h3>
                              <p>{portfolio.description || 'No description'}</p>
                              <div className="portfolio-card-value">
                                <span>Total Value: {totalValue}</span>
                              </div>
                              {portfolio.coins && portfolio.coins.length > 0 && (
                                <img
                                  src={portfolio.coins[0].logo_url}
                                  alt={portfolio.coins[0].ticker}
                                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                />
                              )}
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
                        );
                      })}
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
                        <span>
                          ${(selectedPortfolio.coins && selectedPortfolio.coins.length > 0
                            ? selectedPortfolio.coins.reduce((sum, coin) => {
                                const value = parseFloat(coin.value.replace('$', '').replace(',', '')) || 0;
                                return sum + value;
                              }, 0)
                            : 0).toLocaleString('en-US')}
                        </span>
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
                        {selectedPortfolio.coins && selectedPortfolio.coins.length > 0 ? (
                          selectedPortfolio.coins.map((coin, index) => (
                            <div key={index} className="distribution-item">
                              <img src={coin.logo_url} alt={coin.ticker} className="distribution-icon" style={{ width: '50px', height: '50px', borderRadius: '50%' }}/>
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
                        {selectedPortfolio.coins && selectedPortfolio.coins.length > 0 ? (
                          selectedPortfolio.coins.map((coin, index) => (
                            <tr key={index}>
                              <td>
                                <img src={coin.logo_url} alt={coin.ticker} className="coin-icon" style={{ width: '40px', height: '40px', borderRadius: '50%' }}/>
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

      {/* Модальное окно для создания портфеля */}
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
              <p>details to create a new portfolio.</p>
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

      {/* Модальное окно для подтверждения удаления */}
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
      <ToastContainer />
    </div>
  );
};

export default Wallet;