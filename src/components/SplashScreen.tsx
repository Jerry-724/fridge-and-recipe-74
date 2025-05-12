
import React, { useState, useEffect } from 'react';
import { Refrigerator } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState<number>(0);
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationStage(1);
    }, 500);
    
    const timer2 = setTimeout(() => {
      setAnimationStage(2);
    }, 1500);
    
    const timer3 = setTimeout(() => {
      onComplete();
    }, 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <h1 
        className={`text-4xl font-bold text-primary mb-8 transition-all duration-1000 ${
          animationStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        뭐먹을냉?
      </h1>
      <div 
        className={`text-6xl transition-all duration-1000 ${
          animationStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <Refrigerator size={64} className="text-primary" />
      </div>
    </div>
  );
};

export default SplashScreen;
