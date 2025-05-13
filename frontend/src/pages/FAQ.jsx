import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FAQ.css';
import SideHeader from '../components/SideHeader';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = ({ onLogout, login, avatar }) => {
  const navigate = useNavigate();

  return (
    <div className="faq-container">
      <SideHeader activePage="faq" onLogout={onLogout} />
      <main className="faq-main-content">
        <Header login={login} avatar={avatar} />
        <div className="faq-content-wrapper">
          <section className="faq-section">
            <div className="faq-content-container">
              <h2>FAQ</h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Здесь будет контент FAQ */}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default FAQ;