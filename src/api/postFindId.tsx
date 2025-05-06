import axios, { AxiosResponse } from "axios";


export const PostFindId = async (
    name: string,
    phone: string,
    school: string
): Promise<any> => {
  axios.defaults.withCredentials = true;

  try {
    const response: AxiosResponse<any> = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/students/id`,
        {
            name: name,
            phone: phone,
            school: school
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

