// __tests__/api/GetScore.test.ts
import axios from "axios";
import { GetScore } from "@/api/getScoreSummary";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetScore", () => {
  const params = {
    year: 2025,
    semester: 1,
    grade: 2,
    classNum: 3,
    subject: "수학",
  };
  const mockAccessToken = "mock-token";
  const backendDomain = "http://localhost:4000";
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NEXT_PUBLIC_BACKEND_DOMAIN: backendDomain };
    // localStorage mock
    Storage.prototype.getItem = jest.fn(() => mockAccessToken);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("정상적으로 데이터를 받아오면 response.data.response[0]을 반환한다", async () => {
    const mockScore = { score: 100, student: "홍길동" };
    const mockResponse = { response: [mockScore] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await GetScore(
      params.year,
      params.semester,
      params.grade,
      params.classNum,
      params.subject
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${backendDomain}/scores/summary?year=${params.year}&semester=${params.semester}&grade=${params.grade}&classNum=${params.classNum}&subject=${encodeURIComponent(params.subject)}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${mockAccessToken}`,
        },
      }
    );
    expect(result).toEqual(mockScore);
  });

  it("에러 응답이 오면 에러를 throw한다", async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: "Not Found" },
      },
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(
      GetScore(
        params.year,
        params.semester,
        params.grade,
        params.classNum,
        params.subject
      )
    ).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(
      GetScore(
        params.year,
        params.semester,
        params.grade,
        params.classNum,
        params.subject
      )
    ).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(
      GetScore(
        params.year,
        params.semester,
        params.grade,
        params.classNum,
        params.subject
      )
    ).rejects.toEqual(mockError);
  });
});
