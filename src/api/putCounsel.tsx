import axios, { AxiosResponse } from "axios";

export const PutCounsel = async (
    counselId:number,
    category:string,
    content: string,
    nextPlan:string,
    dateTime: string,
    isPublic: boolean
   ): Promise<any> => {
  axios.defaults.withCredentials = true;
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response: AxiosResponse<any> = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/counsel/${counselId}`,
        {
            category:category,
            content: content,
            nextPlan:nextPlan,
            dateTime: dateTime,
            isPublic: isPublic
          }  ,  
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
