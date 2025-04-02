import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Swap from './pages/Swap';
import ProtectedRoute from '../src/context/ProtectedRoute'; 

function App() {
  const AppContent = () => {
    const navigate = useNavigate();

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
          navigate('/login');
        })
        .catch(error => {
          console.error('Error during logout:', error);
          localStorage.removeItem('token');
          navigate('/login');
        });
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
              <Profile onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/swap" 
          element={
            <ProtectedRoute>
              <Swap onLogout={handleLogout} />
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