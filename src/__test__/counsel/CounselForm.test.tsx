// __tests__/components/CounselForm.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CounselForm } from "@/components/counsel/CounselForm";
import { COUNSEL_TYPES, categoryMap } from "@/utils/categoryMap";
import { TeacherInfo } from "@/types/counsel"; // TeacherInfo 타입 import

describe("<CounselForm />", () => {
  // TeacherInfo 타입에 맞게 모든 필드 포함
  const teacher: TeacherInfo = {
    name: "김교사",
    teacherId: 1234,
    phone: "010-1234-5678",
    email: "teacher@example.com",
  };
  const selectedDate = "2025-05-27T10:00:00";
  const defaultForm = {
    dateTime: selectedDate,
    category: "",
    teacher: teacher.name,
    content: "",
    isPublic: true,
    nextPlan: "",
  };

  function setup(props = {}) {
    let formState = { ...defaultForm };
    const setForm = jest.fn((fn) => {
      if (typeof fn === "function") {
        formState = fn(formState);
      } else {
        formState = fn;
      }
    });
    const handleChange = jest.fn();
    const handleAdd = jest.fn((e) => e.preventDefault());
    const handleEdit = jest.fn((e) => e.preventDefault());
    const setSendAsPrivate = jest.fn();
    const sendAsPrivate = false;

    render(
      <CounselForm
        form={formState}
        setForm={setForm}
        teacher={teacher} // ✅ 모든 필드 포함 객체 전달
        sendAsPrivate={sendAsPrivate}
        setSendAsPrivate={setSendAsPrivate}
        handleChange={handleChange}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        selectedCounselId={null}
        selectedDate={selectedDate}
        {...props}
      />
    );
    return {
      setForm,
      handleChange,
      handleAdd,
      handleEdit,
      setSendAsPrivate,
    };
  }

  it("상담 날짜, 담당 교사, 상담 종류, 상담 내용, 다음 상담 일정, 비공개 체크박스, 버튼이 보인다", () => {
    setup();
    expect(screen.getByText("상담 날짜")).toBeInTheDocument();
    expect(screen.getByText("담당 교사")).toBeInTheDocument();
    expect(screen.getByText("김교사")).toBeInTheDocument();
    expect(screen.getByLabelText("상담 종류")).toBeInTheDocument();
    expect(screen.getByLabelText("상담 내용")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 상담 일정")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "비공개" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "상담 등록" })).toBeInTheDocument();
  });

  it("상담 종류 select와 옵션들이 보인다", () => {
    setup();
    const select = screen.getByLabelText("상담 종류") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    COUNSEL_TYPES.forEach((type) => {
      expect(screen.getByText(categoryMap[type] ?? type)).toBeInTheDocument();
    });
  });

  it("입력값이 변경되면 handleChange가 호출된다", () => {
    const { handleChange } = setup();
    fireEvent.change(screen.getByLabelText("상담 종류"), { target: { value: COUNSEL_TYPES[0] } });
    fireEvent.change(screen.getByLabelText("상담 내용"), { target: { value: "테스트 상담" } });
    fireEvent.change(screen.getByLabelText("다음 상담 일정"), { target: { value: "다음 일정" } });
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it("비공개 체크박스가 동작한다", () => {
    const { setSendAsPrivate } = setup();
    const checkbox = screen.getByRole("checkbox", { name: "비공개" }) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(setSendAsPrivate).toHaveBeenCalledWith(true);
  });

 it("상담 등록 버튼으로 handleAdd가 호출된다", () => {
  const { handleAdd } = setup();
  const form = screen.getByTestId("counsel-form");
  fireEvent.submit(form);
  expect(handleAdd).toHaveBeenCalled();
});

it("selectedCounselId가 있으면 '상담 수정' 버튼과 '새 상담 추가' 버튼이 보인다", () => {
  const { handleEdit, setForm } = setup({ selectedCounselId: 123 });
  const form = screen.getByTestId("counsel-form");
  fireEvent.submit(form);
  expect(handleEdit).toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "새 상담 추가" }));
  expect(setForm).toHaveBeenCalled();
});

  it("isPublic이 false면 폼에 blur-sm 클래스가 적용된다", () => {
    setup({ form: { ...defaultForm, isPublic: false } });
    expect(screen.getByTestId("counsel-form")).toHaveClass("blur-sm");
  });
});
