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
      question: 'Question 1',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      question: 'Question 2',
      answer: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      question: 'Question 3',
      answer: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    },
    {
      question: 'Question 4',
      answer: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
    },
    {
      question: 'Question 5',
      answer: 'Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
    },
    {
      question: 'Question 6',
      answer: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus.',
    },
    {
      question: 'Question 7',
      answer: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.',
    },
    {
      question: 'Question 8',
      answer: 'Omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
    },
    {
      question: 'Question 9',
      answer: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Quisquam esse ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem.',
    },
    {
      question: 'Question 10',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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