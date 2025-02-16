"use client";

import { BulkImportDialog } from "../common/bulk-import-dialog";
import { NewMemberDialog } from "./new-member-dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

type MembershipPageProps = {
  members: {
    id: number;
    name: string;
    plan: string;
    status: string;
    joinDate: string;
  }[];
};

export const MembershipPage = ({ members }: MembershipPageProps) => {
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
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow
                                key={member.id}
                                className="hover:bg-purple-100 transition-colors"
                            >
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.plan}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            member.status === "Active"
                                                ? "bg-green-200 text-green-800"
                                                : member.status === "Inactive"
                                                    ? "bg-blue-200 text-blue-800"
                                                    : "bg-purple-200 text-purple-800"
                                        }`}
                                    >
                                        {member.status}
                                    </span>
                                </TableCell>
                                <TableCell>{member.joinDate}</TableCell>
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
