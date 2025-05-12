
import React from 'react';
import MyPageForm from '../components/MyPageForm';

const MyPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="pb-16 px-4 pt-6 flex-1 overflow-y-auto scrollbar-hide">
        <MyPageForm />
      </div>
    </div>
  );
};

export default MyPage;
