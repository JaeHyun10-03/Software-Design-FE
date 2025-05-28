import { useState, } from "react";
import { useRouter } from 'next/navigation';
import { PutPassword } from "@/api/putPassword";

const ChangePw = () => {
  const router = useRouter();

  const [id, setId] = useState<string>("");
  const [oldPw, setOldPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setId(e.target.value);
  };

  const handleOldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOldPw(e.target.value);
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewPw(e.target.value);
  };

  function isValidPassword(pw: string): boolean {
    // 8자 이상
    if (pw.length < 8) return false;
    // 영문 대문자, 소문자 포함
    if (!/[A-Z]/.test(pw)) return false;
    if (!/[a-z]/.test(pw)) return false;
    // 숫자 또는 특수문자 중 최소 하나 포함
    if (!(/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw))) return false;
    return true;
  }
  

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (!id || !newPw || !oldPw) {
        alert('정보를 모두 입력해주세요.');
        return;
    }

    if (!isValidPassword(newPw)) {
        alert(
          "비밀번호는 8자 이상, 영문 대/소문자 포함, 숫자 또는 특수문자 중 최소 1개를 포함해야 합니다."
        );
        return;
      }

    try {
      
        const response = await PutPassword(id, oldPw, newPw);
        console.log(`로그인 결과: ${response}`);
        alert("비밀번호를 변경하였습니다")

       
        router.push(`/`);
       
    } catch (error) {
        console.error("비밀번호 변경 실패", error);
        alert(error);
        //alert('이메일 혹은 비밀번호가 틀립니다. 다시 시도해주세요.');
    }
};

  return ( 
    <div className="w-full h-[100vh] flex justify-center items-center" >
      <div className="flex w-full h-auto max-w-[500px] flex-col items-center jsutify-center border border-[#A9A9A9] rounded-[6px]">
        <p className="mt-[64px] font-nanumgothic font-extrabold text-[24px] leading-[24px] flex items-center text-center mb-[32px] text-[#333333]">비밀번호 변경</p>
        <div id="inputCont" className="flex flex-col align-start mt-[32px] w-[76%]">
          <div id="name" className="mb-[32px]">
            <p className="mb-[8px] text-[20px] font-semibold leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]" >아이디</p>
            <input 
                className="flex w-[100%] h-[56px] border border-[#A9A9A9] rounded-[10px] px-[12px]"
                placeholder="아이디를 입력해주세요"
                value={id}
                onChange={handleIdChange}    
            />  
          </div>

          <div id="phone" className="mb-[32px]">
            <p className="mb-[8px] text-[20px] font-semibold leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">기존 비밀번호</p>
            <input 
                className="border w-[100%] h-[56px] border-[#A9A9A9] rounded-[10px] px-[12px]"
                placeholder="기존 비밀번호를 입력해주세요"
                value={oldPw}
                type="password"
                onChange={handleOldChange}            
            />
          </div>

          <div id="school" className="mb-[64px]">
            <p className="mb-[8px] text-[20px] font-semibold leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">새 비밀번호</p>
            <input 
                className="border w-[100%] h-[56px] border-[#A9A9A9] rounded-[10px] px-[12px]"
                placeholder="새로운 비밀번호를 입력해주세요"
                type="password"
                value={newPw}
                onChange={handleNewChange}            
            />
          </div>

          <button className="flex justify-center items-center w-[100%] h-[56px] bg-[#0064FF] rounded-[10px] text-white font-[NanumGothic] font-semibold text-[20px] leading-[23px] mb-[64px]  transition-transform duration-150 ease-in-out active:scale-95 active:bg-[#0052CC]" onClick={handleSubmit}>작성 완료</button>

         
        </div>
      </div>

    </div>
  );
};

export default ChangePw;