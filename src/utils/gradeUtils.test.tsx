import { mapApiResponseToStudents, convertToApiFormat, Evaluation } from "./gradeUtils";

describe("mapApiResponseToStudents", () => {
  it("returns empty arrays if input is invalid", () => {
    expect(mapApiResponseToStudents(null)).toEqual({ titles: [], students: [] });
    expect(mapApiResponseToStudents({})).toEqual({ titles: [], students: [] });
  });

  it("maps API response to student table format correctly", () => {
    const response = {
      evaluations: [{ evaluationId: 1, title: "Quiz 1" }],
      students: [
        {
          number: 1,
          studentName: "Alice",
          scores: [{ evaluationId: 1, rawScore: 85 }],
          rawTotal: 85,
          weightedTotal: 90,
          average: 85,
          stdDev: 0,
          rank: 1,
          grade: "A",
          achievementLevel: "High",
          feedback: "Well done",
        },
      ],
    };

    const result = mapApiResponseToStudents(response);

    expect(result.titles).toEqual([{ evaluationId: 1, title: "Quiz 1" }]);
    expect(result.students[0]).toMatchObject({
      number: 1,
      studentName: "Alice",
      "Quiz 1": 85,
      rawTotal: 85,
      weightedTotal: 90,
      average: 85,
      stdDev: 0,
      rank: 1,
      grade: "A",
      achievementLevel: "High",
      feedback: "Well done",
    });
  });

  it("defaults score to '-' if not found", () => {
    const response = {
      evaluations: [{ evaluationId: 1, title: "Quiz 1" }],
      students: [
        {
          number: 2,
          studentName: "Bob",
          scores: [],
        },
      ],
    };

    const result = mapApiResponseToStudents(response);
    expect(result.students[0]["Quiz 1"]).toBe("-");
  });
});

describe("convertToApiFormat", () => {
  const evaluations: Evaluation[] = [
    { evaluationId: 1, title: "Quiz 1" },
    { evaluationId: 2, title: "Quiz 2" },
  ];

  const students = [
    {
      number: 1,
      "Quiz 1": "90",
      "Quiz 2": "-",
    },
    {
      number: 2,
      "Quiz 1": null,
      "Quiz 2": 75,
    },
  ];

  it("converts student data back to API format correctly", () => {
    const result = convertToApiFormat(students, evaluations, 3);

    expect(result).toEqual([
      {
        classNum: 3,
        evaluationId: 1,
        students: [
          { number: 1, rawScore: 90 },
          { number: 2, rawScore: 0 },
        ],
      },
      {
        classNum: 3,
        evaluationId: 2,
        students: [
          { number: 1, rawScore: 0 },
          { number: 2, rawScore: 75 },
        ],
      },
    ]);
  });
});
