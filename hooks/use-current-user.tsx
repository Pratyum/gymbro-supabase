// hooks/use-current-user.tsx
"use client";

import { AuthContext } from "@/components/providers/auth-provider";
import { useContext } from "react";

export function useCurrentUser() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useCurrentUser must be used within an AuthProvider");
    }

    return context;
}