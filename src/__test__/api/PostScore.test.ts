// __tests__/api/PostScore.test.ts
import axios from "axios";
import { PostScore } from "@/api/postScore";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PostScore", () => {
  const payload = [
    {
      classNum: 1,
      evaluationId: 101,
      students: [
        { number: 1, rawScore: 95 },
        { number: 2, rawScore: 88 },
      ],
    },
    {
      classNum: 2,
      evaluationId: 102,
      students: [
        { number: 3, rawScore: 78 },
      ],
    },
  ];
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
    const mockResponse = { response: { success: true } };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await PostScore(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${backendDomain}/scores`,
      payload,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${mockAccessToken}`,
          "Content-Type": "application/json",
        },
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
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostScore(payload)).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostScore(payload)).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostScore(payload)).rejects.toEqual(mockError);
  });
});
