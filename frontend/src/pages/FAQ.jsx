import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FAQ.css';
import SideHeader from '../components/SideHeader';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = ({ onLogout, login, avatar }) => {
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState(null);
  const answerRefs = useRef([]);

  const faqData = [
    {
      question: 'How do I start trading cryptocurrencies on Lunify?',
      answer: 'To start trading, register an account, go to the "Market" section, select a portfolio, and click "Buy" or "Sell" next to your chosen currency. Ensure your balance is sufficient for the purchase.',
    },
    {
      question: 'How can I add a new portfolio in Wallet?',
      answer: 'Navigate to the "Wallet" section, click "Add Portfolio," and fill in the required details. Your new portfolio will appear in the list with a unique number.',
    },
    {
      question: 'Why are my transactions not showing in my profile?',
      answer: 'Ensure your portfolio is updated and the transactions are completed. If the issue persists, contact support through the notifications section.',
    },
    {
      question: 'How do I update my profile details, like my name or avatar?',
      answer: 'Go to the "Profile" section, click the pencil icon at the bottom, edit your details or upload a new avatar, and click "Save Change" to confirm.',
    },
    {
      question: 'What should I do if I forget my password?',
      answer: 'Click "Change Password" in the Profile section and follow the instructions to reset your password via the email you used during registration.',
    },
    {
      question: 'How can I track the performance of my portfolio?',
      answer: 'In the "Wallet" section, select your portfolio to view its performance chart and detailed stats, including profit/loss and transaction history.',
    },
    {
      question: 'Is there a fee for trading on Lunify?',
      answer: 'Yes, Lunify charges a small trading fee, which varies depending on the transaction type. Check the fee structure in the "Market" section before trading.',
    },
    {
      question: 'How do I delete a portfolio I no longer need?',
      answer: 'In the "Wallet" section, select the portfolio, click the three-dot menu, and choose "Delete Portfolio." Confirm the action to remove it permanently.',
    },
    {
      question: 'Can I use Lunify on multiple devices?',
      answer: 'Yes, you can log into your Lunify account from any device using your credentials. Your data will sync automatically across devices.',
    },
    {
      question: 'How do I contact support if I encounter an issue?',
      answer: 'Go to the notifications icon in the sidebar, click "Contact Support," and submit your query. Our team will respond within 24 hours.',
    },
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="faq-container">
      <SideHeader activePage="faq" onLogout={onLogout} />
      <main className="faq-main-content">
        <Header login={login} avatar={avatar} />
        <div className="faq-content-wrapper">
          <section className="faq-section">
            <div className="faq-content-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="faq-list">
                    {faqData.map((item, index) => (
                      <div key={index} className="faq-item" ref={(el) => (answerRefs.current[index] = el)}>
                        <motion.div
                          className="faq-question"
                          onClick={() => toggleQuestion(index)}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                          <h3>{item.question}</h3>
                          <svg
                            className={`faq-arrow ${openQuestion === index ? 'open' : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 5L8 11L14 5"
                              stroke="#60A5FA"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                        <AnimatePresence>
                          {openQuestion === index && (
                            <motion.div
                              className="faq-answer"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{
                                height: answerRefs.current[index]?.getBoundingClientRect().height || 'auto',
                                opacity: 1,
                              }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            >
                              <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                              >
                                {item.answer}
                              </motion.p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
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