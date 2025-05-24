// app/(protected)/trainer/dashboard/page.tsx
"use client";

import { TrainerClientList } from "@/components/trainer/trainer-client-list";
import { TrainerStats } from "@/components/trainer/trainer-stats";
import { TrainerTasks } from "@/components/trainer/trainer-tasks";
import { UpcomingSessionsWidget } from "@/components/trainer/upcoming-sessions-widget";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Activity, CalendarIcon, ListTodo, UsersRound } from "lucide-react";
import { useState } from "react";

export default function TrainerDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div
            className="container mx-auto p-4 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1
                className="text-3xl font-bold"
                variants={itemVariants}
            >
                Trainer Dashboard
            </motion.h1>

            <motion.div variants={itemVariants}>
                <Tabs
                    defaultValue="overview"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                >
                    <TabsList>
                        <TabsTrigger value="overview" className="gap-2">
                            <Activity className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="tasks" className="gap-2">
                            <ListTodo className="h-4 w-4" />
                            My Tasks
                        </TabsTrigger>
                        <TabsTrigger value="clients" className="gap-2">
                            <UsersRound className="h-4 w-4" />
                            My Clients
                        </TabsTrigger>
                        <TabsTrigger value="schedule" className="gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Schedule
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            variants={containerVariants}
                        >
                            <motion.div variants={itemVariants}>
                                <TrainerStats />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <UpcomingSessionsWidget />
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <TrainerTasks limit={5} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <TrainerClientList />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="tasks">
                        <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TrainerTasks showAll={true} />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="clients">
                        <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TrainerClientList />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="schedule">
                        <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold flex items-center">
                                        <CalendarIcon className="mr-2" /> My Schedule
                                    </CardTitle>
                                    <CardDescription>
                                        View and manage your upcoming sessions (Comming soon)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton
                                        className="h-40 w-full rounded-md"
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}