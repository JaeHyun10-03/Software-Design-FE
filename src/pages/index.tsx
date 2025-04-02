import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { url } from "inspector";

const Login = () => {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // 여기에 유효성 검사 로직 들어가야함

    // 여기에 api 요청 들어가야함

    setIsLoading(false);
  };

  return (
    <div >
      <div className="flex w-full h-full flex-col items-center jsutify-start">
        <Image className="mt-[3%]" src={"/assets/images/logo.svg"} alt="logo" width={380} height={190}></Image>
        <div id="inputCont" className="flex flex-col align-start mt-[32px]">
          <div id="id" className="mb-[32px]">
            <p className="mb-[8px] text-[20px] leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]" >아이디</p>
            <input className="flex w-[380px] h-[56px] border border-[#A9A9A9] rounded-[10px]"></input>
          </div>
          <div id="password" className="  mb-[64px]">
            <p className="mb-[8px] text-[20px] leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">비밀번호</p>
            <input type="password" className="border w-[380px] h-[56px] border-[#A9A9A9] rounded-[10px] px-[3px]"></input>
          </div>

          <button className="flex justify-center items-center w-[380px] h-[56px] bg-[#0064FF] rounded-[10px] text-white font-[NanumGothic] font-semibold text-[20px] leading-[23px] mb-[32px] ">로그인하기</button>

          <div id="findCont" className="flex flex-row w-[380px] justify-around font-[NanumGothic] text-[#A9A9A9] font-normal text-[20px] leading-[23px]">
            <div>아이디 찾기</div>
            |
            <div>비밀번호 찾기</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
