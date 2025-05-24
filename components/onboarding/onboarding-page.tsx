"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Calendar, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useQuery } from "@tanstack/react-query";

interface TrainingProgram {
    id: number;
    name: string;
    clientName: string;
    startDate: string;
    durationWeeks: number;
    status: string;
    workoutDays: number;
}

export default function OnboardingPage() {
    const [showWizard, setShowWizard] = useState(false);

    // Fetch recent programs
    const { data: recentPrograms = [] } = useQuery<TrainingProgram[]>({
        queryKey: ["recent-programs"],
        queryFn: async () => {
            // Mock data for now
            return [
                {
                    id: 1,
                    name: "Summer Fitness Challenge",
                    clientName: "John Doe",
                    startDate: "2024-01-15",
                    durationWeeks: 8,
                    status: "active",
                    workoutDays: 4,
                },
                {
                    id: 2,
                    name: "Strength Building Program",
                    clientName: "Jane Smith",
                    startDate: "2024-01-10",
                    durationWeeks: 12,
                    status: "active",
                    workoutDays: 5,
                },
                {
                    id: 3,
                    name: "Beginner Fitness Journey",
                    clientName: "Mike Johnson",
                    startDate: "2024-01-08",
                    durationWeeks: 6,
                    status: "completed",
                    workoutDays: 3,
                },
            ];
        },
    });

    const stats = {
        totalClients: 24,
        activePrograms: recentPrograms.filter(p => p.status === "active").length,
        completedPrograms: recentPrograms.filter(p => p.status === "completed").length,
        averageDuration: Math.round(recentPrograms.reduce((acc, p) => acc + p.durationWeeks, 0) / recentPrograms.length) || 0,
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold">Client Onboarding</h1>
                    <p className="text-muted-foreground">
                        Create personalized training programs for your clients
                    </p>
                </div>
                <Button 
                    onClick={() => setShowWizard(true)}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    Onboard New Client
                </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 text-white rounded-lg">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-900">{stats.totalClients}</div>
                                <div className="text-sm text-blue-700">Total Clients</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-600 text-white rounded-lg">
                                <Target className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-900">{stats.activePrograms}</div>
                                <div className="text-sm text-green-700">Active Programs</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-600 text-white rounded-lg">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-900">{stats.completedPrograms}</div>
                                <div className="text-sm text-purple-700">Completed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-600 text-white rounded-lg">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-900">{stats.averageDuration}w</div>
                                <div className="text-sm text-orange-700">Avg Duration</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Programs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Recent Programs</span>
                            <Badge variant="secondary">{recentPrograms.length} total</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentPrograms.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No programs yet</h3>
                                <p className="text-muted-foreground mb-6">
                                    Get started by onboarding your first client
                                </p>
                                <Button 
                                    onClick={() => setShowWizard(true)}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Onboard Your First Client
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentPrograms.map((program, index) => (
                                    <motion.div
                                        key={program.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold">{program.name}</h4>
                                                <Badge 
                                                    variant={program.status === "active" ? "default" : "secondary"}
                                                >
                                                    {program.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Client: {program.clientName} • {program.durationWeeks} weeks • {program.workoutDays} workout days/week
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">
                                                Started {new Date(program.startDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button 
                                variant="outline" 
                                className="h-auto p-6 flex-col gap-3"
                                onClick={() => setShowWizard(true)}
                            >
                                <Plus className="h-8 w-8 text-blue-600" />
                                <div className="text-center">
                                    <div className="font-semibold">New Program</div>
                                    <div className="text-sm text-muted-foreground">Start client onboarding</div>
                                </div>
                            </Button>
                            
                            <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                                <Users className="h-8 w-8 text-green-600" />
                                <div className="text-center">
                                    <div className="font-semibold">View Clients</div>
                                    <div className="text-sm text-muted-foreground">Manage existing clients</div>
                                </div>
                            </Button>
                            
                            <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                                <Calendar className="h-8 w-8 text-purple-600" />
                                <div className="text-center">
                                    <div className="font-semibold">Schedule</div>
                                    <div className="text-sm text-muted-foreground">View program timeline</div>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Onboarding Wizard */}
            {showWizard && (
                <OnboardingWizard onClose={() => setShowWizard(false)} />
            )}
        </div>
    );
}