import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import SplashScreen from '../components/SplashScreen';

const AuthPage: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/item/${user.user_id}`);
    }
  }, [isAuthenticated, user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="w-full animate-fade-in">
          {isSignup ? (
            <SignupForm onToggleLogin={() => setIsSignup(false)} />
          ) : (
            <LoginForm onToggleSignup={() => setIsSignup(true)} />
          )}
        </div>
      )}
    </div>
  );
};

export default AuthPage;