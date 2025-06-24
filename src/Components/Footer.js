import React from 'react';
import '../styles/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>🎬 <span className="black-text">movieMeteor</span></h3>
          <p>Your one-stop destination for top movies, trending shows, and web series. Watch, rate & enjoy!</p>

          <div className="social-icons">
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram">
    <FontAwesomeIcon icon={faInstagram} />
  </a>
  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="youtube">
    <FontAwesomeIcon icon={faYoutube} />
  </a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="twitter">
    <FontAwesomeIcon icon={faXTwitter} />
  </a>
</div>

        </div>

        <div className="footer-section links">
          <h4 className="red-text">Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/movies">Movies</a></li>
            <li><a href="/tv-shows">TV Shows</a></li>
            <li><a href="/web-series">Web Series</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4 className="red-text">Contact</h4>
          <p>Email: support@movieverse.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Hyderabad, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} <span className="red-text">MovieVerse</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
