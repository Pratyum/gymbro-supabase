"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

type Client = {
    id: number;
    name: string;
    email: string | null;
    phoneNumber: string;
    role: string;
};

type Trainer = {
    id: number;
    name: string;
    email: string | null;
    phoneNumber: string;
};

export function ClientAssignmentDialog({
    onAssignSuccess,
    clientId,
    clientName
}: {
    onAssignSuccess?: () => void;
    clientId?: number;
    clientName?: string;
}) {
    const [open, setOpen] = useState(false);
    const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
    const [selectedClientId, setSelectedClientId] = useState<string>(
        clientId ? clientId.toString() : ""
    );
    const [notes, setNotes] = useState("");

    const queryClient = useQueryClient();

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setSelectedTrainerId("");
            setNotes("");
            if (!clientId) {
                setSelectedClientId("");
            }
        }
    }, [open, clientId]);

    // Fetch trainers
    const {
        data: trainers,
        isLoading: isLoadingTrainers,
    } = useQuery({
        queryKey: ["trainers"],
        queryFn: async () => {
            const response = await fetch("/api/trainers");
            if (!response.ok) {
                throw new Error("Failed to fetch trainers");
            }
            const data = await response.json();
            return data.data as Trainer[];
        },
        enabled: open,
    });

    // Fetch unassigned clients if clientId is not provided
    const {
        data: clients,
        isLoading: isLoadingClients,
    } = useQuery({
        queryKey: ["unassigned-clients"],
        queryFn: async () => {
            const response = await fetch("/api/clients/unassigned");
            if (!response.ok) {
                throw new Error("Failed to fetch unassigned clients");
            }
            const data = await response.json();
            return data.data as Client[];
        },
        enabled: open && !clientId,
    });

    // Assign client mutation
    const assignClientMutation = useMutation({
        mutationFn: async () => {
            const clientId = parseInt(selectedClientId, 10);
            const trainerId = parseInt(selectedTrainerId, 10);

            if (isNaN(clientId) || isNaN(trainerId)) {
                throw new Error("Invalid client or trainer ID");
            }
            const response = await fetch("/api/trainer-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clientId,
                    trainerId,
                    notes: notes || undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to assign client");
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Client assigned successfully",
            });
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["trainer-clients"] });
            queryClient.invalidateQueries({ queryKey: ["unassigned-clients"] });
            if (onAssignSuccess) {
                onAssignSuccess();
            }
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTrainerId || !selectedClientId) {
            toast({
                title: "Error",
                description: "Please select both client and trainer",
                variant: "destructive",
            });
            return;
        }
        assignClientMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Assign to Trainer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Client to Trainer</DialogTitle>
                    <DialogDescription>
                        Link a client with a trainer to manage their workouts and progress.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {!clientId && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="client" className="text-right">
                                    Client
                                </Label>
                                <div className="col-span-3">
                                    <Select
                                        value={selectedClientId}
                                        onValueChange={setSelectedClientId}
                                        disabled={isLoadingClients || !!clientId}
                                    >
                                        <SelectTrigger id="client">
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients?.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {clientId && clientName && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Client</Label>
                                <Input
                                    className="col-span-3"
                                    value={clientName}
                                    disabled
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="trainer" className="text-right">
                                Trainer
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={selectedTrainerId}
                                    onValueChange={setSelectedTrainerId}
                                    disabled={isLoadingTrainers}
                                >
                                    <SelectTrigger id="trainer">
                                        <SelectValue placeholder="Select trainer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trainers?.map((trainer) => (
                                            <SelectItem key={trainer.id} value={trainer.id.toString()}>
                                                {trainer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Optional notes about this assignment"
                                className="col-span-3"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={assignClientMutation.isPending || !selectedTrainerId || (!selectedClientId && !clientId)}
                        >
                            {assignClientMutation.isPending ? "Assigning..." : "Assign Client"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}