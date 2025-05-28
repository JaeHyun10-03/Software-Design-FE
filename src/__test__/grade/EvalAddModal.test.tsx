// __tests__/components/EvalAddModal.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EvalAddModal } from "@/components/grade/EvalAddModal";

// Modal과 EvalAddForm을 mock 처리
jest.mock("@/components/shared/Modal", () => ({
  __esModule: true,
  Modal: ({ open, onClose, children }: any) =>
    open ? (
      <div data-testid="modal">
        <button data-testid="modal-close" onClick={onClose}>
          닫기
        </button>
        {children}
      </div>
    ) : null,
}));

jest.mock("@/components/grade/EvalAddForm", () => ({
  __esModule: true,
  EvalAddForm: ({ value, onAdd, onCancel }: any) => (
    <div data-testid="eval-add-form">
      <button data-testid="add-btn" onClick={onAdd}>추가</button>
      <button data-testid="cancel-btn" onClick={onCancel}>취소</button>
      <div>title:{value.title}</div>
    </div>
  ),
}));

describe("<EvalAddModal />", () => {
  const defaultValue = {
    title: "",
    examType: "WRITTEN" as "WRITTEN" | "PRACTICAL",
    weight: null,
    fullScore: null,
  };

  it("open이 false면 아무것도 렌더링하지 않는다", () => {
    render(
      <EvalAddModal
        open={false}
        value={defaultValue}
        onChange={jest.fn()}
        onAdd={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("eval-add-form")).not.toBeInTheDocument();
  });

  it("open이 true면 Modal과 EvalAddForm이 렌더링된다", () => {
    render(
      <EvalAddModal
        open={true}
        value={{ ...defaultValue, title: "중간고사" }}
        onChange={jest.fn()}
        onAdd={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("eval-add-form")).toBeInTheDocument();
    expect(screen.getByText("title:중간고사")).toBeInTheDocument();
  });

  it("추가 버튼 클릭 시 onAdd가 호출된다", () => {
    const onAdd = jest.fn();
    render(
      <EvalAddModal
        open={true}
        value={defaultValue}
        onChange={jest.fn()}
        onAdd={onAdd}
        onCancel={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(onAdd).toHaveBeenCalled();
  });

  it("취소 버튼 클릭 시 onCancel이 호출된다", () => {
    const onCancel = jest.fn();
    render(
      <EvalAddModal
        open={true}
        value={defaultValue}
        onChange={jest.fn()}
        onAdd={jest.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("모달 닫기 버튼 클릭 시 onCancel이 호출된다", () => {
    const onCancel = jest.fn();
    render(
      <EvalAddModal
        open={true}
        value={defaultValue}
        onChange={jest.fn()}
        onAdd={jest.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByTestId("modal-close"));
    expect(onCancel).toHaveBeenCalled();
  });
});
