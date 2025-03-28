import React from 'react';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Логотип */}
        <div className="footer-logo">
          <span>LUNIFY</span>
          <span className="dot">.</span>
        </div>

        {/* Социальные сети */}
        <div className="footer-socials">
          <span className="socials-label">SOCIALS</span>
          <div className="socials-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            </a>
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div className="footer-copyright">
        <p>Copyright © 2025 LUNIFY | ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
}