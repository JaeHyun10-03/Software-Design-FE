import axios, { AxiosResponse } from "axios";


export const PutPassword = async (
    loginId: string,
    oldPassword: string,
    newPassword: string
): Promise<any> => {
  axios.defaults.withCredentials = true;

  try {
    const response: AxiosResponse<any> = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/users/password`,
        {
            loginId: loginId,
            oldPassword: oldPassword,
            newPassword: newPassword
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

