// __tests__/api/PostLogin.test.ts
import axios from "axios";
import { PostLogin } from "@/api/postLogin";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PostLogin", () => {
  const params = {
    userId: "testuser",
    password: "testpw",
  };
  const backendDomain = "http://localhost:4000";
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NEXT_PUBLIC_BACKEND_DOMAIN: backendDomain };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("정상적으로 데이터를 받아오면 response.data.response를 반환한다", async () => {
    const mockResponse = { response: { accessToken: "token", role: "STUDENT" } };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await PostLogin(params.userId, params.password);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${backendDomain}/users/login`,
      {
        loginId: params.userId,
        password: params.password,
      },
      { withCredentials: true }
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
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostLogin(params.userId, params.password)).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostLogin(params.userId, params.password)).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostLogin(params.userId, params.password)).rejects.toEqual(mockError);
  });
});
