
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Refrigerator, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-10">
      <Link
        to="/recipe"
        className={`flex flex-col items-center w-1/3 ${
          isActive('/recipe') ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <FileText size={24} />
        <span className="text-xs font-bold mt-1">레시피 추천</span>
      </Link>
      
      <Link
        to="/inventory"
        className={`flex flex-col items-center w-1/3 ${
          isActive('/inventory') ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <Refrigerator size={24} />
        <span className="text-xs font-bold mt-1">내 냉장고</span>
      </Link>
      
      <Link
        to="/mypage"
        className={`flex flex-col items-center w-1/3 ${
          isActive('/mypage') ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <User size={24} />
        <span className="text-xs font-bold mt-1">마이페이지</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
