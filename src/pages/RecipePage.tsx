
import React from 'react';
import RecipeChatbot from '../components/RecipeChatbot';

const RecipePage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-64px)] bg-[#FFFFF8] flex flex-col">
      <RecipeChatbot />
    </div>
  );
};

export default RecipePage;
