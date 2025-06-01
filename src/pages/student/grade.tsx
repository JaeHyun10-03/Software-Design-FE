import { StudentHeader } from "@/components/shared/StudentHeader";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import Cell from "@/components/student-record/Cell";
import GradeRadarChart from "@/components/student-record/GradeRadarChart";
import FeedbackModal from "@/components/student/FeedbackModal";
import useStudent from "@/store/student-store";

const GradePage = () => {
  const columnHeaders = ["과목", "지필/수행", "고사 / 영역명(반영비율)", "만점", "받은 점수", "합계", "성취도(수강자수)", "원점수/과목평균(표준편차)", "석차등급", "석차"];

  const [dataList, setDataList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean[]>([]);
  const [cellType, setCellType] = useState<any>("L");
  const { grade, classNumber, studentNumber } = useStudent();

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setCellType(window.innerWidth <= 600 ? "XL" : "L");
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 클린업
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

  return (
    <div className="sm:m-8 m-4">
      <div className="flex flex-row border border-[#a9a9a9]">
        {columnHeaders.map((text, index) => (
          <Cell key={index} type="L">
            {text}
          </Cell>
        ))}
      </div>

      {dataList.map((data, index) => {
        const em = data.evaluationMethods;

        return (
          <div className="flex flex-row border border-[#a9a9a9]" key={index}>
            <Cell type={cellType} onClick={() => openModal(index)}>
              {data.name}
            </Cell>

            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    <p>{e.examType === "PRACTICAL" ? "수행평가" : "지필평가"}</p>
                  </div>
                ))}
              </div>
            </Cell>

            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    {e.title} ({e.weight}%)
                  </div>
                ))}
              </div>
            </Cell>

            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    {e.fullScore}
                  </div>
                ))}
              </div>
            </Cell>

            <Cell type={cellType}>
              <div className="flex flex-col h-full items-center justify-between w-full">
                {em.map((e: any, idx: number) => (
                  <div key={idx} className={`flex my-auto w-full h-full text-center justify-center items-center ${idx !== em.length - 1 ? "border-b border-[#a9a9a9]" : ""}`}>
                    {e.rawScore}
                  </div>
                ))}
              </div>
            </Cell>

            <Cell type={cellType}>{data.합계}</Cell>
            <Cell type={cellType}>{data.성취도}</Cell>
            <Cell type={cellType}>{data.원점수}</Cell>
            <Cell type={cellType}>{data.석차등급}</Cell>
            <Cell type={cellType}>{data.석차}</Cell>

            {modalOpen[index] && <FeedbackModal scoreSummaryId={data.scoreSummaryId} name={data.name} onClose={() => closeModal(index)} />}
          </div>
        );
      })}

      <div className="mt-8 border border-[#a9a9a9] p-4">
        <GradeRadarChart dataList={dataList} />
      </div>
    </div>
  );
};

export default GradePage;

GradePage.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};
