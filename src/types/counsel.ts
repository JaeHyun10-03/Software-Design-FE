export interface ConsultingData {
    id: number;
    dateTime: string;
    category: string;
    teacher: string;
    content: string;
    nextPlan: string;
    isPublic: boolean;
  }
  
  export interface TeacherInfo {
    teacherId: number;
    name: string;
    phone: string;
    email: string;
  }
  