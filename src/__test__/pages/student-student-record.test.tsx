import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StudentRecord from "@/pages/student/student-record";
import axios from "axios";
import useStudent from "@/store/student-store";

// axios mock
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedUseStudent = useStudent as unknown as jest.Mock;

// useStudent mock
jest.mock("@/store/student-store");

describe("StudentRecord", () => {
  const mockStudentInfo = {
    name: "홍길동",
    classroom: "3",
    number: "15",
    gender: "남",
    ssn: "123456-1234567",
    address: "서울시 강남구",
    phone: "010-1234-5678",
    admissionDate: "2021-03-02",
    teacherName: "김선생",
    fatherName: "홍아버지",
    motherName: "홍어머니",
    fatherNum: "010-1111-2222",
    motherNum: "010-3333-4444",
    image: "hong.jpg",
  };

  beforeEach(() => {
    // useStudent 훅 반환값 설정
    mockedUseStudent.mockReturnValue({
      grade: "3",
      classNumber: "1",
      studentNumber: "15",
      studentId: "student123",
    });

    localStorage.setItem("accessToken", "fake-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("학생 정보를 정상적으로 불러와서 렌더링한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { response: mockStudentInfo } });

    render(<StudentRecord />);

    // 사진 이미지가 로딩될 때까지 기다림
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    // 화면에 학생 이름, 학년, 반 등 데이터가 있는지 확인
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getAllByText("3")[0]).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument(); // number
    expect(screen.getByText("남")).toBeInTheDocument();
    expect(screen.getByText("123456-1234567")).toBeInTheDocument();
    expect(screen.getByText("서울시 강남구")).toBeInTheDocument();

    // 이미지 src가 제대로 설정됐는지 확인
    const img = screen.getByAltText("증명사진") as HTMLImageElement;
    expect(img.src).toContain("hong.jpg");
  });

  it("API 호출 실패 시 alert를 호출한다", async () => {
    // alert mock
    window.alert = jest.fn();

    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<StudentRecord />);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("학생 정보 가져오기 실패"));
  });
});
