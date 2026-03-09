import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // Kung naka-login na ang user, bawal na siya sa Login page.
    // I-redirect siya sa kanyang dashboard base sa role niya.
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default PublicRoute;