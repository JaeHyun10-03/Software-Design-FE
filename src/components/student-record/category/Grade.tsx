import React, { useEffect, useState } from "react";
import Cell from "../Cell";
import GradeRadarChart from "../Chart";
import Modal from "../Modal";

export default function Grade() {
  const columnHeaders = ["과목", "지필/수행", "고사 / 영역명(반영비율)", "만점", "합계", "받은 점수", "성취도(수강자수)", "원점수/과목평균(표준편차)", "석차등급", "석차"];
  const dataList = [
    { name: "국어", 지필수행: 999, 고사영역명: 999, 만점: 999, 받은점수: 999, 합계: 999, 성취도: 999, 원점수: 999, 석차등급: 999, 석차: 999, 피드백: "" },
    { name: "수학", 지필수행: 999, 고사영역명: 999, 만점: 999, 받은점수: 999, 합계: 999, 성취도: 999, 원점수: 999, 석차등급: 999, 석차: 999, 피드백: "" },
    { name: "영어", 지필수행: 999, 고사영역명: 999, 만점: 999, 받은점수: 999, 합계: 999, 성취도: 999, 원점수: 999, 석차등급: 999, 석차: 999, 피드백: "" },
    { name: "사회", 지필수행: 999, 고사영역명: 999, 만점: 999, 받은점수: 999, 합계: 999, 성취도: 999, 원점수: 999, 석차등급: 999, 석차: 999, 피드백: "" },
    { name: "과학", 지필수행: 999, 고사영역명: 999, 만점: 999, 받은점수: 999, 합계: 999, 성취도: 999, 원점수: 999, 석차등급: 999, 석차: 999, 피드백: "" },
    { name: "기술가정", 지필수행: 999, 고사영역명: 999, 만점: 999, 받은점수: 999, 합계: 999, 성취도: 999, 원점수: 999, 석차등급: 999, 석차: 999, 피드백: "" },
  ];
  const [modalOpen, setModalOpen] = useState<boolean[]>([]);

  useEffect(() => {
    const arr = new Array(dataList.length).fill(false);
    setModalOpen(arr);
  }, []);

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

          {modalOpen[index] && <Modal name={data.name} feedback={data.피드백} onClose={() => closeModal(index)}></Modal>}
        </div>
      ))}

      <GradeRadarChart />
    </>
  );
}
