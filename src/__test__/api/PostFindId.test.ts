// __tests__/api/PostFindId.test.ts
import axios from "axios";
import { PostFindId } from "@/api/postFindId";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PostFindId", () => {
  const params = {
    name: "홍길동",
    phone: "010-1234-5678",
    school: "서울고등학교",
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
    const mockResponse = { response: { studentId: "202512345" } };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await PostFindId(params.name, params.phone, params.school);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${backendDomain}/students/id`,
      {
        name: params.name,
        phone: params.phone,
        school: params.school,
      },
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse.response);
  });

  it("에러 응답이 오면 에러를 throw한다", async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: "Not Found" },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostFindId(params.name, params.phone, params.school)).rejects.toEqual(mockError);
  });

  it("네트워크 오류 등으로 response가 없으면 에러를 throw한다", async () => {
    const mockError = {
      request: {},
      message: "Network Error",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostFindId(params.name, params.phone, params.school)).rejects.toEqual(mockError);
  });

  it("요청 설정 에러가 발생하면 에러를 throw한다", async () => {
    const mockError = {
      message: "설정 오류",
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(PostFindId(params.name, params.phone, params.school)).rejects.toEqual(mockError);
  });
});
