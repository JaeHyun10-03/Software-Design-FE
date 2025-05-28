// __tests__/api/PutCounsel.test.ts
import axios from "axios";
import { PutCounsel } from "@/api/putCounsel";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PutCounsel", () => {
  const params = {
    counselId: 10,
    category: "학업",
    content: "상담 내용 수정",
    nextPlan: "다음 계획 수정",
    dateTime: "2025-05-27T10:00:00",
    isPublic: false,
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
    const mockResponse = { response: { id: params.counselId, ...params } };
    mockedAxios.put.mockResolvedValueOnce({ data: mockResponse });

    const result = await PutCounsel(
      params.counselId,
      params.category,
      params.content,
      params.nextPlan,
      params.dateTime,
      params.isPublic
    );

    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${backendDomain}/counsel/${params.counselId}`,
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
    mockedAxios.put.mockRejectedValueOnce(mockError);

    await expect(
      PutCounsel(
        params.counselId,
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
    mockedAxios.put.mockRejectedValueOnce(mockError);

    await expect(
      PutCounsel(
        params.counselId,
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
    mockedAxios.put.mockRejectedValueOnce(mockError);

    await expect(
      PutCounsel(
        params.counselId,
        params.category,
        params.content,
        params.nextPlan,
        params.dateTime,
        params.isPublic
      )
    ).rejects.toEqual(mockError);
  });
});
