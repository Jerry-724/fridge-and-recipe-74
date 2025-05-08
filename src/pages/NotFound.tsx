
import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">페이지를 찾을 수 없습니다</p>
        <Link to="/inventory" className="text-primary hover:underline">
          냉장고로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
