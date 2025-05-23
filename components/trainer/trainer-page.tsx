"use client";

import { Button } from "@/components/ui/button";
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
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
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
