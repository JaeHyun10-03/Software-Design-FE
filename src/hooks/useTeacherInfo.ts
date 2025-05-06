import { useEffect, useState } from "react";
import { GetTeacherInfo } from "@/api/getTeacherInfo";

export function useTeacherInfo() {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await GetTeacherInfo();
        setTeacher(response);
      } catch {
        setTeacher(null);
      }
    };
    fetchTeacherInfo();
  }, []);

  return teacher;
}
