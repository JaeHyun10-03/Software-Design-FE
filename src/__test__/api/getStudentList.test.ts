// __tests__/api/getStudentList.test.ts
import axios from "axios";
import { GetStudentList } from "@/api/getStudentList";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetStudentList", () => {
  const year = 2025;
  const grade = 1;
  const classNum = 2;

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("정상적으로 학생 목록을 반환한다", async () => {
    const mockStudents = [
      { studentId: 1, name: "홍길동" },
      { studentId: 2, name: "김철수" }
    ];
    const mockResponse = {
      data: {
        response: {
          students: mockStudents
        }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse as any);
    localStorage.setItem("accessToken", "mock-token");

    const result = await GetStudentList(year, grade, classNum);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/teachers/students"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token"
        }),
        withCredentials: true
      })
    );
    expect(result).toEqual(mockStudents);
  });

  it("에러 응답이 오면 throw 한다 (response 있음)", async () => {
    const error = {
      response: {
        status: 400,
        data: { message: "Bad Request" }
      }
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetStudentList(year, grade, classNum)).rejects.toEqual(error);
  });

  it("네트워크 에러 등 response가 없으면 throw 한다", async () => {
    const error = {
      request: {},
      message: "Network Error"
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetStudentList(year, grade, classNum)).rejects.toEqual(error);
  });

  it("기타 에러도 throw 한다", async () => {
    const error = {
      message: "Unknown error"
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetStudentList(year, grade, classNum)).rejects.toEqual(error);
  });
});
