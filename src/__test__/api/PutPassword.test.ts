// __tests__/api/PutPassword.test.ts
import axios from "axios";
import { PutPassword } from "@/api/putPassword";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PutPassword", () => {
  const params = {
    loginId: "testuser",
    oldPassword: "oldpw",
    newPassword: "newpw",
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
    const mockResponse = { response: { success: true } };
    mockedAxios.put.mockResolvedValueOnce({ data: mockResponse });

    const result = await PutPassword(params.loginId, params.oldPassword, params.newPassword);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${backendDomain}/users/password`,
      {
        loginId: params.loginId,
        oldPassword: params.oldPassword,
        newPassword: params.newPassword,
      }
    );
    expect(result).toEqual(mockResponse.response);
  });

  it("에러 응답이 오면 에러를 throw한다", async () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: "Bad Request" },
      },
    };
    mockedAxios.put.mockRejectedValueOnce(mockError);

    await expect(
      PutPassword(params.loginId, params.oldPassword, params.newPassword)
    ).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.put.mockRejectedValueOnce(mockError);

    await expect(
      PutPassword(params.loginId, params.oldPassword, params.newPassword)
    ).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.put.mockRejectedValueOnce(mockError);

    await expect(
      PutPassword(params.loginId, params.oldPassword, params.newPassword)
    ).rejects.toEqual(mockError);
  });
});
