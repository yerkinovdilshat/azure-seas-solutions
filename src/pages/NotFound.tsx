// Legacy 404 component - redirecting to Error404
import { Navigate } from 'react-router-dom';

const NotFound = () => {
  return <Navigate to="/404" replace />;
};

export default NotFound;
