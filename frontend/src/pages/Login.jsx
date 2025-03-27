import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  useEffect(() => {
    document.title = 'Lunify - Login'; 
  }, []); 

  return (
    <div className="login-container">
      <div className="logo">LUNIFY.</div>
      <div className="login-box">
        <h2>Login to your account</h2>
        <form>
          <div className="input-group">
            <input type="text" placeholder="tenshy" required />
            <label>Login</label>
          </div>
          <div className="input-group">
            <input type="password" placeholder="Enter your password" required />
            <label>Password</label>
          </div>
          <button type="submit" className="login-button">
            Login now
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;