import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";
import Button from "@/components/shared/Button";

export default function StudentRecord() {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { grade, classNumber, studentNumber, studentId } = useStudentFilterStore();
  const [isEditMode, setIsEditMode] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "",
    grade: "",
    class: "",
    number: "",
    gender: "",
    ssn: "",
    address: "",
    phone: "",
    admissionDate: "",
    teacher: "",
    father: "",
    mother: "",
    fatherContact: "",
    motherContact: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const getStudentData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        setStudentData({
          name: data.name,
          grade: grade,
          class: data.classroom,
          number: data.number,
          gender: data.gender,
          ssn: data.ssn,
          address: data.address,
          phone: data.phone,
          admissionDate: data.admissionDate,
          teacher: data.teacherName,
          father: data.fatherName,
          mother: data.motherName,
          fatherContact: data.fatherNum,
          motherContact: data.motherNum,
        });
      } catch (err) {
        alert(`학생 정보 가져오기 실패 : ${err}`);
        console.error("학생 정보 가져오기 실패 :", err);
      }
    };
    getStudentData();
  }, [grade, classNumber, studentNumber, studentId]);

  const uneditableFields = ["grade", "class", "number", "gender", "ssn", "admissionDate", "teacher"];

  const renderField = (key: keyof typeof studentData) => {
    const isEditable = !uneditableFields.includes(key);
    return isEditMode && isEditable ? (
      <input className="text-base h-full w-full pl-2 bg-white outline-none" value={studentData[key]} onChange={(e) => setStudentData({ ...studentData, [key]: e.target.value })} />
    ) : (
      <p className="text-base text-left text-black">{studentData[key]}</p>
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isEditMode) {
      fileInputRef.current?.click();
    }
  };

  const putStudentData = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();

      // 백엔드가 기대하는 필드명으로 정확히 매핑
      const info = {
        name: studentData.name,
        address: studentData.address,
        phone: studentData.phone,
        fatherName: studentData.father,
        motherName: studentData.mother,
        fatherPhone: studentData.fatherContact, // fatherNum이 아닌 fatherPhone으로 변경
        motherPhone: studentData.motherContact, // motherNum이 아닌 motherPhone으로 변경
      };

      // 디버깅 정보
      console.log("전송할 학생 정보:", info);

      // JSON 문자열로 변환하여 FormData에 추가
      formData.append("info", new Blob([JSON.stringify(info)], { type: "application/json" }));

      // 이미지 파일이 있는 경우에만 추가
      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      // 요청 전 FormData 내용 확인 (디버깅용)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/student/${Number(studentId)}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API 응답:", res.data);
      alert("학생 정보가 성공적으로 저장되었습니다.");
      setIsEditMode(false);
    } catch (err: any) {
      console.error("학생 정보 저장 실패:", err.response?.data || err.message);
      alert(`학생 정보 저장에 실패했습니다: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col">
        <div className="flex flex-wrap w-full gap-8 justify-start items-start">
          {/* 증명 사진 */}
          <div className="flex justify-center items-center w-[272px] h-[336px] flex-shrink-0 border border-gray-400 cursor-pointer" onClick={handleImageClick}>
            {photo ? <Image src={photo} alt="증명사진" width={250} height={250} className="object-cover" /> : <p className="text-base text-center text-gray-800">증명 사진</p>}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />
          </div>

          {/* 표 컨테이너 */}
          <div className="flex flex-grow min-w-0">
            {/* 왼쪽 테이블 */}
            <div className="flex border border-gray-400 flex-grow min-w-[300px]">
              <div className="flex flex-col w-32 bg-blue-100 border-r border-gray-400">
                {["이름", "학년", "반", "번호", "성별", "주민번호", "주소"].map((label, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400">
                    <p className="text-base text-center text-black">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col flex-grow min-w-[200px]">
                {["name", "grade", "class", "number", "gender", "ssn", "address"].map((key, idx) => (
                  <div key={idx} className="flex justify-left items-center h-12 border-b border-gray-400 pl-2">
                    {renderField(key as keyof typeof studentData)}
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 테이블 */}
            <div className="flex border border-gray-400 flex-grow min-w-[300px]">
              <div className="flex flex-col w-32 bg-blue-100 border-r border-gray-400">
                {["전화번호", "입학일", "담임선생님", "부", "모", "부 연락처", "모 연락처"].map((label, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400">
                    <p className="text-base text-center text-black">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col flex-grow min-w-[200px]">
                {["phone", "admissionDate", "teacher", "father", "mother", "fatherContact", "motherContact"].map((key, idx) => (
                  <div key={idx} className="flex justify-left items-center h-12 border-b border-gray-400 pl-2">
                    {renderField(key as keyof typeof studentData)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end mt-16 gap-4">
          {isEditMode ? (
            <>
              <Button className="w-16 h-10" onClick={putStudentData}>
                저장
              </Button>
              <Button className="w-16 h-10 bg-gray-400" onClick={() => setIsEditMode(false)}>
                취소
              </Button>
            </>
          ) : (
            <Button className="w-16 h-10" onClick={() => setIsEditMode(true)}>
              수정
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
