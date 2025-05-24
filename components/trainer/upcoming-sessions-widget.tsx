// components/trainer/upcoming-sessions-widget.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Calendar,
    Clock,
    MapPin,
    UserRound
} from "lucide-react";
import Link from "next/link";

type Session = {
    id: number;
    title: string;
    start: string;
    end: string;
    clientId: number;
    clientName: string;
    location?: string;
    status: "scheduled" | "confirmed" | "canceled" | "completed";
};

export function UpcomingSessionsWidget() {
    // Fetch upcoming sessions
    const { data: sessions, isLoading } = useQuery({
        queryKey: ["trainer-upcoming-sessions"],
        queryFn: async () => {
            const response = await fetch("/api/trainer/sessions/upcoming");
            if (!response.ok) {
                throw new Error("Failed to fetch upcoming sessions");
            }
            const data = await response.json();
            return data.data as Session[];
        },
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return `Today at ${format(date, "h:mm a")}`;
        } else if (isTomorrow(date)) {
            return `Tomorrow at ${format(date, "h:mm a")}`;
        } else {
            return format(date, "EEE, MMM d 'at' h:mm a");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
        case "scheduled":
            return <Badge variant="outline">Scheduled</Badge>;
        case "confirmed":
            return <Badge variant="secondary">Confirmed</Badge>;
        case "canceled":
            return <Badge variant="destructive">Canceled</Badge>;
        case "completed":
            return <Badge variant="default">Completed</Badge>;
        default:
            return null;
        }
    };

    const getTimeUntil = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return `In ${formatDistanceToNow(date, { addSuffix: false })}`;
        }
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                    <Calendar className="mr-2" /> Upcoming Sessions
                </CardTitle>
                <CardDescription>
                    Your scheduled training sessions
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4 p-3 border rounded-lg">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sessions && sessions.length > 0 ? (
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {sessions.map((session, index) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                className={`flex p-4 rounded-lg border ${isToday(new Date(session.start))
                                    ? "border-blue-200 bg-blue-50"
                                    : "border-gray-200"
                                }`}
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-medium">{session.title}</h3>
                                        {getStatusBadge(session.status)}
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{formatDate(session.start)}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <UserRound className="h-3.5 w-3.5" />
                                            <span>{session.clientName}</span>
                                        </div>

                                        {session.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span>{session.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="ml-4 flex flex-col items-end justify-between">
                                    <Badge variant="outline" className="text-xs">
                                        {getTimeUntil(session.start)}
                                    </Badge>

                                    <Link href={`/trainer/sessions/${session.id}`}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="View details">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No upcoming sessions scheduled.
                    </div>
                )}
            </CardContent>

            {sessions && sessions.length > 0 && (
                <CardFooter>
                    <Button variant="link" asChild className="w-full">
                        <Link href="/trainer/schedule">View Full Schedule</Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}