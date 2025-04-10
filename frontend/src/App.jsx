import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Swap from './pages/Swap';
import ProtectedRoute from './context/ProtectedRoute';
import foto from './assets/favicon.png'; 

function App() {
  const AppContent = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState(''); 
    const [avatar, setAvatar] = useState(foto); 

    // profile logic
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:8099/profile', {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        })
          .then(response => {
            if (!response.ok) throw new Error('Failed to fetch profile');
            return response.json();
          })
          .then(data => {
            setLogin(data.login || 'User');
            const avatarUrl = data.avatar_url ? `http://localhost:8099${data.avatar_url}` : foto;
            setAvatar(avatarUrl);
          })
          .catch(error => {
            console.error('Error fetching profile:', error);
            setLogin('User');
            setAvatar(foto);
          });
      }
    }, []);

    const handleLogout = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }

      fetch('http://localhost:8099/logout', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to logout');
          return response.json();
        })
        .then(data => {
          console.log('Logout successful:', data);
          localStorage.removeItem('token');
          setLogin('');
          setAvatar(foto); 
          navigate('/login');
        })
        .catch(error => {
          console.error('Error during logout:', error);
          localStorage.removeItem('token');
          setLogin('');
          setAvatar(foto);
          navigate('/login');
        });
    };
    const updateAvatarUrl = (newAvatarUrl) => {
      setAvatar(newAvatarUrl);
    };

    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile onLogout={handleLogout} login={login} avatar={avatar} updateAvatarUrl={updateAvatarUrl} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/swap"
          element={
            <ProtectedRoute>
              <Swap onLogout={handleLogout} login={login} avatar={avatar} />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  };

  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AppContent />
    </Router>
  );
}

export default App;