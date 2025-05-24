// components/trainer/trainer-client-list.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useTrainerClients } from "@/hooks/use-trainer-clients";
import { format } from "date-fns";
import {
    BarChart,
    CalendarPlus,
    Edit,
    MoreVertical,
    Search,
    UserCheck,
    UserMinus
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ClientAssignment {
    assignment: {
        id: number;
        notes: string | null;
        assignedAt: string;
    };
    client: {
        id: number;
        name: string;
        email?: string;
        phoneNumber: string;
        plan: string;
    };
}

export function TrainerClientList() {
    const {
        clients,
        isLoadingClients,
        unassignClient,
        updateClientNotes,
    } = useTrainerClients();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<ClientAssignment | null>(null);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [clientNotes, setClientNotes] = useState("");
    const [confirmUnassignOpen, setConfirmUnassignOpen] = useState(false);

    // Filter clients based on search query
    const filteredClients = clients?.filter(client =>
        client.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.client.email && client.client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        client.client.phoneNumber.includes(searchQuery)
    );

    const handleEditNotes = (client: any) => {
        setSelectedClient(client);
        setClientNotes(client.assignment.notes || "");
        setIsEditingNotes(true);
    };

    const handleSaveNotes = async () => {
        if (!selectedClient) return;

        try {
            await updateClientNotes({
                assignmentId: selectedClient.assignment.id,
                notes: clientNotes,
            });

            setIsEditingNotes(false);
            setSelectedClient(null);
        } catch (error) {
            console.error("Error updating notes:", error);
        }
    };

    const handleUnassignClient = async () => {
        if (!selectedClient) return;

        try {
            await unassignClient(selectedClient.assignment.id);
            setConfirmUnassignOpen(false);
            setSelectedClient(null);
            toast({
                title: "Client Unassigned",
                description: "The client has been unassigned from you.",
            });
        } catch (error) {
            console.error("Error unassigning client:", error);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                    <UserCheck className="mr-2" /> My Clients
                </CardTitle>
                <CardDescription>
                    View and manage clients assigned to you
                </CardDescription>
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search clients..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingClients ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Assigned Since</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients && filteredClients.length > 0 ? (
                                    filteredClients.map((client) => (
                                        <TableRow key={client.client.id}>
                                            <TableCell className="font-medium">{client.client.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{client.client.phoneNumber}</span>
                                                    {client.client.email && <span className="text-sm text-muted-foreground">{client.client.email}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {client.assignment.assignedAt
                                                    ? format(new Date(client.assignment.assignedAt), "PPP")
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    client.client.plan === "premium" ? "default" :
                                                        client.client.plan === "pro" ? "secondary" : "outline"
                                                }>
                                                    {client.client.plan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {client.assignment.notes || "No notes"}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/trainer/clients/${client.client.id}`}>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                View Profile
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/trainer/clients/${client.client.id}/workouts`}>
                                                                <BarChart className="mr-2 h-4 w-4" />
                                                                View Progress
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/trainer/schedule?client=${client.client.id}`}>
                                                                <CalendarPlus className="mr-2 h-4 w-4" />
                                                                Schedule Session
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditNotes(client)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Notes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setSelectedClient(client as ClientAssignment);
                                                                setConfirmUnassignOpen(true);
                                                            }}
                                                        >
                                                            <UserMinus className="mr-2 h-4 w-4" />
                                                            Unassign Client
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            {searchQuery
                                                ? "No clients found matching your search."
                                                : "No clients assigned to you yet."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Edit Notes Dialog */}
            <Dialog open={isEditingNotes} onOpenChange={setIsEditingNotes}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Client Notes</DialogTitle>
                        <DialogDescription>
                            Update notes for {selectedClient?.client.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            value={clientNotes}
                            onChange={(e) => setClientNotes(e.target.value)}
                            placeholder="Enter notes about this client..."
                            className="min-h-[120px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditingNotes(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSaveNotes}>
                            Save Notes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Unassign Dialog */}
            <Dialog open={confirmUnassignOpen} onOpenChange={setConfirmUnassignOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Unassign</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to unassign {selectedClient?.client.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setConfirmUnassignOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleUnassignClient}>
                            Unassign Client
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}