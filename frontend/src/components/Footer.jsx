import React from 'react';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="main-content">
        <div className="left-section">
          <div>
            <img src="src/assets/logo.svg" className="logo_footer" alt="Logo" />
          </div>
          <div className="about-us">
            <a href="/about" id="about-link">ABOUT US</a>
          </div>
        </div>
        <div className="right-section">
          <div className="follow-space">
            <span>FOLLOW SPACE</span>
            <div className="links">
              <a href="#"><img src="src/assets/x.svg" alt="X" /></a>
              <a href="#"><img src="src/assets/youtube.svg" alt="YouTube" /></a>
              <a href="#"><img src="src/assets/telegram.svg" alt="Telegram" /></a>
            </div>
          </div>
          <div className="contact">
            Any questions: <a href="mailto:arturtk000@gmail.com">space@koorp.com</a>
          </div>
        </div>
      </div>
      <div className="copyright">SPACE © 2025</div>
    </footer>
  );
}
