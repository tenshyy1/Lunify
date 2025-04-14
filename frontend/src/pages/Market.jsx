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
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionData, setSectionData] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('buy'); // 'buy' или 'sell'
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');

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
        <path fill="#fff" d="M25.723,25.968c-0.111,0.004-0.223,0.007-0.336,0.01C24.932,25.991,24.472,26,24,26 s-0.932-0.009-1.387-0.021c-0.113-0.003-0.225-0.006-0.336-0.1c-0.435-0.015-0.863-0.034-1.277-0.06V36h6V25.908 C26.586,25.934,26.158,25.953,25.723,25.968z"/>
      </svg>
    ),
  };

  useEffect(() => {
    fetchMarketData();
    fetchPortfolios();
  }, [selectedCategory]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'activePortfolioId') {
        const activePortfolioId = event.newValue;
        if (activePortfolioId && portfolios.some(p => p.id === parseInt(activePortfolioId))) {
          setSelectedPortfolioId(parseInt(activePortfolioId));
        } else if (portfolios.length > 0) {
          // 1 active portfolio
          setSelectedPortfolioId(portfolios[0].id);
          localStorage.setItem('activePortfolioId', portfolios[0].id.toString());
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [portfolios]);

  const fetchMarketData = async () => {
    try {
      const coins = await marketApi.getMarketCoins(selectedCategory);
      const gainers = await marketApi.getTopGainers();
      setSectionData(coins.map((coin, index) => ({
        id: String(index + 1).padStart(2, '0'),
        currency: coin.currency,
        ticker: coin.ticker,
        icon: fallbackIcons[coin.ticker.toLowerCase()] || fallbackIcons.btc,
        price: `$${coin.price_usd.toLocaleString('en-US')}`,
        last24h: `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h}%`,
        last7d: `${coin.change_7d > 0 ? '+' : ''}${coin.change_7d}%`,
      })));
      setTopGainers(gainers.map(gainer => ({
        currency: gainer.currency,
        ticker: gainer.ticker,
        price: `USD ${gainer.price_usd.toLocaleString('en-US')}`,
        change: `${gainer.change_24h > 0 ? '+' : ''}${gainer.change_24h}%`,
        icon: fallbackIcons[gainer.ticker.toLowerCase()] || fallbackIcons.btc,
      })));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch market data');
      setSectionData([]);
      setTopGainers([]);
    }
  };

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
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch portfolios');
      setPortfolios([]);
      setSelectedPortfolioId(null);
    }
  };

  const handleBuyClick = (coin) => {
    if (portfolios.length === 0) {
      toast.error('Please create a portfolio first');
      return;
    }
    if (!selectedPortfolioId) {
      toast.error('Please select a portfolio');
      return;
    }
    setSelectedCoin(coin);
    setModalAction('buy');
    setIsModalOpen(true);
  };

  const handleSellClick = (coin) => {
    if (portfolios.length === 0) {
      toast.error('Please create a portfolio first');
      return;
    }
    if (!selectedPortfolioId) {
      toast.error('Please select a portfolio');
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

  const filteredData = sectionData.filter((crypto) =>
    crypto.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedData = [...filteredData].sort((a, b) => {
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

  {/** Pagination logic */}
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  const numberedData = paginatedData.map((crypto, index) => ({
    ...crypto,
    displayId: String(startIndex + index + 1).padStart(2, '0'),
  }));

  {/** Event handlers for sorting, pagination, and search */}
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
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

   {/** Generate pagination buttons */}
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
               {/** Top gainers section */}
              <div className="market-top-gainers">
                {topGainers.map((gainer, index) => (
                  <div key={index} className="market-top-gainer-card">
                    <div className="market-top-gainer-header">
                      <span className="market-top-gainer-label">Top Gainer (24h)</span>
                    </div>
                    <div className="market-top-gainer-content">
                      <span className="market-top-gainer-icon">{gainer.icon}</span>
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

{/** Table and category controls */}
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
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                      <option value={300}>300</option>
                      <option value={400}>400</option>
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
                              <span className="market-currency-icon">{crypto.icon}</span> {crypto.currency}
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
                </AnimatePresence>

                {/** Pagination controls */}
                <div className="market-pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {paginationButtons}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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