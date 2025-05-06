import axios, { AxiosResponse } from "axios";


export const GetCounsel = async (
    studentId:string
): Promise<any> => {
  axios.defaults.withCredentials = true;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response: AxiosResponse<any> = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/counsel/${studentId}`,{
          headers: { Authorization: `Bearer ${accessToken}` }
        });

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

