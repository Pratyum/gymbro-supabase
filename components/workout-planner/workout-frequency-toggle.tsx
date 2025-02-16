"use client";

import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { DayOfWeek } from "@/types";

type WorkoutFrequencyToggleProps = {
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  selectedDays: DayOfWeek[];
  onSelectedDaysChange: (days: DayOfWeek[]) => void;
};
export function WorkoutFrequencyToggle({
    startDate,
    onStartDateChange,
    selectedDays,
    onSelectedDaysChange,
}: WorkoutFrequencyToggleProps) {
    const [stDate, setStDate] = useState<Date | undefined>(startDate);
    const [internalSelectedDays, setInternalSelectedDays] =
    useState<DayOfWeek[]>(selectedDays);
    const toggleDay = (day: DayOfWeek) => {
        setInternalSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
        );
    };

    useEffect(() => {
        onSelectedDaysChange(internalSelectedDays);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [internalSelectedDays]);
    const days: DayOfWeek[] = Object.values(DayOfWeek);

    return (
        <div className="mt-6 space-y-4">
            <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={`w-[280px] justify-start text-left font-normal ${
                                !stDate && "text-muted-foreground"
                            }`}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {stDate ? format(stDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                            mode="single"
                            selected={stDate}
                            onSelect={(date) => {
                                setStDate(date);
                                onStartDateChange(date);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label>Repeat on</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`uppercase rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                                internalSelectedDays.includes(day)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                            aria-label={`Toggle ${day}`}
                            aria-pressed={internalSelectedDays.includes(day)}
                        >
                            {day[0]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
