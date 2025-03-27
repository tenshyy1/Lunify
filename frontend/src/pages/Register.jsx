import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/register.css';
import favicon from '../assets/favicon.png';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerLoginError, setRegisterLoginError] = useState('');
  const [registerPasswordError, setRegisterPasswordError] = useState('');
  const [registerConfirmPasswordError, setRegisterConfirmPasswordError] = useState('');

  useEffect(() => {
    document.title = 'Lunify - Register';

    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = favicon;
    link.type = 'image/png';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const toggleRegisterPasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRegisterConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validateRegisterLogin = (value) => {
    setRegisterLoginError(value.length < 3 ? 'Login must be at least 3 characters' : '');
  };

  const validatePasswordsMatch = (newPassword, newConfirmPassword) => {
    if (newPassword && newConfirmPassword && newPassword !== newConfirmPassword) {
      setRegisterPasswordError('Passwords do not match');
      setRegisterConfirmPasswordError('Passwords do not match');
    } else {
      setRegisterPasswordError(newPassword.length < 3 ? 'Password must be at least 3 characters' : '');
      setRegisterConfirmPasswordError(newConfirmPassword.length < 3 ? 'Password must be at least 3 characters' : '');
    }
  };

  const handleRegisterLoginChange = (e) => {
    const value = e.target.value;
    setLogin(value);
    validateRegisterLogin(value);
  };

  const handleRegisterPasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePasswordsMatch(value, confirmPassword);
  };

  const handleRegisterConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePasswordsMatch(password, value);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (
      login.length >= 3 &&
      password.length >= 3 &&
      confirmPassword === password &&
      !registerLoginError &&
      !registerPasswordError &&
      !registerConfirmPasswordError
    ) {
      console.log('Форма регистрации отправлена');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="logo">LUNIFY<span>.</span></div>
        <div className="welcome-text">
          <h1>Welcome.</h1>
          <p>Start your journey now with our crypto simulator</p>
        </div>
      </div>
      <div className="register-right">
        <div className="register-form-box">
          <h2>Create an account</h2>
          <form onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <input
                type="text"
                id="register-login"
                value={login}
                onChange={handleRegisterLoginChange}
                maxLength={15}
                required
              />
              <label htmlFor="register-login">Login</label>
              {registerLoginError && <span className="error-message">{registerLoginError}</span>}
            </div>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                value={password}
                onChange={handleRegisterPasswordChange}
                maxLength={20}
                required
              />
              <label htmlFor="register-password">Password</label>
              <button
                type="button"
                className="register-password-toggle"
                onClick={toggleRegisterPasswordVisibility}
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
              {registerPasswordError && <span className="error-message">{registerPasswordError}</span>}
            </div>
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="register-confirm-password"
                value={confirmPassword}
                onChange={handleRegisterConfirmPasswordChange}
                maxLength={20}
                required
              />
              <label htmlFor="register-confirm-password">Confirm Password</label>
              <button
                type="button"
                className="register-password-toggle"
                onClick={toggleRegisterConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
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
              {registerConfirmPasswordError && <span className="error-message">{registerConfirmPasswordError}</span>}
            </div>
            <button type="submit" className="register-submit-button">
              Create account
            </button>
          </form>
          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;