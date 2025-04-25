import React, { useState, useEffect } from 'react';
import '../styles/market.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import marketApi from '../services/market'; 
import walletApi from '../services/wallet';

const Market = ({ onLogout, login, avatar }) => {
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [itemsPerPage, setItemsPerPage] = useState(50); 
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allCoins, setAllCoins] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('buy');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categoryTickers = {
    Metaverse: ['SAND', 'MANA', 'ENJ', 'AXS', 'DEC', 'ATLAS', 'STARL', 'RACA', 'ILV', 'UFO', 'RNDR', 'ALICE', 'CHR', 'TLM', 'BOSON', 'DEP', 'YGG', 'CUBE', 'VRA', 'WILD'],
    Entertainment: ['THETA', 'TFUEL', 'BAT', 'CHZ', 'OGN', 'SLP', 'WOM', 'RFR', 'VIB', 'MFT', 'DENT', 'FUN', 'CELR', 'MTL', 'IQ', 'COS', 'WTC', 'KEY', 'LBC', 'BLZ'],
    Energy: ['POWR', 'EWT', 'SNC', 'WPR', 'GRID', 'SEELE', 'ENG', 'REQ', 'OST', 'GVT', 'AMB', 'NAS', 'QSP', 'RDN', 'DLT', 'APPC', 'SNTVT', 'NULS', 'FUEL', 'XAS'],
    Gaming: ['GALA', 'IMX', 'WAXP', 'UOS', 'MBOX', 'PYR', 'VULC', 'XWG', 'GAFI', 'KRL', 'AURY', 'PRIME', 'MYRIA', 'NAKA', 'GODS', 'FYN', 'LOKA', 'TLM', 'DERC', 'GHX'],
    Music: ['AUDIO', 'VIB', 'MFT', 'RFR', 'COS', 'VRA', 'BLZ', 'WOM', 'CELR', 'IQ', 'KEY', 'LBC', 'WTC', 'MTL', 'DENT', 'FUN', 'REQ', 'OST', 'RDN', 'SNTVT'],
  };

  useEffect(() => {
    marketApi.fetchMarketData(selectedCategory, setAllCoins, setTopGainers, setIsLoading, toast);
    fetchPortfolios();
  }, [selectedCategory]);

  useEffect(() => {
    categorizeCoins();
  }, [allCoins, searchQuery]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'portfolioDeleted') {
        fetchPortfolios();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await walletApi.getPortfolios();
      const portfoliosData = Array.isArray(response) ? response : response.data || [];
      setPortfolios(portfoliosData);
      const activePortfolioId = localStorage.getItem('activePortfolioId');
      if (activePortfolioId && portfoliosData.some(p => p.id === parseInt(activePortfolioId))) {
        setSelectedPortfolioId(parseInt(activePortfolioId));
      } else if (portfoliosData.length > 0) {
        setSelectedPortfolioId(portfoliosData[0].id);
        localStorage.setItem('activePortfolioId', portfoliosData[0].id.toString());
      } else {
        setSelectedPortfolioId(null);
        localStorage.removeItem('activePortfolioId');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch portfolios');
      setPortfolios([]);
      setSelectedPortfolioId(null);
      localStorage.removeItem('activePortfolioId');
    }
  };

  const categorizeCoins = () => {
    let filteredCoins = allCoins;

    filteredCoins = filteredCoins.filter((crypto) =>
      crypto.currency.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSectionData(filteredCoins);
    setCurrentPage(1);
  };

  const handleBuyClick = async (coin) => {
    if (portfolios.length === 0) {
      toast.error('Please create a portfolio first');
      return;
    }
    if (!selectedPortfolioId) {
      toast.error('Please select a portfolio');
      return;
    }
    try {
      const portfolioExists = portfolios.some(p => p.id === selectedPortfolioId);
      if (!portfolioExists) {
        toast.error('Selected portfolio no longer exists. Please select another portfolio.');
        await fetchPortfolios(); 
        return;
      }
    } catch (error) {
      toast.error('Failed to verify portfolio');
      return;
    }
    setSelectedCoin(coin);
    setModalAction('buy');
    setIsModalOpen(true);
  };

  const handleSellClick = async (coin) => {
    if (portfolios.length === 0) {
      toast.error('Please create a portfolio first');
      return;
    }
    if (!selectedPortfolioId) {
      toast.error('Please select a portfolio');
      return;
    }
    try {
      const portfolioExists = portfolios.some(p => p.id === selectedPortfolioId);
      if (!portfolioExists) {
        toast.error('Selected portfolio no longer exists. Please select another portfolio.');
        await fetchPortfolios(); 
        return;
      }
      const coins = await walletApi.getPortfolioCoins(selectedPortfolioId);
      const coinExists = coins.some(c => c.ticker === coin.ticker);
      if (!coinExists) {
        toast.error(`You don't have ${coin.ticker} in this portfolio to sell.`);
        return;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to verify portfolio or coins');
      return;
    }
    setSelectedCoin(coin);
    setModalAction('sell');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!selectedPortfolioId) {
      toast.error('No portfolio selected');
      return;
    }

    try {
      if (modalAction === 'buy') {
        await walletApi.addPortfolioCoin(selectedPortfolioId, {
          currency: selectedCoin.currency,
          ticker: selectedCoin.ticker,
          amount: parseFloat(amount),
        });
        toast.success(`Successfully bought ${amount} ${selectedCoin.ticker}`);
      } else {
        await walletApi.sellPortfolioCoin(selectedPortfolioId, {
          ticker: selectedCoin.ticker,
          amount: parseFloat(amount),
        });
        toast.success(`Successfully sold ${amount} ${selectedCoin.ticker}`);
      }
      setIsModalOpen(false);
      setAmount('');
      setSelectedCoin(null);
    } catch (error) {
      toast.error(error.message || `Failed to ${modalAction} coin`);
    }
  };

  const sortedData = [...sectionData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (sortConfig.key === 'price' || sortConfig.key === 'last24h' || sortConfig.key === 'last7d') {
      const aNum = parseFloat(aValue.replace('$', '').replace('%', '').replace(',', ''));
      const bNum = parseFloat(bValue.replace('$', '').replace('%', '').replace(',', ''));
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    return sortConfig.direction === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  const numberedData = paginatedData.map((crypto, index) => ({
    ...crypto,
    displayId: String(startIndex + index + 1).padStart(2, '0'),
  }));

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginationButtons = [];
  for (let i = 1; i <= Math.min(totalPages, 6); i++) {
    paginationButtons.push(
      <button
        key={i}
        className={currentPage === i ? 'market-active' : ''}
        onClick={() => handlePageChange(i)}
      >
        {String(i).padStart(2, '0')}
      </button>
    );
  }

  return (
    <div className="market-container">
      <SideHeader onLogout={onLogout} activePage="trade" />
      <main className="market-main-content">
        <Header login={login} avatar={avatar} />
        <div className="market-content-wrapper">
          <section className="market-section">
            <div className="market-content-container">
              <div className="market-top-gainers">
                {topGainers.map((gainer, index) => (
                  <div key={index} className="market-top-gainer-card">
                    <div className="market-top-gainer-header">
                      <span className="market-top-gainer-label">Top Gainer (24h)</span>
                    </div>
                    <div className="market-top-gainer-content">
                      <img src={gainer.logo_url} alt={gainer.ticker} className="market-top-gainer-icon" style={{ width: '40px', height: '40px' }} />
                      <div className="market-top-gainer-info">
                        <span className="market-top-gainer-price">{gainer.price}</span>
                        <span className="market-top-gainer-change">{gainer.change}</span>
                      </div>
                    </div>
                    <div className="market-top-gainer-details">
                      <span className="market-top-gainer-currency">{gainer.currency}</span>
                      <span className="market-top-gainer-ticker">{gainer.ticker}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="market-divider"></div>

              <div className="market-table-wrapper">
                <div className="market-categories-wrapper">
                  <div className="market-categories-and-search">
                    <div className="market-categories">
                      {['Popular', 'Metaverse', 'Entertainment', 'Energy', 'Gaming', 'Music'].map((category) => (
                        <button
                          key={category}
                          className={selectedCategory === category ? 'market-category market-category-active' : 'market-category'}
                          onClick={() => {
                            setSelectedCategory(category);
                            setSearchQuery('');
                            setCurrentPage(1);
                          }}
                          disabled={isLoading}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <div className="market-search-wrapper">
                      <input
                        type="text"
                        className="market-search-input"
                        placeholder={`Search in ${selectedCategory}...`}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        disabled={isLoading}
                      />
                      <svg
                        className="market-search-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a0aec0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                  </div>
                  <div className="market-items-per-page">
                    <label>Show: </label>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} disabled={isLoading}>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={150}>150</option>
                    </select>
                  </div>
                </div>

                {portfolios.length > 0 ? (
                  <div className="market-portfolio-selector" style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#ffffff', marginRight: '10px' }}>Select Portfolio: </label>
                    <select
                      value={selectedPortfolioId || ''}
                      onChange={(e) => {
                        const newPortfolioId = parseInt(e.target.value);
                        setSelectedPortfolioId(newPortfolioId);
                        localStorage.setItem('activePortfolioId', newPortfolioId.toString());
                      }}
                      style={{
                        padding: '8px',
                        background: '#2a2a2a',
                        color: '#ffffff',
                        border: '1px solid #444',
                        borderRadius: '8px',
                      }}
                      disabled={isLoading}
                    >
                      {portfolios.map((portfolio) => (
                        <option key={portfolio.id} value={portfolio.id}>
                          {portfolio.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p style={{ color: '#a0aec0', marginBottom: '20px' }}>
                    No portfolios available. Please create one in Wallet.
                  </p>
                )}

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ textAlign: 'center', padding: '20px' }}
                    >
                      <div className="loading-dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <p style={{ color: '#a0aec0' }}>Fetching market data...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={selectedCategory}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <table className="market-crypto-table">
                        <thead>
                          <tr>
                            <th onClick={() => handleSort('id')}>
                              No.
                              <span className="market-sort-arrow">
                                {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                              </span>
                            </th>
                            <th onClick={() => handleSort('currency')}>
                              Currency
                              <span className="market-sort-arrow">
                                {sortConfig.key === 'currency' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                              </span>
                            </th>
                            <th onClick={() => handleSort('price')}>
                              Current Price
                              <span className="market-sort-arrow">
                                {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                              </span>
                            </th>
                            <th onClick={() => handleSort('last24h')}>
                              Last 24h
                              <span className="market-sort-arrow">
                                {sortConfig.key === 'last24h' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                              </span>
                            </th>
                            <th onClick={() => handleSort('last7d')}>
                              Last 7d
                              <span className="market-sort-arrow">
                                {sortConfig.key === 'last7d' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                              </span>
                            </th>
                            <th>Performance</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {numberedData.map((crypto) => (
                            <tr key={crypto.id}>
                              <td>{crypto.displayId}</td>
                              <td>
                                <img src={crypto.logo_url} alt={crypto.ticker} className="market-currency-icon" style={{ width: '40px', height: '40px' }} />
                                {crypto.currency}
                              </td>
                              <td>{crypto.price}</td>
                              <td className={crypto.last24h.includes('+') ? 'market-positive' : 'market-negative'}>
                                {crypto.last24h}
                              </td>
                              <td className={crypto.last7d.includes('+') ? 'market-positive' : 'market-negative'}>
                                {crypto.last7d}
                              </td>
                              <td>
                                <div className="market-performance-graph">📈</div>
                              </td>
                              <td className="market-options-buttons">
                                <button className="market-buy-btn" onClick={() => handleBuyClick(crypto)}>Buy</button>
                                <button className="market-sell-btn" onClick={() => handleSellClick(crypto)}>Sell</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="market-pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Prev
                  </button>
                  {paginationButtons}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="market-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="market-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2>{modalAction === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.currency}</h2>
              <div className="market-modal-input-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                />
              </div>
              <div className="market-modal-actions">
                <button className="market-modal-cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button className="market-modal-submit-btn" onClick={handleModalSubmit}>
                  {modalAction === 'buy' ? 'Buy' : 'Sell'}
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

export default Market;