import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PostLogin } from "@/api/postLogin";

const Login = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserId(e.target.value);
  };

  const handlePWChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
  e.preventDefault();
  if (!userId || !password) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  try {
    const response = await PostLogin(userId, password);
    const data = response;

    const { accessToken, role } = data;

    localStorage.setItem("accessToken", accessToken);

    if (role === "TEACHER") {
      router.push("/student-record");
    } else if (role === "STUDENT") {
      router.push("/student/student-record");
    } else {
      alert("알 수 없는 사용자 역할입니다.");
      console.warn("예상치 못한 role 값:", role);
    }
  } catch (error) {
    console.error("로그인 실패", error);
    alert("이메일 혹은 비밀번호가 틀립니다. 다시 시도해주세요.");
  }
};


  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="flex w-full h-auto max-w-[500px] flex-col items-center jsutify-center">
        <Image className="flex" src={"/assets/images/logo.png"} alt="logo" width={300} height={190}></Image>
        <div id="inputCont" className="flex flex-col align-start mt-[32px] w-[76%]">
          <div id="id" className="mb-[32px]">
            <p className="mb-[8px] text-[20px] leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">아이디</p>
            <input
              className="flex w-[100%] h-[56px] border border-[#A9A9A9] rounded-[10px] px-[12px]"
              placeholder="아이디 입력"
              value={userId}
              onChange={handleUserIdChange}
            />
          </div>

          <div id="password" className="mb-[64px]">
            <p className="mb-[8px] text-[20px] leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">비밀번호</p>
            <input
              type="password"
              className="border w-[100%] h-[56px] border-[#A9A9A9] rounded-[10px] px-[12px]"
              placeholder="비밀번호 입력"
              value={password}
              onChange={handlePWChange}
            />
          </div>

          <button
            className="flex justify-center items-center w-[100%] h-[56px] bg-[#0064FF] rounded-[10px] text-white font-[NanumGothic] font-semibold text-[20px] leading-[23px] mb-[32px] transition-transform duration-150 ease-in-out active:scale-95 active:bg-[#0052CC]"
            onClick={handleLogin}
          >
            로그인하기
          </button>

          <div id="findCont" className="flex flex-row w-[100%] justify-around font-[NanumGothic] text-[#A9A9A9] font-normal text-[20px] leading-[23px]">
            <div onClick={() => router.push("/findId")}>아이디 찾기</div>|
            <div onClick={() => router.push("/findPW")}>비밀번호 찾기</div>|
            <div onClick={() => router.push("/changePW")}>비밀번호 변경</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
