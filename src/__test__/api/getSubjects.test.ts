// __tests__/api/getSubjects.test.ts
import axios from "axios";
import { GetSubjects } from "@/api/getSubjects";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetSubjects", () => {
  const year = 2025;
  const semester = 1;
  const grade = 2;

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("정상적으로 과목 목록을 반환한다", async () => {
    const mockSubjects = [
      { id: 1, name: "독서와 문법" },
      { id: 2, name: "영어1" }
    ];
    const mockResponse = {
      data: {
        response: mockSubjects
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse as any);
    localStorage.setItem("accessToken", "mock-token");

    const result = await GetSubjects(year, semester, grade);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/subjects/subjects"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token"
        }),
        withCredentials: true
      })
    );
    expect(result).toEqual(mockSubjects);
  });

  it("에러 응답이 오면 throw 한다 (response 있음)", async () => {
    const error = {
      response: {
        status: 400,
        data: { message: "Bad Request" }
      }
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetSubjects(year, semester, grade)).rejects.toEqual(error);
  });

  it("네트워크 에러 등 response가 없으면 throw 한다", async () => {
    const error = {
      request: {},
      message: "Network Error"
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetSubjects(year, semester, grade)).rejects.toEqual(error);
  });

  it("기타 에러도 throw 한다", async () => {
    const error = {
      message: "Unknown error"
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetSubjects(year, semester, grade)).rejects.toEqual(error);
  });
});
