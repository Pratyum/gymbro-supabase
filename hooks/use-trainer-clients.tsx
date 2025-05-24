// hooks/use-trainer-clients.tsx
"use client";

import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type TrainerClient = {
    assignment: {
        id: number;
        trainerId: number;
        clientId: number;
        assignedAt: string;
        notes: string | null;
    };
    client: {
        id: number;
        name: string;
        phoneNumber: string;
        email: string | null;
        plan: string;
        role: string;
    };
};

export function useTrainerClients() {
    const queryClient = useQueryClient();
    const [isAssigningClient, setIsAssigningClient] = useState(false);

    // Fetch clients assigned to the trainer
    const {
        data: clients,
        isLoading: isLoadingClients,
        error: clientsError,
    } = useQuery({
        queryKey: ["trainer-clients"],
        queryFn: async () => {
            const response = await fetch("/api/trainer-client", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch clients");
            }

            const data = await response.json();
            return data.data as TrainerClient[];
        },
    });

    // Fetch all trainers for assignment
    const {
        data: trainers,
        isLoading: isLoadingTrainers,
    } = useQuery({
        queryKey: ["trainers"],
        queryFn: async () => {
            const response = await fetch("/api/trainers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch trainers");
            }

            const data = await response.json();
            return data.data;
        },
        enabled: isAssigningClient,
    });

    // Assign client to trainer mutation
    const assignClientMutation = useMutation({
        mutationFn: async ({
            clientId,
            notes,
        }: {
            clientId: number;
            notes?: string;
        }) => {
            const response = await fetch("/api/trainer-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ clientId, notes }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to assign client");
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Client assigned successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["trainer-clients"] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to assign client",
                variant: "destructive",
            });
        },
    });

    // Unassign client mutation
    const unassignClientMutation = useMutation({
        mutationFn: async (assignmentId: number) => {
            const response = await fetch(`/api/trainer-client/${assignmentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to unassign client");
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Client unassigned successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["trainer-clients"] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to unassign client",
                variant: "destructive",
            });
        },
    });

    // Update client notes mutation
    const updateClientNotesMutation = useMutation({
        mutationFn: async ({
            assignmentId,
            notes,
        }: {
            assignmentId: number;
            notes: string;
        }) => {
            const response = await fetch(`/api/trainer-client/${assignmentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notes }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to update notes");
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Client notes updated successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["trainer-clients"] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update notes",
                variant: "destructive",
            });
        },
    });

    return {
        clients,
        isLoadingClients,
        clientsError,
        trainers,
        isLoadingTrainers,
        isAssigningClient,
        setIsAssigningClient,
        assignClient: assignClientMutation.mutateAsync,
        unassignClient: unassignClientMutation.mutateAsync,
        updateClientNotes: updateClientNotesMutation.mutateAsync,
    };
}