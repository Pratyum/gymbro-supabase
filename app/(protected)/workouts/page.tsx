import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CalendarIcon,
    DumbbellIcon,
    HistoryIcon,
    PlusIcon,
    PlayIcon,
    Timer,
} from "lucide-react";
import {
    formatDistanceToNow,
    parseISO,
    isAfter,
    format,
    addDays,
} from "date-fns";
import Link from "next/link";
import { getUser } from "@/actions/user";
import { getWorkoutSessionsForUser } from "@/actions/workout-session";
import { Badge } from "@/components/ui/badge";
import { WorkoutSessionWithPlan } from "@/types";

const formatWorkoutTime = (dateTimeString: string) => {
    const now = new Date();
    const workoutDate = parseISO(dateTimeString);

    if (isAfter(workoutDate, now)) {
        const timeUntil = formatDistanceToNow(workoutDate, { addSuffix: true });
        return `Starts ${timeUntil}`;
    } else {
        return format(workoutDate, "MMM d, yyyy 'at' h:mm a");
    }
};

const UpcomingWorkoutCard = ({ workout } : {workout: WorkoutSessionWithPlan}) => {
    return (<>
    
        <div className="flex items-center justify-between">
            <span className="font-medium">
                {workout.workoutPlan?.friendlyName}
            </span>
            <span className="text-sm text-gray-500">
                {workout.plannedAt  && formatWorkoutTime(workout.plannedAt.toISOString())}
            </span>
        </div>
        <div className="flex justify-between">
            <Badge variant="secondary">
                {workout.workoutPlan?.items.length} exercises
            </Badge>
            <Button variant="emerald" asChild className="flex gap-2">
                <Link href={`/workouts/${workout.id}`}>
                    Start now <Timer />
                </Link>
            </Button>
        </div>
    </>
    )
}

const workoutHistory = (now : Date) => [
    {
        id: 1,
        name: "Leg Day",
        date: format(addDays(now, -2), "yyyy-MM-dd"),
        duration: "45 min",
    },
    {
        id: 2,
        name: "Upper Body",
        date: format(addDays(now, -4), "yyyy-MM-dd"),
        duration: "50 min",
    },
    {
        id: 3,
        name: "Core Workout",
        date: format(addDays(now, -7), "yyyy-MM-dd"),
        duration: "30 min",
    },
];

export default async function WorkoutsOverview() {
    const now = new Date();
    const { dbUser } = await getUser();
    const { success, data: upcomingWorkouts } = await getWorkoutSessionsForUser(
        dbUser.id,
    );
    return (
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-800 mb-2">Workouts</h1>
                <p className="text-xl text-blue-600">
          Your personal fitness companion 🏋️‍♂️
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl text-blue-700">
                            <CalendarIcon className="mr-2" />
              Upcoming Workouts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {(upcomingWorkouts ?? []).map((workout) =>
                                workout.plannedAt ? (
                                    <li
                                        key={workout.id}
                                        className="flex flex-col bg-white/40 p-3 rounded-lg shadow-sm"
                                    >

                                        <UpcomingWorkoutCard key={workout.id} workout={workout} />
                                    </li>
                                ) : null,
                            )}
                        </ul>
                    </CardContent>
                </Card>

                <div className="col-span-full flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        className="bg-green-500 hover:bg-green-600 text-white flex-1 py-6 text-lg transition-transform hover:scale-105"
                    >
                        <Link href={`/workouts/plan`}>
                            <PlusIcon className="mr-2" />
              Plan Workout
                        </Link>
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white flex-1 py-6 text-lg transition-transform hover:scale-105">
                        <PlayIcon className="mr-2" />
            Start Upcoming Workouts
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl text-blue-700">
                            <HistoryIcon className="mr-2" />
              Workout History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {workoutHistory(now).map((workout) => (
                                <li
                                    key={workout.id}
                                    className="flex items-center justify-between bg-slate/40 hover:bg-slate/60 p-3 rounded-lg shadow-sm"
                                >
                                    <span className="font-medium">{workout.name}</span>
                                    <span className="text-sm text-gray-500">
                                        {workout.date} • {workout.duration}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl text-blue-700">
                            <DumbbellIcon className="mr-2" />
              Quick Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <p className="text-3xl font-bold text-blue-700">12</p>
                                <p className="text-sm text-blue-600">Workouts This Month</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg">
                                <p className="text-3xl font-bold text-green-700">5h 30m</p>
                                <p className="text-sm text-green-600">Total Active Time</p>
                            </div>
                            <div className="bg-purple-100 p-4 rounded-lg">
                                <p className="text-3xl font-bold text-purple-700">3</p>
                                <p className="text-sm text-purple-600">Streak (days)</p>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-lg">
                                <p className="text-3xl font-bold text-yellow-700">85%</p>
                                <p className="text-sm text-yellow-600">Goal Completion</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
