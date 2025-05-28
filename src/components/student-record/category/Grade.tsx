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

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getScoreSummary = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/score-summary?year=2025&semester=1&grade=${grade}&classNum=${classNumber}&number=${studentNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.response.subjects;

        const mapped = data.map((subject: any) => ({
          name: subject.subjectName,
          evaluationMethods: subject.evaluationMethods || [],
          합계: subject.rawTotal,
          받은점수: subject.weightedTotal,
          성취도: `${subject.achievementLevel} (${subject.totalStudentCount}명)`,
          원점수: `${subject.rawTotal} / ${subject.average} (${subject.stdDev})`,
          석차등급: `${subject.grade}등급`,
          석차: `${subject.rank}등`,
          피드백: subject.feedback || "",
          scoreSummaryId: subject.scoreSummaryId,
        }));

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

  const cellType = isSmallScreen ? "XL" : "L";

  return (
    <>
      {/* 테이블 헤더 */}
      <div className="flex flex-row border border-[#a9a9a9]">
        {columnHeaders.map((text, index) => (
          <Cell key={index} type="L">
            {text}
          </Cell>
        ))}
      </div>

      {/* 데이터 렌더링 */}
      {dataList.map((data, index) => {
        const em = data.evaluationMethods;

        return (
          <div className="flex flex-row border border-[#a9a9a9]" key={index}>
            {/* 과목 */}
            <Cell type={cellType} onClick={() => openModal(index)}>
              {data.name}
            </Cell>

            {/* 지필/수행 */}
            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    <p>{e.examType === "PRACTICAL" ? "수행평가" : "지필평가"}</p>
                  </div>
                ))}
              </div>
            </Cell>

            {/* 고사 / 영역명 */}
            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    {e.title} ({e.weight}%)
                  </div>
                ))}
              </div>
            </Cell>

            {/* 만점 */}
            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    {e.fullScore}
                  </div>
                ))}
              </div>
            </Cell>

            {/* 받은 점수 */}
            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    {e.rawScore}
                  </div>
                ))}
              </div>
            </Cell>

            {/* 나머지 */}
            <Cell type={cellType}>{data.합계}</Cell>
            <Cell type={cellType}>{data.성취도}</Cell>
            <Cell type={cellType}>{data.원점수}</Cell>
            <Cell type={cellType}>{data.석차등급}</Cell>
            <Cell type={cellType}>{data.석차}</Cell>

            {modalOpen[index] && <Modal scoreSummaryId={data.scoreSummaryId} name={data.name} onClose={() => closeModal(index)} />}
          </div>
        );
      })}

      {/* 전체 과목 차트 */}
      <div className="mt-8 border border-[#a9a9a9] p-4">
        <GradeRadarChart dataList={dataList} />
      </div>
    </>
  );
}
