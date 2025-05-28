// __tests__/components/Modal.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/shared/Modal";

describe("<Modal />", () => {
  it("open이 false면 아무것도 렌더링하지 않는다", () => {
    render(
      <Modal open={false} onClose={jest.fn()}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("open이 true면 children을 렌더링한다", () => {
    render(
      <Modal open={true} onClose={jest.fn()}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose가 호출된다", () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText("닫기"));
    expect(onClose).toHaveBeenCalled();
  });
});
