import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const authenticatedUser = JSON.parse(localStorage.getItem('loggedInUser')); 

  return authenticatedUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;