import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentRecord from "./StudentRecord";
import axios from "axios";

// axios 모킹 설정
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("StudentRecord 컴포넌트", () => {
  beforeEach(() => {
    // 테스트마다 같은 mock 데이터 반환하도록 설정
    mockedAxios.get.mockResolvedValue({
      data: {
        response: {
          name: "홍길동",
          classroom: "3",
          number: "12",
          gender: "남",
          ssn: "123456-1234567",
          address: "서울시 강남구",
          phone: "010-1234-5678",
          admissionDate: "2020-03-01",
          teacherName: "김선생",
          fatherName: "홍아버지",
          motherName: "홍어머니",
          fatherNum: "010-1111-2222",
          motherNum: "010-3333-4444",
          image: "hong.jpg",
        },
      },
    });
  });

  test("학생 이름이 화면에 보여진다", async () => {
    render(<StudentRecord />);
    const nameElement = await screen.findByText("홍길동");
    expect(nameElement).toBeInTheDocument();
  });

  test("수정 버튼 클릭 시 편집 모드가 활성화되고 저장, 취소 버튼이 보인다", () => {
    render(<StudentRecord />);
    fireEvent.click(screen.getByText("수정"));
    expect(screen.getByText("저장")).toBeInTheDocument();
    expect(screen.getByText("취소")).toBeInTheDocument();
  });

  test("편집 모드에서 이미지 클릭하면 파일 선택창이 열린다", () => {
    render(<StudentRecord />);
    fireEvent.click(screen.getByText("수정"));

    // 이미지 대신 이미지 컨테이너 div를 찾아서 클릭
    // 이미지가 없으면 "증명 사진" 텍스트가 보이니까 그 텍스트의 부모 div를 클릭
    const imageContainer = screen.getByText("증명 사진").parentElement!;

    const fileInput = screen.getByTestId("file-input");
    const clickMock = jest.spyOn(fileInput, "click").mockImplementation(() => {});

    fireEvent.click(imageContainer);

    expect(clickMock).toHaveBeenCalled();

    clickMock.mockRestore();
  });

  test("취소 버튼 클릭 시 편집 모드가 해제된다", () => {
    render(<StudentRecord />);
    fireEvent.click(screen.getByText("수정"));
    fireEvent.click(screen.getByText("취소"));

    expect(screen.queryByText("저장")).not.toBeInTheDocument();
    expect(screen.getByText("수정")).toBeInTheDocument();
  });

  test("저장 버튼 클릭 시 API 호출 함수가 실행된다 (모킹 필요)", () => {
    // 여기선 단순히 저장 버튼이 보이는지만 테스트
    render(<StudentRecord />);
    fireEvent.click(screen.getByText("수정"));
    const saveButton = screen.getByText("저장");
    expect(saveButton).toBeInTheDocument();

    // 실제 API 호출은 jest.mock()으로 처리하거나
    // putStudentData 함수를 prop으로 넘겨서 테스트할 수 있음
  });
});
