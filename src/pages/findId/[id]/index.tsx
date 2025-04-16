import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { url } from "inspector";
import { useRouter, useParams } from 'next/navigation';
import { PostFindId } from "@/api/postFindId";

const ReturnId = () => {
  const router = useRouter();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);


  
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
     
          
          router.push('/student-record');
         
     
  };

  return ( 
    <div className="w-full h-[100vh] flex justify-center items-center" >
      <div className="flex w-full h-auto max-w-[500px] flex-col items-center jsutify-center ">
      

        <div className="mt-[64px] font-nanumgothic font-extrabold text-[24px] leading-[24px] flex items-center text-center mb-[128px] text-[#333333]">회원님의 아이디는 {id} 입니다.</div>
        <button className="flex justify-center items-center w-[100%] h-[56px] bg-[#0064FF] rounded-[10px] text-white font-[NanumGothic] font-semibold text-[20px] leading-[23px] mb-[64px]  transition-transform duration-150 ease-in-out active:scale-95 active:bg-[#0052CC]" onClick={handleSubmit}>확인 완료</button>

         
      
      </div>

    </div>
  );
};

export default ReturnId;