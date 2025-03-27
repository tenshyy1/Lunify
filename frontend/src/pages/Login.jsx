import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/login.css';
import favicon from '../assets/favicon.png';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    document.title = 'Lunify - Login';
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = favicon;
    link.type = 'image/png';
    document.head.appendChild(link);
  }, []); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //validation
  const validateLogin = (value) => {
    if (value.length < 3) {
      setLoginError('Login must be at least 3 characters');
    } else {
      setLoginError('');
    }
  };
  const validatePassword = (value) => {
    if (value.length < 3) {
      setPasswordError('Password must be at least 3 characters');
    } else {
      setPasswordError('');
    }
  };
  const handleLoginChange = (e) => {
    const value = e.target.value;
    setLogin(value);
    validateLogin(value);
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };


  //successfully login
  const handleSubmit = (e) => {
    e.preventDefault();
    if (login.length >= 3 && password.length >= 3 && !loginError && !passwordError) {
      console.log('мяу');
    }
  };

  return (
    <div className="login-container">
      <div className="logo">LUNIFY<span>.</span></div>
      <div className="login-box">
        <h2>Login to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              id="login" 
              value={login}
              onChange={handleLoginChange}
              maxLength={15}
              required 
            />
            <label htmlFor="login">Login</label>
            {loginError && <span className="error-message">{loginError}</span>}
          </div>
          <div className="input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              value={password}
              onChange={handlePasswordChange}
              maxLength={20}
              required 
            />
            <label htmlFor="password">Password</label>
            <button 
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
            {passwordError && <span className="error-message">{passwordError}</span>}
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