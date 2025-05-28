import axios, { AxiosResponse } from "axios";

export const PostEval = async (
  subject: string,
  year: number,
  semester: number,
  grade: number,
  examType: "WRITTEN" | "PRACTICAL",
  title: string,
  weight: number,
  fullScore: number
   ): Promise<any> => {
  axios.defaults.withCredentials = true;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response: AxiosResponse<any> = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/evaluation-methods`,
        {
            subject: subject,
            year: year,
            semester: semester,
            grade: grade,
            examType: examType,
            title: title,
            weight: weight,
            fullScore: fullScore
          }  ,  
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
          }
    );

    console.log(response.data);
    return response.data;
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
