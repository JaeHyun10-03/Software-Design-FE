import React from "react";
import Cell from "../Cell";

export default function Grade() {
  const dataList = ["과목", "지필/수행", "고사 / 영역명(반영비율)", "만점", "받은 점수", "성취도(수강자수)", "원점수/과목평균(표준편차)", "석차등급", "석차"];

  return (
    <div className="flex flex-row">
      {dataList.map((text, index) => (
        <Cell key={index}>{text}</Cell>
      ))}
    </div>
  );
}
