import { CalendarEvent } from "../ui/full-calendar";

export const events: (CalendarEvent & { trainerId: number })[] = [
  {
    id: "1",
    start: new Date("2024-10-26T09:30:00Z"),
    end: new Date("2024-10-26T14:30:00Z"),
    title: "event A",
    color: "pink",
    trainerId: 1,
  },
  {
    id: "2",
    start: new Date("2024-10-26T10:00:00Z"),
    end: new Date("2024-10-26T10:30:00Z"),
    title: "event B",
    color: "blue",
    trainerId: 2,
  },
];
