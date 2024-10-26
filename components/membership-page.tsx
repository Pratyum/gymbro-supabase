"use client";

import { BulkImportDialog } from "./bulk-import-dialog";
import { NewMemberDialog } from "./new-member-dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Button } from "./ui/button";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
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
        <Table>
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
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.plan}</TableCell>
                <TableCell>{member.status}</TableCell>
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
