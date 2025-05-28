// src/pages/attendance/index.test.tsx
import React, { forwardRef, useImperativeHandle } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AttendancePage from "@/pages/attendance/index";

const postAttendancesMock = jest.fn(() => Promise.resolve());

// Mock 함수들을 jest.mock 안에서 직접 정의
jest.mock("@/components/attendance/attendanceContent", () => {
  const MockAttendanceContent = forwardRef(({ edit, onSave }: any, ref: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useImperativeHandle(ref, () => ({
      postAttendances: postAttendancesMock,
    }));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (onSave) {
        onSave(postAttendancesMock);
      }
    }, [onSave]);

    return <div data-testid="attendance-content">edit: {edit ? "true" : "false"}</div>;
  });

  MockAttendanceContent.displayName = "MockAttendanceContent";
  return MockAttendanceContent;
});

jest.mock("@/components/shared/DateFilter", () => {
  return function MockDateFilter() {
    return <div>DateFilter</div>;
  };
});

jest.mock("@/components/shared/StudentFilter", () => {
  return function MockStudentFilter() {
    return <div>StudentFilter</div>;
  };
});

jest.mock("@/components/shared/AttendanceType", () => {
  return function MockAttendanceType() {
    return <div>AttendanceType</div>;
  };
});

jest.mock("@/components/shared/Button", () => {
  return function MockButton({ children, ...props }: any) {
    return <button {...props}>{children}</button>;
  };
});

jest.mock("@/components/shared/Header", () => ({
  Header: function MockHeader({ children }: any) {
    return <div>{children}</div>;
  },
}));

describe("AttendancePage", () => {
  beforeEach(() => {
    postAttendancesMock.mockClear();
  });

  it("수정 버튼 클릭 시 저장 버튼으로 변경된다", async () => {
    render(<AttendancePage />);

    const editButton = screen.getByRole("button", { name: "수정" });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
    });
  });

  it("저장 버튼 클릭 시 저장 함수가 호출되고 loading 상태가 처리된다", async () => {
    render(<AttendancePage />);

    // 수정 모드로 변경
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
    });

    // 저장 버튼 클릭
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    // 저장 중 상태 확인
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "저장 중..." })).toBeInTheDocument();
    });

    // 저장 완료 후 수정 버튼으로 복귀
    await waitFor(() => {
      expect(postAttendancesMock).toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    });
  });

  it("AttendanceContent 컴포넌트가 edit prop을 받는다", async () => {
    render(<AttendancePage />);

    // 초기 상태 확인
    expect(screen.getByTestId("attendance-content")).toHaveTextContent("edit: false");

    // 수정 모드로 변경
    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    // edit prop이 true로 변경됨 확인
    await waitFor(() => {
      expect(screen.getByTestId("attendance-content")).toHaveTextContent("edit: true");
    });
  });
});
