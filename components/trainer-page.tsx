"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Users, Calendar, ArrowUpDown } from "lucide-react";
import { DollarSign, Star, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTrainerDialog } from "./add-trainer-form";

export default function TrainerPage() {
    const [trainers, setTrainers] = useState([
        {
            id: 1,
            name: "John Doe",
            specialty: "Strength",
            clients: 15,
            sessions: 45,
            revenue: 2250,
            rating: 4.8,
        },
        {
            id: 2,
            name: "Jane Smith",
            specialty: "Yoga",
            clients: 20,
            sessions: 60,
            revenue: 3000,
            rating: 4.9,
        },
        {
            id: 3,
            name: "Mike Johnson",
            specialty: "Cardio",
            clients: 12,
            sessions: 36,
            revenue: 1800,
            rating: 4.7,
        },
        {
            id: 4,
            name: "Emily Brown",
            specialty: "Pilates",
            clients: 18,
            sessions: 54,
            revenue: 2700,
            rating: 4.6,
        },
        {
            id: 5,
            name: "Chris Lee",
            specialty: "CrossFit",
            clients: 22,
            sessions: 66,
            revenue: 3300,
            rating: 4.9,
        },
    ]);

    const totalClients = trainers.reduce(
        (sum, trainer) => sum + trainer.clients,
        0,
    );
    const totalSessions = trainers.reduce(
        (sum, trainer) => sum + trainer.sessions,
        0,
    );
    const totalRevenue = trainers.reduce(
        (sum, trainer) => sum + trainer.revenue,
        0,
    );
    const averageRating = (
        trainers.reduce((sum, trainer) => sum + trainer.rating, 0) / trainers.length
    ).toFixed(2);

    return (
        <>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-blue-100 border-blue-300 border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-blue-800">
                Total Clients
                            </CardTitle>
                            <Users className="w-4 h-4 text-blue-800" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-800">
                                {totalClients}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-100 border-green-300 border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-green-800">
                Total Sessions
                            </CardTitle>
                            <Calendar className="w-4 h-4 text-green-800" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-800">
                                {totalSessions}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-100 border-yellow-300 border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-yellow-800">
                Total Revenue
                            </CardTitle>
                            <DollarSign className="w-4 h-4 text-yellow-800" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-800">
                ${totalRevenue}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-100 border-purple-300 border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-purple-800">
                Average Rating
                            </CardTitle>
                            <Star className="w-4 h-4 text-purple-800" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-800">
                                {averageRating}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Trainer Table */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <Input className="max-w-xs" placeholder="Search trainers..." />
                        <AddTrainerDialog />
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Specialty</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                      Clients
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                      Sessions
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                      Revenue
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                      Rating
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainers.map((trainer) => (
                                    <TableRow key={trainer.id}>
                                        <TableCell className="font-medium">
                                            {trainer.name}
                                        </TableCell>
                                        <TableCell>{trainer.specialty}</TableCell>
                                        <TableCell>{trainer.clients}</TableCell>
                                        <TableCell>{trainer.sessions}</TableCell>
                                        <TableCell>${trainer.revenue}</TableCell>
                                        <TableCell>{trainer.rating}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit trainer</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                            Delete trainer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}
