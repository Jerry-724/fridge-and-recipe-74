
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect based on auth status
  if (isAuthenticated) {
    return <Navigate to="/inventory" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default Index;
