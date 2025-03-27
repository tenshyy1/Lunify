import { Navigate } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext'; //авторизация/рега

export default function ProtectedRoute({ children }) {
  //const { isLogin } = useAuth();
  const user = null;

  //if (!isLogin) {
    //return <Navigate to="/login" replace />;
  //}

  return children;
}