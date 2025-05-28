// __tests__/api/postSubject.test.ts
import axios from "axios";
import { PostSubject } from "@/api/postSubject";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PostSubject", () => {
  const name = "한국지리";

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("정상적으로 과목 추가 요청을 보내고 응답 데이터를 반환한다", async () => {
    const mockResponseData = { result: "ok" };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData } as any);
    localStorage.setItem("accessToken", "mock-token");

    const result = await PostSubject(name);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/subjects"),
      { name },
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

    await expect(PostSubject(name)).rejects.toEqual(error);
  });

  it("네트워크 에러 등 response가 없으면 throw 한다", async () => {
    const error = {
      request: {},
      message: "Network Error"
    };
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(PostSubject(name)).rejects.toEqual(error);
  });

  it("기타 에러도 throw 한다", async () => {
    const error = {
      message: "Unknown error"
    };
    mockedAxios.post.mockRejectedValueOnce(error);

    await expect(PostSubject(name)).rejects.toEqual(error);
  });
});
