import React, { useState } from 'react';
import '../styles/wallet.css';
import Header from '../components/Header';
import SideHeader from '../components/SideHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Заглушка для иконок (можно заменить на API позже)
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

const Wallet = ({ onLogout, login, avatar }) => {
  // Состояние для управления модальным окном создания
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Состояние для управления модальным окном подтверждения удаления
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Состояние для выбранного портфеля (null, если ни один не выбран)
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  // Состояние для портфеля, который собираемся удалить
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  // Состояние для списка портфелей
  const [portfolios, setPortfolios] = useState([
    { id: 1, name: "My First Portfolio", description: "Main crypto holdings" },
    { id: 2, name: "HODL Portfolio", description: "Long-term investments" },
    { id: 3, name: "Trading Portfolio", description: "Active trading assets" },
  ]);
  // Состояние для формы создания портфеля
  const [newPortfolio, setNewPortfolio] = useState({ name: '', description: '' });

  // Пример данных монет в портфеле (можно заменить на API)
  const portfolioCoins = [
    { id: '01', currency: 'Bitcoin', ticker: 'BTC', amount: '0.5', value: '$42,004.01', change: '+12.7%', icon: fallbackIcons.btc },
    { id: '02', currency: 'Ethereum', ticker: 'ETH', amount: '2.0', value: '$3,214.88', change: '+9.5%', icon: fallbackIcons.eth },
    { id: '03', currency: 'Binance', ticker: 'BNB', amount: '10.0', value: '$18,204.01', change: '+8.3%', icon: fallbackIcons.bnb },
    { id: '04', currency: 'Tether', ticker: 'USDT', amount: '5000.0', value: '$6,014.63', change: '+5.2%', icon: fallbackIcons.usdt },
  ];

  // Пример данных для статистики (можно заменить на API)
  const portfolioStats = {
    totalBalance: 'USD 1,250.418',
    change: '+12.7%',
    income: 'USD 25,103.63',
    expenses: 'USD 16,267.04',
    distribution: [
      { currency: 'Bitcoin', ticker: 'BTC', amount: '0.5', value: '$42,004.01', change: '+12.7%', icon: fallbackIcons.btc },
      { currency: 'Ethereum', ticker: 'ETH', amount: '2.0', value: '$3,214.88', change: '+9.5%', icon: fallbackIcons.eth },
      { currency: 'Tether', ticker: 'USDT', amount: '5000.0', value: '$6,014.63', change: '+5.2%', icon: fallbackIcons.usdt },
    ],
  };

  // Обработчик для открытия/закрытия модального окна создания
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
    if (isCreateModalOpen) {
      // Очищаем форму при закрытии
      setNewPortfolio({ name: '', description: '' });
    }
  };

  // Обработчик для открытия/закрытия модального окна подтверждения удаления
  const toggleDeleteModal = (portfolio = null) => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
    setPortfolioToDelete(portfolio);
  };

  // Обработчик для изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPortfolio((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик для создания портфеля
  const handleCreatePortfolio = () => {
    if (!newPortfolio.name.trim()) return; // Не создаем, если имя пустое
    const newId = portfolios.length ? Math.max(...portfolios.map(p => p.id)) + 1 : 1;
    setPortfolios([...portfolios, { id: newId, name: newPortfolio.name, description: newPortfolio.description }]);
    toast.success(`Portfolio "${newPortfolio.name}" created successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    toggleCreateModal();
  };

  // Обработчик для удаления портфеля
  const handleDeletePortfolio = () => {
    if (!portfolioToDelete) return;
    setPortfolios(portfolios.filter(portfolio => portfolio.id !== portfolioToDelete.id));
    toast.error(`Portfolio "${portfolioToDelete.name}" deleted successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    toggleDeleteModal();
  };

  // Обработчик для выбора портфеля
  const handlePortfolioClick = (portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  // Обработчик для возврата на экран портфелей
  const handleBackClick = () => {
    setSelectedPortfolio(null);
  };

  return (
    <div className="wallet-container">
      <SideHeader onLogout={onLogout} activePage="wallet" />
      <main className="wallet-main-content">
        <Header login={login} avatar={avatar} />
        <div className="wallet-content-wrapper">
          <section className="wallet-section">
            <motion.div
              className="wallet-content-container"
              animate={{ filter: isCreateModalOpen || isDeleteModalOpen ? "blur(5px)" : "blur(0px)" }}
              transition={{ duration: 0.3 }}
            >
              {selectedPortfolio ? (
                // Экран выбранного портфеля
                <div className="portfolio-details">
                  <div className="portfolio-header">
                    <button className="portfolio-back-btn" onClick={handleBackClick}>
                      ← Back
                    </button>
                    <h2>{selectedPortfolio.name}</h2>
                    <p>{selectedPortfolio.description}</p>
                  </div>

                  {/* Статистика портфеля */}
                  <div className="portfolio-stats">
                    <div className="portfolio-balance">
                      <h3>Portfolio Balance</h3>
                      <div className="balance-value">
                        <span>{portfolioStats.totalBalance}</span>
                        <span className="balance-change">{portfolioStats.change}</span>
                      </div>
                      <div className="balance-details">
                        <div className="balance-income">
                          <span>Income</span>
                          <span>{portfolioStats.income}</span>
                        </div>
                        <div className="balance-expenses">
                          <span>Expenses</span>
                          <span>{portfolioStats.expenses}</span>
                        </div>
                      </div>
                    </div>
                    <div className="portfolio-distribution">
                      <h3>Distribution</h3>
                      <div className="distribution-chart">
                        {/* Здесь должна быть кольцевая диаграмма, но пока заглушка */}
                        <div className="chart-placeholder">Chart Placeholder</div>
                      </div>
                      <div className="distribution-list">
                        {portfolioStats.distribution.map((coin, index) => (
                          <div key={index} className="distribution-item">
                            <span className="distribution-icon">{coin.icon}</span>
                            <span className="distribution-currency">{coin.currency}</span>
                            <span className="distribution-amount">{coin.amount}</span>
                            <span className="distribution-value">{coin.value}</span>
                            <span className="distribution-change">{coin.change}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Таблица монет в портфеле */}
                  <div className="portfolio-coins-table">
                    <table className="wallet-coins-table">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Currency</th>
                          <th>Amount</th>
                          <th>Value</th>
                          <th>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioCoins.map((coin, index) => (
                          <tr key={coin.id}>
                            <td>{coin.id}</td>
                            <td>
                              <span className="coin-icon">{coin.icon}</span> {coin.currency} ({coin.ticker})
                            </td>
                            <td>{coin.amount}</td>
                            <td>{coin.value}</td>
                            <td className={coin.change.includes('+') ? 'positive' : 'negative'}>
                              {coin.change}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Экран списка портфелей
                <div className="portfolio-grid">
                  {portfolios.length === 0 ? (
                    <div className="empty-portfolio">
                      <button className="create-portfolio-btn" onClick={toggleCreateModal}>
                        <span className="plus-icon">+</span>
                        <span>Create</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="portfolio-grid-header">
                        <h2>My Portfolios</h2>
                        <button className="add-portfolio-btn" onClick={toggleCreateModal}>
                          + Add Portfolio
                        </button>
                      </div>
                      <div className="portfolio-grid-items">
                        {portfolios.map((portfolio) => (
                          <div
                            key={portfolio.id}
                            className="portfolio-card"
                          >
                            <div className="portfolio-card-content" onClick={() => handlePortfolioClick(portfolio)}>
                              <h3>{portfolio.name}</h3>
                              <p>{portfolio.description}</p>
                              <div className="portfolio-card-value">
                                <span>USD 24,012.02</span>
                              </div>
                            </div>
                            <button
                              className="portfolio-delete-btn"
                              onClick={() => toggleDeleteModal(portfolio)}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
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
              <div className="wallet-modal-input-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter portfolio name"
                  value={newPortfolio.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="wallet-modal-input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  value={newPortfolio.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="wallet-modal-actions">
                <button className="wallet-modal-cancel-btn" onClick={toggleCreateModal}>
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
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete the portfolio "{portfolioToDelete?.name}"?</p>
              <div className="wallet-modal-actions">
                <button className="wallet-modal-cancel-btn" onClick={() => toggleDeleteModal()}>
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

      {/* Контейнер для уведомлений Toastify */}
      <ToastContainer />
    </div>
  );
};

export default Wallet;