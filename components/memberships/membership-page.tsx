"use client";

import { useQuery } from "@tanstack/react-query";
import { BulkImportDialog } from "../common/bulk-import-dialog";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { NewMemberDialog } from "./new-member-dialog";

type MembershipPageProps = {
    members: {
        id: number;
        name: string;
        plan: string;
        email: string | null;
        phoneNumber: string | null;
    }[];
};

export const MembershipPage = ({ members }: MembershipPageProps) => {
    const { data, isLoading } = useQuery<MembershipPageProps["members"]>({
        queryKey: ["members"],
        queryFn: async () => {
            const res = await fetch("/api/members");
            if (!res.ok) {
                throw new Error("Failed to fetch members");
            }
            const result = await res.json();
            return result?.data??[];
        },
        initialData: members,
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <Card className="bg-white/30">
                <CardHeader className="flex flex-col lg:flex-row items-center justify-between">
                    <div>
                        <CardTitle>Membership Management</CardTitle>
                        <CardDescription>View and manage gym members</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <NewMemberDialog />
                        <BulkImportDialog />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table className="rounded-md border bg-white bg-opacity-50 backdrop-blur-lg overflow-hidden">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <Skeleton className="w-full h-6" />
                            <Skeleton className="w-full h-6" />
                            <Skeleton className="w-full h-6" />
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white/30">
            <CardHeader className="flex flex-col lg:flex-row items-center justify-between">
                <div>
                    <CardTitle>Membership Management</CardTitle>
                    <CardDescription>View and manage gym members</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                    <NewMemberDialog />
                    <BulkImportDialog />
                </div>
            </CardHeader>
            <CardContent>
                <Table className="rounded-md border bg-white bg-opacity-50 backdrop-blur-lg overflow-hidden">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((member) => (
                            <TableRow
                                key={member.id}
                                className="hover:bg-purple-100 transition-colors"
                            >
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.plan}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.phoneNumber}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
