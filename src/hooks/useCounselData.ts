import { useEffect, useState } from "react";
import { GetCounsel } from "@/api/getCounsel";

export function useCounselData(studentId:string, allFilled:boolean) {
  const [consultingData, setConsultingData] = useState([]);

  useEffect(() => {
    if (!allFilled) return;
    const fetchCounsel = async () => {
      try {
        const response = await GetCounsel(studentId);
        setConsultingData(response);
      } catch {
        setConsultingData([]);
      }
    };
    fetchCounsel();
  }, [studentId, allFilled]);

  return [consultingData, setConsultingData];
}
