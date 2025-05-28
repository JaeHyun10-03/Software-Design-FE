// __tests__/components/EvalAddForm.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EvalAddForm } from "@/components/grade/EvalAddForm";

describe("<EvalAddForm />", () => {
  const defaultValue = {
    title: "",
    examType: "WRITTEN" as "WRITTEN" | "PRACTICAL",
    weight: null,
    fullScore: null,
  };

  it("입력값이 반영되고, 추가/취소 버튼이 동작한다", () => {
    const handleChange = jest.fn();
    const handleAdd = jest.fn();
    const handleCancel = jest.fn();

    render(
      <EvalAddForm
        value={defaultValue}
        onChange={handleChange}
        onAdd={handleAdd}
        onCancel={handleCancel}
      />
    );

    // 평가명 입력
    const titleInput = screen.getByPlaceholderText("(예: 중간고사)");
    fireEvent.change(titleInput, { target: { value: "기말고사" } });
    expect(handleChange).toHaveBeenCalledWith({ title: "기말고사" });

    // 평가유형 select
    const select = screen.getByDisplayValue("지필");
    fireEvent.change(select, { target: { value: "PRACTICAL" } });
    expect(handleChange).toHaveBeenCalledWith({ examType: "PRACTICAL" });

    // 가중치 입력
    const weightInput = screen.getByPlaceholderText("20");
    fireEvent.change(weightInput, { target: { value: "15" } });
    expect(handleChange).toHaveBeenCalledWith({ weight: 15 });

    // 만점 입력
    const fullScoreInput = screen.getByPlaceholderText("100");
    fireEvent.change(fullScoreInput, { target: { value: "80" } });
    expect(handleChange).toHaveBeenCalledWith({ fullScore: 80 });

    // 추가 버튼 클릭
    const addButton = screen.getByText("추가");
    fireEvent.click(addButton);
    expect(handleAdd).toHaveBeenCalled();

    // 취소 버튼 클릭
    const cancelButton = screen.getByText("취소");
    fireEvent.click(cancelButton);
    expect(handleCancel).toHaveBeenCalled();
  });
});
