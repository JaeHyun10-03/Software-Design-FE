// __tests__/api/getEvalMethod.test.ts
import axios from "axios";
import { GetEvalMethod } from "@/api/getEvalMethod";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetEvalMethod", () => {
  const year = 2025;
  const semester = 1;
  const grade = 2;
  const subject = "수학";

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("정상적으로 평가방식 목록을 반환한다", async () => {
    const mockResponse = {
      data: {
        response: [
          { evaluationId: 1, title: "중간고사", examType: "WRITTEN" },
          { evaluationId: 2, title: "기말고사", examType: "WRITTEN" },
        ]
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse as any);
    localStorage.setItem("accessToken", "mock-token");

    const result = await GetEvalMethod(year, semester, grade, subject);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/evaluation-methods"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token"
        }),
        withCredentials: true
      })
    );
    expect(result).toEqual(mockResponse.data.response);
  });

  it("에러 응답이 오면 throw 한다 (response 있음)", async () => {
    const error = {
      response: {
        status: 400,
        data: { message: "Bad Request" }
      }
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetEvalMethod(year, semester, grade, subject)).rejects.toEqual(error);
  });

  it("네트워크 에러 등 response가 없으면 throw 한다", async () => {
    const error = {
      request: {},
      message: "Network Error"
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetEvalMethod(year, semester, grade, subject)).rejects.toEqual(error);
  });

  it("기타 에러도 throw 한다", async () => {
    const error = {
      message: "Unknown error"
    };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(GetEvalMethod(year, semester, grade, subject)).rejects.toEqual(error);
  });
});
