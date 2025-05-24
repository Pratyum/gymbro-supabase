'use client';

import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { SelectOrganization, SelectUser } from "@/utils/db/schema";
import { useOrganizations } from "@/hooks/use-organizations";
import { queryClient } from "@/app/queryClient";

type UserContextType = {
  supabaseUser: User | null;
  apiUser: SelectUser | undefined;
  isLoading: boolean;
  updateProfile: (profile: Partial<SelectUser>) => Promise<SelectUser>;
  error: Error | null;

  organizations: SelectOrganization[] | undefined;
  isOrganizationLoading: boolean;
  updateOrganization: (
    organization: Partial<SelectOrganization>,
  ) => Promise<SelectOrganization>;
  currentOrganizationId: number;
  setCurrentOrganization: (organizationId: number) => void;
  organizationError: Error | null;
};

const UserContext = createContext<UserContextType>({
    supabaseUser: null,
    apiUser: undefined,
    isLoading: false,
    error: null,
    organizations: [],
    isOrganizationLoading: false,
    updateProfile: async () => {
        throw new Error("updateProfile function not yet initialized");
    },
    updateOrganization: async () => {
        throw new Error("updateOrganization function not yet initialized");
    },
    currentOrganizationId: 0,
    setCurrentOrganization: () => {
        throw new Error("setCurrentOrganization function not yet initialized");
    },
    organizationError: null,
});

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    // State to hold the Supabase client user,
    // since getting it might be async in Supabase v2.
    const [supabaseUser, setSupabaseUser] = useState<User | null>(null);

    const supabase = createClient();

    useEffect(() => {
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setSupabaseUser(user);
        })();
    }, [supabase.auth]);


    const {
        mutateAsync: updateProfile,
    } = useMutation({
        mutationKey: ["updateProfile"],
        mutationFn: async (profile: Partial<SelectUser>) => {
            const response = await fetch("/api/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });
            if (!response.ok) {
                throw new Error("Failed to update user profile");
            }
            const data = await response.json();
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData<SelectUser>(["me"], data);
        },
    })

    // Fetch additional user data from the `/me` endpoint via tanstack query
    const {
        data: apiUser,
        isLoading,
        error,
    } = useQuery<SelectUser>({
        queryKey: ["me"],
        queryFn: async () => {
            const response = await fetch("/api/me");
            if (!response.ok) {
                throw new Error("Failed to fetch API user data");
            }
            const data = await response.json();
            if (!data?.dbUser) return null;
            return {
                ...data.dbUser,
            };
        },
    });

    const {
        organizations,
        isOrganizationLoading,
        updateOrganization,
        currentOrganizationId,
        setCurrentOrganization,
        error: organizationError,
    } = useOrganizations();

    const value = {
        supabaseUser,
        apiUser,
        isLoading,
        error: error as Error | null,
        organizations,
        isOrganizationLoading,
        updateOrganization,
        currentOrganizationId,
        setCurrentOrganization,
        updateProfile,
        organizationError: organizationError as Error | null,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
