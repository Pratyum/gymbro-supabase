"use client";

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
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Calendar, DollarSign, Star, Users } from "lucide-react";
import { AddTrainerDialog } from "./add-trainer-form";
type TrainerPageProps = {
    trainers: {
        id: number;
        name: string;
        email: string | null;
        phoneNumber: string | null;
    }[];
};
export default function TrainerPage({ trainers }: TrainerPageProps) {
    const {data , isLoading} = useQuery<TrainerPageProps["trainers"]>({
        queryKey: ["trainers"],
        queryFn: async () => {
            const res = await fetch("/api/trainers");
            if (!res.ok) {
                throw new Error("Failed to fetch trainers");
            }
            const result = await res.json();
            return result?.data??[];
        },
        initialData: trainers,
        refetchOnWindowFocus: false,
    })
    const renderStats = ({ totalClients, totalSessions, totalRevenue, averageRating}:{
        totalClients: number;
        totalSessions: number;
        totalRevenue: number;
        averageRating: number;
    }) => {
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
    }
    return (
        <>
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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone Number</TableHead>
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
                                {isLoading && <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>}
                                {!isLoading && data.map((trainer) => (
                                    <TableRow key={trainer.id}>
                                        <TableCell className="font-medium">
                                            {trainer.name}
                                        </TableCell>
                                        <TableCell>{trainer.email}</TableCell>
                                        <TableCell>{trainer.phoneNumber}</TableCell>
                                        {/* <TableCell>{trainer.specialty}</TableCell>
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
                                        </TableCell> */}
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
