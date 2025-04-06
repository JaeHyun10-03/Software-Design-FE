import CounselCard from "./CounselCard";

export default function CounselList() {
  const cards = [
    {
      date: "2025.03.24.",
      subject: "OOOO",
      teacher: "OOO",
      content: "예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  ",
    },
    {
      date: "2025.05.01.",
      subject: "OOOO",
      teacher: "OOO",
      content: "예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  ",
    },
    {
      date: "2025.07.15.",
      subject: "OOOO",
      teacher: "OOO",
      content: "예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  ",
    },
  ];

  return (
    <div className="flex flex-col">
      {cards.map((card, index) => (
        <CounselCard key={index} {...card} />
      ))}
    </div>
  );
}
