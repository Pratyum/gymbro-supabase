// hooks/use-invite.tsx
'use client';

import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type InviteUserParams = {
    email: string;
    phone_number: string;
    name: string;
    role: "admin" | "trainer" | "member";
};

export function useInvite() {
    const queryClient = useQueryClient();

    const inviteMutation = useMutation({
        mutationFn: async (params: InviteUserParams) => {
            const response = await fetch('/api/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to send invitation");
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Invitation sent successfully",
                description: "The user will receive an email with instructions to join.",
            });

            // Invalidate relevant queries to refresh the UI
            queryClient.invalidateQueries({ queryKey: ["members"] });
            queryClient.invalidateQueries({ queryKey: ["trainers"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Failed to send invitation",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return {
        inviteUser: inviteMutation.mutateAsync,
        isInviting: inviteMutation.isPending,
        inviteError: inviteMutation.error,
    };
}