"use client";

import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CalendarDays,
    DollarSign,
    Users,
    Activity,
    BarChart as BarChartIcon,
} from "lucide-react";
import { MembershipPage } from "@/components/membership-page";
import { members } from "@/components/constants/memberships";
import TrainerPage from "@/components/trainer-page";

// Simulated data
const revenueData = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 1700 },
    { name: "Mar", total: 2000 },
    { name: "Apr", total: 2200 },
    { name: "May", total: 2400 },
    { name: "Jun", total: 2600 },
];

const membershipData = [
    { name: "Jan", active: 100, new: 20 },
    { name: "Feb", active: 110, new: 22 },
    { name: "Mar", active: 120, new: 25 },
    { name: "Apr", active: 130, new: 28 },
    { name: "May", active: 140, new: 30 },
    { name: "Jun", active: 150, new: 32 },
];

export default function GymAdminDashboard() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Gym CRM Dashboard</h1>
            <Tabs defaultValue="dashboard" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="dashboard">
                        <BarChartIcon className="mr-2 h-4 w-4" />
            Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="members">
                        <Users className="mr-2 h-4 w-4" />
            Members
                    </TabsTrigger>
                    <TabsTrigger value="trainers">
                        <Users className="mr-2 h-4 w-4" />
            Trainers
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                  Total Revenue
                                </CardTitle>
                                <DollarSign className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$12,400</div>
                                <p className="text-xs">+15% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                  Active Members
                                </CardTitle>
                                <Users className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">150</div>
                                <p className="text-xs">+10 new this month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                  Avg. Daily Check-ins
                                </CardTitle>
                                <Activity className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">45</div>
                                <p className="text-xs">+5% from last week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                  Retention Rate
                                </CardTitle>
                                <CalendarDays className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">85%</div>
                                <p className="text-xs">+2% from last quarter</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Revenue Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer
                                    config={{
                                        total: {
                                            label: "Revenue",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                    className="h-[200px] w-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={revenueData}>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar
                                                dataKey="total"
                                                fill="var(--color-total)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Membership Growth</CardTitle>
                                <CardDescription>Active vs New Members</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ChartContainer
                                    config={{
                                        active: {
                                            label: "Active Members",
                                            color: "hsl(var(--chart-1))",
                                        },
                                        new: {
                                            label: "New Members",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                    className="h-[200px] w-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={membershipData}>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Line
                                                type="monotone"
                                                dataKey="active"
                                                stroke="var(--color-active)"
                                                strokeWidth={2}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="new"
                                                stroke="var(--color-new)"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="members">
                    <MembershipPage members={members} />
                </TabsContent>
                <TabsContent value="trainers">
                    <TrainerPage />
                </TabsContent>
            </Tabs>
        </div>
    );
}
