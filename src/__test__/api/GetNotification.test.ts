// __tests__/api/GetNotification.test.ts
import { GetNotification } from "@/api/student/getNotifications";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GetNotification", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // 환경변수 mock
    process.env = { ...OLD_ENV, NEXT_PUBLIC_BACKEND_DOMAIN: "http://localhost:3000" };
    // localStorage mock
    Storage.prototype.getItem = jest.fn(() => "mock-token");
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("정상적으로 알림 데이터를 반환한다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: { notifications: [{ id: 1, message: "test" }] } },
    });

    const result = await GetNotification(2, 20);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:3000/notifications?page=2&size=20",
      { headers: { Authorization: "Bearer mock-token" } }
    );
    expect(result).toEqual({ notifications: [{ id: 1, message: "test" }] });
  });

  it("에러 응답이 있을 때 콘솔에 에러를 찍고 예외를 던진다", async () => {
    const error = {
      response: { status: 401, data: { msg: "Unauthorized" } },
    };
    mockedAxios.get.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(GetNotification(0, 10)).rejects.toEqual(error);
    expect(consoleSpy).toHaveBeenCalledWith("Error response:", 401, { msg: "Unauthorized" });

    consoleSpy.mockRestore();
  });

  it("응답이 없을 때 콘솔에 에러를 찍고 예외를 던진다", async () => {
    const error = { request: "no response" };
    mockedAxios.get.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(GetNotification(1, 5)).rejects.toEqual(error);
    expect(consoleSpy).toHaveBeenCalledWith("No response received:", "no response");

    consoleSpy.mockRestore();
  });

  it("기타 에러가 있을 때 콘솔에 에러를 찍고 예외를 던진다", async () => {
    const error = { message: "setup error" };
    mockedAxios.get.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(GetNotification(1, 5)).rejects.toEqual(error);
    expect(consoleSpy).toHaveBeenCalledWith("Error setting up request:", "setup error");

    consoleSpy.mockRestore();
  });
});
