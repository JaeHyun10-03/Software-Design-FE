import React, { useEffect, useState } from "react";
import axios from "axios";
import { StudentHeader } from "@/components/shared/StudentHeader";
import { ReactNode } from "react";
import useStudent from "@/store/student-store";

const StudentRecord = () => {
  const { grade, classNumber, studentNumber, studentId } = useStudent();
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
  const [photo, setPhoto] = useState<string | null>(null);

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
        setPhoto(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/images/${data.image}`);
      } catch (err) {
        alert(`학생 정보 가져오기 실패 : ${err}`);
        console.error("학생 정보 가져오기 실패 :", err);
      }
    };
    getStudentData();
  }, [grade, classNumber, studentNumber, studentId]);

  return (
    <div className="m-4 sm:m-8">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row w-full gap-8 justify-start items-start">
          {/* 증명 사진 */}
          <div className="flex justify-center items-center w-full sm:w-[272px] h-[336px] flex-shrink-0 border border-gray-400 cursor-default">
            {photo ? <img src={photo} alt="증명사진" className="w-[250px] h-[250px] object-cover" /> : <p className="text-base text-center text-gray-800">증명 사진</p>}
          </div>

          {/* 표 컨테이너 */}
          <div className="flex flex-col sm:flex-row flex-grow w-full gap-4">
            {/* 왼쪽 테이블 */}
            <div className="flex border border-gray-400 w-full sm:min-w-[300px]">
              <div className="flex flex-col w-32 bg-blue-100 border-r border-gray-400">
                {["이름", "학년", "반", "번호", "성별", "주민번호", "주소"].map((label, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400">
                    <p className="text-base text-center text-black m-0 leading-normal">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col flex-grow min-w-[200px]">
                {[studentData.name, studentData.grade, studentData.class, studentData.number, studentData.gender, studentData.ssn, studentData.address].map((value, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400 px-2">
                    <p className="text-base w-full">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 테이블 */}
            <div className="flex border border-gray-400 w-full sm:min-w-[300px]">
              <div className="flex flex-col w-32 bg-blue-100 border-r border-gray-400">
                {["전화번호", "입학일", "담임선생님", "부", "모", "부 연락처", "모 연락처"].map((label, idx) => (
                  <div key={idx} className="flex justify-center items-center h-12 border-b border-gray-400">
                    <p className="text-base text-center text-black leading-normal">{label}</p>
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
                  <div key={idx} className="flex justify-left items-center h-12 border-b border-gray-400 px-2">
                    <p className="text-base w-full">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StudentRecord.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};

export default StudentRecord;
