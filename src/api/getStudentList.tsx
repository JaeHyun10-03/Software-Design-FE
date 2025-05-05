import axios, { AxiosResponse } from "axios";

const apiUrl = `https://neeis.inuappcenter.kr`;

export const GetStudentList = async (year:number): Promise<any> => {
  axios.defaults.withCredentials = true;
  const token = localStorage.getItem("accessToken"); // 예시: 로컬 스토리지 사용

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${apiUrl}/teachers/students?year=${year}`,
      {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`, // 토큰 추가
          },
      }
    );

    console.log(response.data);
    return response;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
    
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};