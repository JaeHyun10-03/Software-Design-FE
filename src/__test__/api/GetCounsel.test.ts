// __tests__/api/GetCounsel.test.ts
import axios from "axios";
import { GetCounsel } from "@/api/getCounsel";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetCounsel", () => {
  const studentId = "12345";
  const mockAccessToken = "mock-token";
  const backendDomain = "http://localhost:4000";
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // 환경변수 세팅
    process.env = { ...originalEnv, NEXT_PUBLIC_BACKEND_DOMAIN: backendDomain };
    // localStorage mock
    Storage.prototype.getItem = jest.fn(() => mockAccessToken);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("정상적으로 데이터를 받아오면 response.data.response를 반환한다", async () => {
    const mockResponse = { response: [{ id: 1, content: "상담 내용" }] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await GetCounsel(studentId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${backendDomain}/counsel?studentId=${studentId}`,
      { headers: { Authorization: `Bearer ${mockAccessToken}` } }
    );
    expect(result).toEqual(mockResponse.response);
  });

  it("에러 응답이 오면 에러를 throw한다", async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: "Unauthorized" },
      },
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(GetCounsel(studentId)).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(GetCounsel(studentId)).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(GetCounsel(studentId)).rejects.toEqual(mockError);
  });
});
