
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Refrigerator, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
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
        <FileText size={22} />
        <span className="text-xs mt-1 font-bold">레시피 추천</span>
      </Link>
      
      <Link
        to={`/item/${user.user_id}`}
        className={`flex flex-col items-center w-1/3 ${
          isActive(`/item/${user.user_id}`) ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <Refrigerator size={22} />
        <span className="text-xs mt-1 font-bold">내 냉장고</span>
      </Link>
      
      <Link
        to={`/mypage/${user.user_id}`}
        className={`flex flex-col items-center w-1/3 ${
            isActive(`/mypage/${user.user_id}`) ? 'text-primary' : 'text-gray-500'
        }`}
      >
        <User size={22} />
        <span className="text-xs mt-1 font-bold">마이페이지</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
