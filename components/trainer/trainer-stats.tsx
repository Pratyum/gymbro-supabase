// components/trainer/trainer-stats.tsx
"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    BarChart,
    Calendar,
    CheckSquare,
    TrendingUp,
    UsersRound
} from "lucide-react";

type TrainerStats = {
    totalClients: number;
    activeClients: number;
    sessionStats: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        completed: number;
        upcoming: number;
    };
    completionRate: number;
    tasksStats: {
        pending: number;
        inProgress: number;
        completed: number;
        total: number;
    };
};

export function TrainerStats() {
    // Fetch trainer stats
    const { data: stats, isLoading } = useQuery({
        queryKey: ["trainer-stats"],
        queryFn: async () => {
            const response = await fetch("/api/trainer/stats");
            if (!response.ok) {
                throw new Error("Failed to fetch trainer stats");
            }
            const data = await response.json();
            return data.data as TrainerStats;
        },
    });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
            }
        })
    };

    const statCards = [
        {
            title: "Total Clients",
            value: stats?.totalClients || 0,
            description: `${stats?.activeClients || 0} currently active`,
            icon: <UsersRound className="h-5 w-5 text-blue-600" />,
            color: "bg-blue-100 text-blue-800",
        },
        {
            title: "Today's Sessions",
            value: stats?.sessionStats.today || 0,
            description: `${stats?.sessionStats.upcoming || 0} upcoming`,
            icon: <Calendar className="h-5 w-5 text-purple-600" />,
            color: "bg-purple-100 text-purple-800",
        },
        {
            title: "Completion Rate",
            value: `${stats?.completionRate || 0}%`,
            description: `${stats?.sessionStats.completed || 0} completed`,
            icon: <BarChart className="h-5 w-5 text-green-600" />,
            color: "bg-green-100 text-green-800",
        },
        {
            title: "Pending Tasks",
            value: stats?.tasksStats.pending || 0,
            description: `${stats?.tasksStats.total || 0} total tasks`,
            icon: <CheckSquare className="h-5 w-5 text-amber-600" />,
            color: "bg-amber-100 text-amber-800",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                    <TrendingUp className="mr-2" /> Performance Overview
                </CardTitle>
                <CardDescription>
                    Your trainer activity and performance metrics
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        // Loading skeleton
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-lg border">
                                <Skeleton className="h-5 w-24 mb-2" />
                                <Skeleton className="h-8 w-16 mb-1" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        ))
                    ) : (
                        // Stat cards
                        statCards.map((stat, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={variants}
                                className={`p-4 rounded-lg border ${stat.color} flex flex-col`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">{stat.title}</h3>
                                    {stat.icon}
                                </div>
                                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                                <p className="text-xs opacity-80">{stat.description}</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}