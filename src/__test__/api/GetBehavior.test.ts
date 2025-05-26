// __tests__/api/GetBehavior.test.ts
import axios from "axios";
import { GetBehavior } from "@/api/student/getBehavior";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetBehavior", () => {
  const params = {
    year: 2025,
    grade: 2,
    classNum: 3,
    studentId: 1001,
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

  it("정상적으로 데이터를 받아오면 response.data.response를 반환한다", async () => {
    const mockResponse = { response: [{ id: 1, behavior: "우수" }] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await GetBehavior(
      params.year,
      params.grade,
      params.classNum,
      params.studentId
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${backendDomain}/behavior?year=${params.year}&grade=${params.grade}&classNum=${params.classNum}&studentId=${params.studentId}`,
      { headers: { Authorization: `Bearer ${mockAccessToken}` } }
    );
    expect(result).toEqual(mockResponse.response);
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
      GetBehavior(params.year, params.grade, params.classNum, params.studentId)
    ).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(
      GetBehavior(params.year, params.grade, params.classNum, params.studentId)
    ).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(
      GetBehavior(params.year, params.grade, params.classNum, params.studentId)
    ).rejects.toEqual(mockError);
  });
});
