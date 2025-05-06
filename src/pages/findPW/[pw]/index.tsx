import { useState } from "react";
import { useRouter, useParams } from 'next/navigation';
const ReturnPw = () => {
  const router = useRouter();
  const { pw } = useParams();



  
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
     
          
          router.push('/student-record');
         
     
  };

  return ( 
    <div className="w-full h-[100vh] flex justify-center items-center" >
      <div className="flex w-full h-auto max-w-[500px] flex-col items-center jsutify-center">
      

        <div className="mt-[64px] font-nanumgothic font-extrabold text-[24px] leading-[24px] flex items-center text-center mb-[128px] text-[#333333]">회원님의 비밀번호는 {pw} 입니다.</div>
        <button className="flex justify-center items-center w-[100%] h-[56px] bg-[#0064FF] rounded-[10px] text-white font-[NanumGothic] font-semibold text-[20px] leading-[23px] mb-[64px]  transition-transform duration-150 ease-in-out active:scale-95 active:bg-[#0052CC]" onClick={handleSubmit}>확인 완료</button>

         
      
      </div>

    </div>
  );
};

export default ReturnPw;