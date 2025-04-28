import React, { useEffect, useState } from "react";
import Image from "next/image";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";

export default function StudentRecord() {
  const [photo, setPhoto] = useState(false);
  const { grade, classNumber, studentNumber } = useStudentFilterStore();
  const [studentData, setStudentData] = useState({
    name: "",
    grade: "",
    class: "",
    number: "",
    gender: "",
    idNumber: "",
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students/${studentNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        // console.log("리스폰스 : ", data);
        setStudentData({
          name: "잠시만",
          grade: grade,
          class: data.classroom,
          number: data.number,
          gender: data.gender,
          idNumber: data.id,
          address: data.address,
          phone: data.phone,
          admissionDate: data.admissionData,
          teacher: "잠시만",
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
  }, [grade, classNumber, studentNumber]);

  return (
    <div className="p-8">
      <div className="flex flex-wrap w-full gap-8 justify-start items-start">
        {/* 증명 사진 */}
        {photo ? (
          <div className="flex justify-center items-center w-[272px] h-[336px] flex-shrink-0 border border-gray-400">
            <Image src="/images/defaultImage.png" alt="증명사진" width={200} height={200} />
          </div>
        ) : (
          <div className="flex justify-center items-center w-[272px] h-[336px] flex-shrink-0 border border-gray-400">
            <p className="text-base text-center text-gray-800">증명 사진</p>
          </div>
        )}

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
              {[studentData.name, studentData.grade, studentData.class, studentData.number, studentData.gender, studentData.idNumber, studentData.address].map((value, idx) => (
                <div key={idx} className="flex justify-left items-center h-12 border-b border-gray-400 pl-2">
                  <p className="text-base text-left text-black">{value}</p>
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
              {[
                studentData.phone,
                studentData.admissionDate,
                studentData.teacher,
                studentData.father,
                studentData.mother,
                studentData.fatherContact,
                studentData.motherContact,
              ].map((value, idx) => (
                <div key={idx} className="flex justify-left items-center h-12 border-b border-gray-400 pl-2">
                  <p className="text-base text-left text-black">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
