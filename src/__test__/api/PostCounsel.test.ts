// __tests__/api/PostCounsel.test.ts
import axios from "axios";
import { PostCounsel } from "@/api/postCounsel";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PostCounsel", () => {
  const params = {
    studentId: "12345",
    category: "학업",
    content: "상담 내용",
    nextPlan: "다음 계획",
    dateTime: "2025-05-27T10:00:00",
    isPublic: true,
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
    const mockResponse = { response: { id: 1, ...params } };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await PostCounsel(
      params.studentId,
      params.category,
      params.content,
      params.nextPlan,
      params.dateTime,
      params.isPublic
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${backendDomain}/counsel?studentId=${params.studentId}`,
      {
        category: params.category,
        content: params.content,
        nextPlan: params.nextPlan,
        dateTime: params.dateTime,
        isPublic: params.isPublic,
      },
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

    await expect(
      PostCounsel(
        params.studentId,
        params.category,
        params.content,
        params.nextPlan,
        params.dateTime,
        params.isPublic
      )
    ).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(
      PostCounsel(
        params.studentId,
        params.category,
        params.content,
        params.nextPlan,
        params.dateTime,
        params.isPublic
      )
    ).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(
      PostCounsel(
        params.studentId,
        params.category,
        params.content,
        params.nextPlan,
        params.dateTime,
        params.isPublic
      )
    ).rejects.toEqual(mockError);
  });
});
