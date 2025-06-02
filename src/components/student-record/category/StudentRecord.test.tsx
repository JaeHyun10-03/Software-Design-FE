import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentRecord from "./StudentRecord";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the zustand store
jest.mock("@/store/student-filter-store");
const mockedUseStudentFilterStore = useStudentFilterStore as jest.MockedFunction<typeof useStudentFilterStore>;

// Mock process.env.NEXT_PUBLIC_BACKEND_DOMAIN for tests
process.env.NEXT_PUBLIC_BACKEND_DOMAIN = "http://localhost:8080";

describe("StudentRecord 컴포넌트", () => {
  const mockStudentData = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "mockAccessToken"),
      },
      writable: true,
    });

    mockedUseStudentFilterStore.mockReturnValue({
      grade: "1",
      classNumber: "3",
      studentNumber: "12",
      studentId: 1,
    });

    mockedAxios.get.mockResolvedValue({
      data: {
        response: mockStudentData,
      },
    });

    mockedAxios.put.mockResolvedValue({
      data: {
        message: "Student information updated successfully",
      },
    });

    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("학생 데이터가 로드되어 화면에 보여진다", async () => {
    render(<StudentRecord />);

    await waitFor(() => {
      expect(screen.getByText("홍길동")).toBeInTheDocument();
    });
    expect(screen.getByText("서울시 강남구")).toBeInTheDocument();
    expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
    expect(screen.getByText("홍아버지")).toBeInTheDocument();
    expect(screen.getByText("홍어머니")).toBeInTheDocument();
    expect(screen.getByText("010-1111-2222")).toBeInTheDocument();
    expect(screen.getByText("010-3333-4444")).toBeInTheDocument();

    const studentImage = screen.getByAltText("증명사진") as HTMLImageElement;
    expect(studentImage.src).toBe(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/images/${mockStudentData.image}`);
  });

  test("이미지 URL이 없을 때 기본 이미지로 표시된다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        response: {
          ...mockStudentData,
          image: null,
        },
      },
    });
    render(<StudentRecord />);

    await waitFor(() => {
      const studentImage = screen.getByAltText("증명사진") as HTMLImageElement;
      expect(studentImage.src).toContain("/images/defaultImage.png");
    });
  });

  test("수정 버튼 클릭 시 편집 모드가 활성화되고 저장, 취소 버튼이 보인다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));
    expect(screen.getByText("저장")).toBeInTheDocument();
    expect(screen.getByText("취소")).toBeInTheDocument();
    expect(screen.queryByText("수정")).not.toBeInTheDocument();
  });

  test("편집 모드에서 이미지 클릭하면 파일 선택창이 열린다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));

    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    const clickMock = jest.spyOn(fileInput, "click").mockImplementation(() => {});

    const studentImage = screen.getByAltText("증명사진");
    fireEvent.click(studentImage);

    expect(clickMock).toHaveBeenCalled();
    clickMock.mockRestore();
  });

  test("취소 버튼 클릭 시 편집 모드가 해제되고 수정 버튼이 다시 나타난다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));
    fireEvent.click(screen.getByText("취소"));

    expect(screen.queryByText("저장")).not.toBeInTheDocument();
    expect(screen.queryByText("취소")).not.toBeInTheDocument();
    expect(screen.getByText("수정")).toBeInTheDocument();
  });

  test("편집 모드에서 이름 필드를 수정할 수 있다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));

    const nameInput = screen.getByDisplayValue("홍길동") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "이순신" } });
    expect(nameInput.value).toBe("이순신");
  });

  test("저장 버튼 클릭 시 학생 정보가 업데이트되고 API 호출이 이루어진다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));

    const nameInput = screen.getByDisplayValue("홍길동") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "이순신" } });

    const addressInput = screen.getByDisplayValue("서울시 강남구") as HTMLInputElement;
    fireEvent.change(addressInput, { target: { value: "경기도 수원시" } });

    const saveButton = screen.getByText("저장");
    fireEvent.click(saveButton);

    await waitFor(async () => {
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const args = mockedAxios.put.mock.calls[0];
      const url = args[0];
      const formData = args[1];

      expect(url).toContain("/students/1");
      expect(formData instanceof FormData).toBeTruthy();

      const infoBlob = formData.get("info") as Blob;
      expect(infoBlob).toBeInstanceOf(Blob);

      const parsedInfo = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(JSON.parse(reader.result as string));
        };
        reader.readAsText(infoBlob);
      });

      expect(parsedInfo).toEqual({
        name: "이순신",
        address: "경기도 수원시",
        phone: "010-1234-5678",
        fatherName: "홍아버지",
        motherName: "홍어머니",
        fatherPhone: "010-1111-2222",
        motherPhone: "010-3333-4444",
      });

      expect(formData.has("image")).toBeFalsy();

      const headers = args[2].headers;
      expect(headers.Authorization).toBe("Bearer mockAccessToken");
      expect(headers["Content-Type"]).toBe("multipart/form-data");

      expect(window.alert).toHaveBeenCalledWith("학생 정보가 성공적으로 저장되었습니다.");
      expect(screen.queryByText("저장")).not.toBeInTheDocument();
      expect(screen.getByText("수정")).toBeInTheDocument();
    });
  });

  test("저장 실패 시 에러 메시지를 표시한다", async () => {
    mockedAxios.put.mockRejectedValueOnce({
      response: { data: { message: "Failed to save student data" } },
    });

    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));
    fireEvent.click(screen.getByText("저장"));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("학생 정보 저장에 실패했습니다: Failed to save student data");
    });
  });

  test("uneditableFields에 포함된 필드는 편집 모드에서도 수정할 수 없다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));

    const genderField = screen.getByText("남");
    expect(genderField).toBeInTheDocument();
    expect(genderField.tagName).toBe("P");
    expect(genderField.closest("div")).toHaveClass("bg-gray-100");
  });

  // 🔧 수정된 이미지 파일 선택 테스트
  test("편집 모드에서 이미지 파일을 선택하면 미리보기가 업데이트된다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));

    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    const mockFile = new File(["dummy content"], "new-image.png", { type: "image/png" });
    const expectedDataURL = "data:image/png;base64,mockImageData";

    // 🔧 개선된 FileReader 목업
    const originalFileReader = window.FileReader;
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: expectedDataURL,
      onloadend: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
    };

    window.FileReader = jest.fn(() => mockFileReader) as any;

    // 🔧 파일 입력 요소의 files 속성을 직접 설정
    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: false,
    });

    // 🔧 readAsDataURL 호출 시 즉시 onloadend 트리거
    mockFileReader.readAsDataURL.mockImplementation(() => {
      if (mockFileReader.onloadend) {
        // 더 정확한 ProgressEvent 객체 생성
        const event = {
          target: mockFileReader,
          type: "loadend",
          lengthComputable: true,
          loaded: 100,
          total: 100,
        } as ProgressEvent<FileReader>;

        // 다음 틱에서 실행하여 React 상태 업데이트가 처리되도록 함
        setTimeout(() => mockFileReader.onloadend!(event), 0);
      }
    });

    // 파일 변경 이벤트 발생
    fireEvent.change(fileInput);

    // 🔧 이미지 업데이트를 더 안정적으로 대기
    await waitFor(
      () => {
        const studentImage = screen.getByAltText("증명사진") as HTMLImageElement;
        expect(studentImage.src).toBe(expectedDataURL);
      },
      { timeout: 1000 }
    );

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

    // 원래 FileReader 복원
    window.FileReader = originalFileReader;
  });

  // 🔧 수정된 이미지 업로드 테스트
  test("저장 버튼 클릭 시 새 이미지가 업로드되면 API 호출에 이미지 파일이 포함된다", async () => {
    render(<StudentRecord />);
    await waitFor(() => expect(screen.getByText("수정")).toBeInTheDocument());

    fireEvent.click(screen.getByText("수정"));

    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    const mockFile = new File(["dummy content"], "new-image-to-upload.png", { type: "image/png" });

    // 🔧 파일 입력의 files 속성을 직접 설정
    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: false,
    });

    // 파일 변경 이벤트 발생
    fireEvent.change(fileInput);

    const saveButton = screen.getByText("저장");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      const args = mockedAxios.put.mock.calls[0];
      const formData = args[1];

      expect(formData.has("image")).toBeTruthy();
      expect(formData.get("image")).toBe(mockFile);
    });
  });
});
