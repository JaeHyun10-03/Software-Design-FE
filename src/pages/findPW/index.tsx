import { useState } from "react";
import { useRouter } from 'next/navigation';
import { PostFindPW } from "@/api/postFindPW";

const FindPW = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [identityNumber, setIdentityNumber] = useState<string>("");
  const [school, setSchool] = useState<string>("");



  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPhone(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIdentityNumber(e.target.value);
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSchool(e.target.value);
  };


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (!name || !phone || !identityNumber || !school) {
        alert('정보를 모두 입력해주세요.');
        return;
    }

    try {
      
        const response = await PostFindPW(name, phone, identityNumber, school);
        console.log(` 결과: ${response}`);    
        
        router.push(`/findPW/${response.password}`);
       
    } catch (error) {
        console.error(" 실패", error);
        alert(error);
        //alert('이메일 혹은 비밀번호가 틀립니다. 다시 시도해주세요.');
    }
};

  return ( 
    <div className="w-full h-[100vh] flex justify-center items-center" >
      <div className="flex w-full h-auto max-w-[500px] flex-col items-center jsutify-center border border-[#A9A9A9] rounded-[6px]">
        <p className="mt-[64px] font-nanumgothic font-extrabold text-[24px] leading-[24px] flex items-center text-center mb-[32px] text-[#333333]">비밀번호 찾기</p>
        <div id="inputCont" className="flex flex-col align-start mt-[32px] w-[76%]">
          <div id="name" className="mb-[32px]">
            <p className="mb-[8px] text-[20px] font-semibold leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]" >이름</p>
            <input 
                className="flex w-[100%] h-[56px] border border-[#A9A9A9] rounded-[10px] px-[12px]"
                placeholder="이름을 작성해주세요"
                value={name}
                onChange={handleNameChange}    
            />  
          </div>

          <div id="phone" className="mb-[32px]">
            <p className="mb-[8px] text-[20px] font-semibold leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">휴대폰 번호</p>
            <input 
                className="border w-[100%] h-[56px] border-[#A9A9A9] rounded-[10px] px-[12px]"
                placeholder="휴대폰 번호를 작성해주세요"
                value={phone}
                onChange={handlePhoneChange}            
            />
          </div>

          <div id="identityNumber" className="mb-[32px]">
            <p className="mb-[8px] text-[20px] font-semibold leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">주민번호</p>
            <input 
                className="border w-[100%] h-[56px] border-[#A9A9A9] rounded-[10px] px-[12px]"
                placeholder="주민등록번호를 작성해주세요"
                value={identityNumber}
                onChange={handleNumberChange}            
            />
          </div>

          <div id="school" className="mb-[64px]">
            <p className="mb-[8px] text-[20px] font-semibold leading-[23px] text-center text-[#333333] flex items-center font-[NanumGothic]">학교 분류</p>
            <input 
                className="border w-[100%] h-[56px] border-[#A9A9A9] rounded-[10px] px-[12px]"
                placeholder="중학교 or 고등학교를 선택해주세요"
                value={school}
                onChange={handleSchoolChange}            
            />
          </div>

          <button className="flex justify-center items-center w-[100%] h-[56px] bg-[#0064FF] rounded-[10px] text-white font-[NanumGothic] font-semibold text-[20px] leading-[23px] mb-[64px]  transition-transform duration-150 ease-in-out active:scale-95 active:bg-[#0052CC]" onClick={handleSubmit}>작성 완료</button>

         
        </div>
      </div>

    </div>
  );
};

export default FindPW;