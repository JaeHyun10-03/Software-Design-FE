import axios, { AxiosResponse } from "axios";

const apiUrl = `https://neeis.inuappcenter.kr`;

export const PostLogin = async (
    userId: string,
    password: string
): Promise<any> => {
  axios.defaults.withCredentials = true;

  try {
    const response: AxiosResponse<any> = await axios.post(
        `${apiUrl}/users/login`,
        {
          loginId: userId,
          password: password,
        },
        { withCredentials: true }
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

