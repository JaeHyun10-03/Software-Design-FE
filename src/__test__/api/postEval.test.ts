// __tests__/api/postEval.test.ts
import axios from "axios";
import { PostEval } from "@/api/postEval";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PostEval", () => {
  const subject = "수학";
  const year = 2025;
  const semester = 1;
  const grade = 2;
  const examType = "WRITTEN" as const;
  const title = "중간고사";
  const weight = 20;
  const fullScore = 100;

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("정상적으로 평가방식 추가 요청을 보내고 응답 데이터를 반환한다", async () => {
    const mockResponseData = { result: "ok" };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData } as any);
    localStorage.setItem("accessToken", "mock-token");

    const result = await PostEval(subject, year, semester, grade, examType, title, weight, fullScore);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/evaluation-methods"),
      {
        subject,
        year,
        semester,
        grade,
        examType,
        title,
        weight,
        fullScore,
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
          "Content-Type": "application/json"
        }),
        withCredentials: true
      })
    );
    expect(result).toEqual(mockResponseData);
  });

  it("에러 응답이 오면 throw 한다 (response 있음)", async () => {
    const error = {
      response: {
        status: 400,
        data: { message: "Bad Request" }
      }
    };
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(
      PostEval(subject, year, semester, grade, examType, title, weight, fullScore)
    ).rejects.toEqual(error);
  });

  it("네트워크 에러 등 response가 없으면 throw 한다", async () => {
    const error = {
      request: {},
      message: "Network Error"
    };
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(
      PostEval(subject, year, semester, grade, examType, title, weight, fullScore)
    ).rejects.toEqual(error);
  });

  it("기타 에러도 throw 한다", async () => {
    const error = {
      message: "Unknown error"
    };
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(
      PostEval(subject, year, semester, grade, examType, title, weight, fullScore)
    ).rejects.toEqual(error);
  });
});
