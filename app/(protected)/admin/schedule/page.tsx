"use client";

import { Suspense, useMemo, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    CalendarCurrentDate,
    CalendarDayView,
    CalendarEvent,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarWeekView,
    CalendarYearView,
} from "@/components/ui/full-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { events } from "@/components/constants/events";

// Define the Appointment type based on your schema
type Appointment = {
  id: number;
  userId: number;
  trainerId: number | null;
  date: string;
  time: string;
  notes: string | null;
};

// Function to fetch appointments from your API
const fetchAppointments = async (): Promise<Appointment[]> => {
    const response = await fetch("/api/appointments");
    if (!response.ok) {
        throw new Error("Failed to fetch appointments");
    }
    return response.json();
};

export default function AppointmentsCalendar() {
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

    const handleSelectEvent = (event: { resource: CalendarEvent }) => {
        setSelectedAppointmentId(event.resource.id);
    };
    const selectedAppointment = useMemo(() => {
        if (!selectedAppointmentId) return null;
        return events.find((event) => event.id === selectedAppointmentId);
    }, [selectedAppointmentId]);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Appointments Calendar</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Appointments Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                    <Calendar
                        events={events}
                        onEventClick={(event) => handleSelectEvent({ resource: event })}
                    >
                        <div className="h-dvh py-6 flex flex-col">
                            <div className="flex px-6 items-center gap-2 mb-6">
                                <CalendarViewTrigger
                                    className="aria-[current=true]:bg-accent"
                                    view="day"
                                >
                  Day
                                </CalendarViewTrigger>
                                {/* <CalendarViewTrigger
                  view="3-day"
                  className="aria-[current=true]:bg-accent"
                >
                  3-day
                </CalendarViewTrigger>
                <CalendarViewTrigger
                  view="5-day"
                  className="aria-[current=true]:bg-accent"
                >
                  5-day
                </CalendarViewTrigger> */}
                                <CalendarViewTrigger
                                    view="week"
                                    className="aria-[current=true]:bg-accent"
                                >
                  Week
                                </CalendarViewTrigger>
                                <CalendarViewTrigger
                                    view="month"
                                    className="aria-[current=true]:bg-accent"
                                >
                  Month
                                </CalendarViewTrigger>
                                <CalendarViewTrigger
                                    view="year"
                                    className="aria-[current=true]:bg-accent"
                                >
                  Year
                                </CalendarViewTrigger>

                                <span className="flex-1" />
                                <Suspense fallback={<div>Loading...</div>}>
                                    <CalendarCurrentDate />
                                </Suspense>

                                <CalendarPrevTrigger>
                                    <ChevronLeft size={20} />
                                    <span className="sr-only">Previous</span>
                                </CalendarPrevTrigger>

                                <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                                <CalendarNextTrigger>
                                    <ChevronRight size={20} />
                                    <span className="sr-only">Next</span>
                                </CalendarNextTrigger>
                            </div>

                            <div className="flex-1 overflow-auto px-6 relative">
                                <CalendarDayView />
                                <CalendarWeekView />
                                <CalendarMonthView />
                                <CalendarYearView />
                            </div>
                        </div>
                    </Calendar>
                </CardContent>
            </Card>

            <Dialog
                open={!!selectedAppointment}
                onOpenChange={() => setSelectedAppointmentId(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Appointment Details</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                        <div className="mt-4">
                            <pre>{JSON.stringify(selectedAppointment, null, 2)}</pre>
                        </div>
                    )}
                    <Button onClick={() => setSelectedAppointmentId(null)}>Close</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
