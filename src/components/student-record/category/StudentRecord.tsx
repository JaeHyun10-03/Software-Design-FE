// StudentRecord.tsx 파일
import React, { useEffect, useRef, useState } from "react";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";
import Button from "@/components/shared/Button";

export default function StudentRecord() {
  const [photo, setPhoto] = useState<string>("");
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

  // 학생 데이터 로딩 로직
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

        // ⭐ 변경된 부분: photo 상태를 한 번만 초기화하거나, 이미지가 변경되지 않았을 때만 초기화
        // 이렇게 하면 파일 선택으로 인한 photo 상태 변경이 덮어씌워지지 않습니다.
        if (data.image && data.image.trim() !== "") {
          setPhoto(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/images/${data.image}`);
        } else {
          setPhoto("/images/defaultImage.png");
        }
      } catch (err) {
        alert(`학생 정보 가져오기 실패 : ${err}`);
        console.error("학생 정보 가져오기 실패 :", err);
      }
    };
    getStudentData();
  }, [grade, classNumber, studentNumber, studentId]); // 의존성 배열은 유지

  const uneditableFields = ["grade", "class", "number", "gender", "ssn", "admissionDate", "teacher"];

  const renderField = (key: keyof typeof studentData) => {
    const isEditable = !uneditableFields.includes(key);
    const commonClass = "text-base w-full pl-2 outline-none";
    const editableClass = "bg-white";
    const uneditableClass = "bg-gray-100";

    if (isEditMode && isEditable) {
      return (
        <input
          className={`text-base w-full pl-4 outline-none ${editableClass} h-full`}
          value={studentData[key]}
          onChange={(e) => setStudentData({ ...studentData, [key]: e.target.value })}
        />
      );
    } else {
      return (
        <div className={`${isEditMode && !isEditable ? uneditableClass : editableClass} flex items-center h-full w-full pl-2`}>
          <p className={`${commonClass}`}>{studentData[key]}</p>
        </div>
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string); // ⭐ 이 부분이 직접 photo 상태를 업데이트합니다.
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

      const info = {
        name: studentData.name,
        address: studentData.address,
        phone: studentData.phone,
        fatherName: studentData.father,
        motherName: studentData.mother,
        fatherPhone: studentData.fatherContact,
        motherPhone: studentData.motherContact,
      };

      formData.append("info", new Blob([JSON.stringify(info)], { type: "application/json" }));

      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/students/${Number(studentId)}`, formData, {
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
    <div className="p-0 sm:p-8">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row w-full gap-8 justify-start items-start">
          <div className="flex justify-center items-center w-full sm:w-[272px] h-[336px] flex-shrink-0 border border-gray-400 cursor-pointer" onClick={handleImageClick}>
            <img
              src={photo}
              alt="증명사진"
              className="w-[250px] h-[250px] object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/defaultImage.png";
              }}
            />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} data-testid="file-input" />
          </div>

          <div className="flex flex-col sm:flex-row flex-grow w-full gap-4">
            <div className="flex border border-gray-400 w-full sm:min-w-[300px]">
              <div className="flex flex-col w-32 bg-blue-100 border-r border-gray-400">
                {["이름", "학년", "반", "번호", "성별", "주민번호", "주소"].map((label, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400">
                    <p className="text-base text-center text-black m-0 leading-normal">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col flex-grow min-w-[200px]">
                {["name", "grade", "class", "number", "gender", "ssn", "address"].map((key, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400">
                    {renderField(key as keyof typeof studentData)}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex border border-gray-400 w-full sm:min-w-[300px]">
              <div className="flex flex-col w-32 bg-blue-100 border-r border-gray-400">
                {["전화번호", "입학일", "담임선생님", "부", "모", "부 연락처", "모 연락처"].map((label, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400">
                    <p className="text-base text-center text-black leading-normal">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col flex-grow min-w-[200px]">
                {["phone", "admissionDate", "teacher", "father", "mother", "fatherContact", "motherContact"].map((key, idx) => (
                  <div key={idx} className="flex justify-left items-center h-12 border-b border-gray-400">
                    {renderField(key as keyof typeof studentData)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
