// __tests__/components/AddSubjectForm.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddSubjectForm } from "@/components/grade/AddSubjectForm";

describe("<AddSubjectForm />", () => {
  it("입력값이 반영되고, 추가/취소 버튼이 동작한다", () => {
    const handleChange = jest.fn();
    const handleAdd = jest.fn();
    const handleCancel = jest.fn();

    render(
      <AddSubjectForm
        value="새과목"
        onChange={handleChange}
        onAdd={handleAdd}
        onCancel={handleCancel}
      />
    );

    // 입력값 반영
    const input = screen.getByPlaceholderText("새 과목명 입력");
    expect(input).toHaveValue("새과목");
    fireEvent.change(input, { target: { value: "과목2" } });
    expect(handleChange).toHaveBeenCalledWith("과목2");

    // 추가 버튼 동작
    const addButton = screen.getByText("추가");
    fireEvent.click(addButton);
    expect(handleAdd).toHaveBeenCalled();

    // 취소 버튼 동작
    const cancelButton = screen.getByText("취소");
    fireEvent.click(cancelButton);
    expect(handleCancel).toHaveBeenCalled();

    // Enter 키로 추가, ESC로 취소
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleAdd).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(input, { key: "Escape" });
    expect(handleCancel).toHaveBeenCalledTimes(2);
  });
});
