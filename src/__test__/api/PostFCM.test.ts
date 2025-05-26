// __tests__/api/PostFCM.test.ts
import axios from "axios";
import { PostFCM } from "@/api/postFCM";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PostFCM", () => {
  const token = "test-fcm-token";
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

  it("정상적으로 데이터를 받아오면 response를 반환한다", async () => {
    const mockResponse = { data: { success: true } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await PostFCM(token);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${backendDomain}/users/fcm/register`,
      { token: token },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${mockAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("에러 응답이 오면 에러를 throw한다", async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: "Unauthorized" },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostFCM(token)).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostFCM(token)).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostFCM(token)).rejects.toEqual(mockError);
  });
});
