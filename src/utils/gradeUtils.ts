export interface Evaluation {
    evaluationId: number;
    title: string;
  }
  
  export function mapApiResponseToStudents(response: any) {
    if (!response?.evaluations || !response?.students) return { titles: [], students: [] };
    const titles = response.evaluations.map((e: any) => ({
      evaluationId: e.evaluationId,
      title: e.title,
    }));
    const students = response.students.map((stu: any) => {
      const scoresByTitle: Record<string, number | "-"> = {};
      response.evaluations.forEach((evaluation: any) => {
        const found = stu.scores?.find((s: any) => s.evaluationId === evaluation.evaluationId);
        scoresByTitle[evaluation.title] = found?.rawScore ?? "-";
      });
      return {
        number: stu.number,
        studentName: stu.studentName,
        ...scoresByTitle,
        rawTotal: stu.rawTotal || 0,
        weightedTotal: stu.weightedTotal || 0,
        average: stu.average || 0,
        stdDev: stu.stdDev || 0,
        rank: stu.rank || 0,
        grade: stu.grade || "-",
        achievementLevel: stu.achievementLevel || "-",
        feedback: stu.feedback || "-",
      };
    });
    return { titles, students };
  }
  
  export function convertToApiFormat(
    students: any[],
    evaluations: Evaluation[],
    classNum: number
  ) {
    return evaluations.map((evaluation) => ({
      classNum,
      evaluationId: evaluation.evaluationId,
      students: students.map((student) => ({
        number: student.number,
        rawScore:
          student[evaluation.title] === "-" ||
          student[evaluation.title] === undefined ||
          student[evaluation.title] === null
            ? 0
            : Number(student[evaluation.title]),
      })),
    }));
  }
  