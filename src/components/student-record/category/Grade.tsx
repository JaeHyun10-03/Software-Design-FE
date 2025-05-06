import React, { useEffect, useState } from "react";
import Cell from "../Cell";
import GradeRadarChart from "../GradeRadarChart";
import Modal from "../Modal";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";

export default function Grade() {
  const columnHeaders = ["과목", "지필/수행", "고사 / 영역명(반영비율)", "만점", "받은 점수", "합계", "성취도(수강자수)", "원점수/과목평균(표준편차)", "석차등급", "석차"];
  const [dataList, setDataList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean[]>([]);
  const { grade, classNumber, studentNumber } = useStudentFilterStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getScoreSummary = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/score-summary?year=2025&semester=1&grade=${grade}&classNum=${classNumber}&number=${studentNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.response.subjects;
        // console.log("학적-성적데이터:", data);

        const examTypeMap: Record<string, string> = {
          PRACTICAL: "수행평가",
          WRITTEN: "지필평가",
        };

        const mapped = data.map((subject: any) => {
          const evalNames = subject.evaluationMethods?.map((m: any) => `${m.title}(${m.weight}%)`).join(" / ");

          const examTypes = subject.evaluationMethods?.map((m: any) => examTypeMap[m.examType] || m.examType).join(" / ");

          return {
            name: subject.subjectName,
            지필수행: examTypes || "-",
            고사영역명: evalNames || "-",
            만점: 100,
            합계: subject.rawTotal,
            받은점수: subject.weightedTotal,
            성취도: `${subject.achievementLevel} (${subject.totalStudentCount}명)`,
            원점수: `${subject.rawTotal} / ${subject.average} (${subject.stdDev})`,
            석차등급: `${subject.grade}등급`,
            석차: `${subject.rank}등`,
            피드백: subject.feedback || "",
          };
        });

        setDataList(mapped);
        setModalOpen(new Array(mapped.length).fill(false));
      } catch (err) {
        console.error("학생 성적 학적 조회 API 에러 : ", err);
      }
    };
    getScoreSummary();
  }, [grade, classNumber, studentNumber]);

  const openModal = (index: number) => {
    const updated = [...modalOpen];
    updated[index] = true;
    setModalOpen(updated);
  };

  const closeModal = (index: number) => {
    const updated = [...modalOpen];
    updated[index] = false;
    setModalOpen(updated);
  };

  return (
    <>
      <div className="flex flex-row">
        {columnHeaders.map((text, index) => (
          <Cell key={index}>{text}</Cell>
        ))}
      </div>

      {dataList.map((data, index) => (
        <div className="flex flex-row" key={index}>
          <Cell onClick={() => openModal(index)}>{data.name}</Cell>
          <Cell>{data.지필수행}</Cell>
          <Cell>{data.고사영역명}</Cell>
          <Cell>{data.만점}</Cell>
          <Cell>{data.받은점수}</Cell>
          <Cell>{data.합계}</Cell>
          <Cell>{data.성취도}</Cell>
          <Cell>{data.원점수}</Cell>
          <Cell>{data.석차등급}</Cell>
          <Cell>{data.석차}</Cell>

          {modalOpen[index] && <Modal name={data.name} onClose={() => closeModal(index)} />}
        </div>
      ))}
      {/* 전체 과목차트 */}
      <GradeRadarChart dataList={dataList} />
    </>
  );
}
