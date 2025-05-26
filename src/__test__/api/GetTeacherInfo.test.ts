// __tests__/api/GetTeacherInfo.test.ts
import axios from "axios";
import { GetTeacherInfo } from "@/api/getTeacherInfo";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetTeacherInfo", () => {
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
    const mockTeacherList = [{ id: 1, name: "홍길동" }];
    const mockResponse = { response: mockTeacherList };
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await GetTeacherInfo();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${backendDomain}/teachers`,
      { headers: { Authorization: `Bearer ${mockAccessToken}` } }
    );
    expect(result).toEqual(mockTeacherList);
  });

  it("에러 응답이 오면 에러를 throw한다", async () => {
    const mockError = {
      response: {
        status: 403,
        data: { message: "Forbidden" },
      },
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(GetTeacherInfo()).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(GetTeacherInfo()).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(GetTeacherInfo()).rejects.toEqual(mockError);
  });
});
