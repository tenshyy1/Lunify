import React, { useEffect, useState } from 'react';
import { loginUser } from "../services/authService";
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import '../styles/login.css';
import favicon from '../assets/favicon.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

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
    if (loginError && loginError !== 'Login must be at least 3 characters') {
      setLoginError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    if (passwordError && passwordError !== 'Password must be at least 3 characters') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoggedIn || isLoading || login.length < 3 || password.length < 3 || loginError || passwordError) {
      return; 
    }

    setIsLoading(true);
    try {
      const result = await loginUser(login, password);
      if (result && result.token) {
        console.log("Successful login:", result);
        localStorage.setItem('token', result.token);
        setIsLoggedIn(true); 
        toast.success('Login successful! Welcome back!', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #00ffcc',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 24px rgba(0, 255, 204, 0.2)',
          },
          iconTheme: {
            primary: '#00ffcc',
            secondary: '#fff',
          },
        });
        setTimeout(() => navigate('/profile'), 2000); 
      } else {
        throw new Error(result?.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #ff4d4d',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(255, 77, 77, 0.2)',
        },
        iconTheme: {
          primary: '#ff4d4d',
          secondary: '#fff',
        },
      });
      if (errorMessage === 'Invalid login') {
        setLoginError('Invalid login');
      } else if (errorMessage === 'Invalid password') {
        setPasswordError('Invalid password');
      } else {
        setLoginError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Toaster />
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
          <button
            type="submit"
            className="login-button"
            disabled={isLoading || isLoggedIn || login.length < 3 || password.length < 3} // Добавляем isLoggedIn в disabled
          >
            {isLoading ? 'Logging in...' : 'Login now'}
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