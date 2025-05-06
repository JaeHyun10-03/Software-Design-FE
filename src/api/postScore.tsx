import axios, { AxiosResponse } from "axios";

export const PostScore = async (
    payload: Array<{ // ✅ 배열 형태 명시적 타입 지정
        classNum: number;
        evaluationId: number;
        students: Array<{ number: number; rawScore: number }>;
      }>): Promise<any> => {
  axios.defaults.withCredentials = true;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response: AxiosResponse<any> = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/scores`,
          payload ,  // 두 번째 인자로 payload 전달
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
          }
    );

    console.log(response.data.response);
    return response.data.response;
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
