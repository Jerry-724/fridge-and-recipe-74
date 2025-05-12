
import React from 'react';
import RecipeChatbot from '../components/RecipeChatbot';

const RecipePage: React.FC = () => {
  return (
    <div className="h-screen pb-16 bg-[#FFFCF5]"> {/* Ivory background color */}
      <RecipeChatbot />
    </div>
  );
};

export default RecipePage;
