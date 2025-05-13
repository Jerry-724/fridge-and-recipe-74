import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MyPageForm from "../components/MyPageForm";

const Mypage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>(); // URL 파라미터에서 user_id 가져오기
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user_id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/${user_id}/mypage`);
          setUserData(response.data); // 응답 데이터를 상태에 저장
        } catch (error) {
          console.error("User data fetch failed", error);
        }
      };

      fetchUserData();
    }
  }, [user_id]); // user_id가 변경될 때마다 데이터 다시 로드

  if (!userData) {
    return <div>Loading...</div>; // 데이터가 없을 경우 로딩 표시
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 여기서 userData를 사용해 페이지 내용 표시 */}
      <MyPageForm />
    </div>
  );
};

export default Mypage;
