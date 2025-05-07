import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
}

interface CounselCalendarProps {
  events: CalendarEvent[];
  selectedDate: string;
  handleDateClick: (arg: DateClickArg) => void;
  handleEventClick: (arg: EventClickArg) => void;
}

export function CounselCalendar({
  events,
  selectedDate,
  handleDateClick,
  handleEventClick,
}: CounselCalendarProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale={koLocale}
      headerToolbar={{ left: "prev", center: "title", right: "next" }}
      dayCellContent={(arg) => {
        const numberOnly = arg.dayNumberText.replace(/[^\d]/g, "");
        return <span>{numberOnly}</span>;
      }}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
      events={events}
      height="auto"
      firstDay={0}
      dayCellClassNames={(arg) => {
        const y = arg.date.getFullYear();
        const m = String(arg.date.getMonth() + 1).padStart(2, "0");
        const d = String(arg.date.getDate()).padStart(2, "0");
        const cellDateStr = `${y}-${m}-${d}`;
        return cellDateStr === selectedDate ? ["selected-date"] : [];
      }}
      contentHeight={320}
    />
  );
}
