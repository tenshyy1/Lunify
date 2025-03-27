import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export default function Header() {
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > lastScroll && currentScroll > 100) {
        setIsNavbarVisible(false);
      } else if (currentScroll < lastScroll) {
        setIsNavbarVisible(true);
      }

      lastScroll = Math.max(0, currentScroll);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleOverlay = () => {
    setIsOverlayActive(!isOverlayActive);
  };

  const closeOverlay = (e) => {
    if (!e.target.closest('.nav-overlay') && !e.target.closest('.navbar-toggler') && isOverlayActive) {
      setIsOverlayActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeOverlay);
    return () => {
      document.removeEventListener('click', closeOverlay);
    };
  }, [isOverlayActive]);

  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-dark bg-none ${isNavbarVisible ? 'visible' : 'hidden'}`}>
        <img src="src/assets/logo.svg" alt="Logo" />
        <button
          className={`navbar-toggler ${isOverlayActive ? 'active' : ''}`}
          type="button"
          onClick={toggleOverlay}
          aria-label="Переключить навигацию"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse_navbar navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link to="/" className="link_header" id="home-link">HOME</Link>
            </li>
            <li className="nav-item">
              <Link to="/app" className="link_header" id="converter-link">CONVERTER</Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="link_header" id="profile-link">PROFILE</Link>
            </li>
          </ul>
          <button className="btn btn-light ml-auto" hidden>
            <Link to="/login" id="login-link">LOGIN</Link>
          </button>
        </div>
      </nav>

      <div className={`nav-overlay ${isOverlayActive ? 'active' : ''}`}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="link_header" onClick={toggleOverlay}>HOME</Link>
          </li>
          <li className="nav-item">
            <Link to="/app" className="link_header" onClick={toggleOverlay}>CONVERTER</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="link_header" onClick={toggleOverlay}>PROFILE</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
