import { SelectOrganization } from "@/utils/db/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useOrganizations = () => {
    const {data: organizations , isLoading: isOrganizationLoading, error, refetch: refetchOrganizations} = useQuery({
        queryKey: ["organizations"],
        queryFn: async () => {
            const response = await fetch("/api/organizations")
            const {success, organizations} = await response.json();
            console.log('organizations', organizations);
            if(!success) throw new Error("Failed to fetch organizations");
            return organizations as SelectOrganization[];
        },
    });

    const [currentOrganizationId, setCurrentOrganizationId] = useState<number>(0);


    const {mutateAsync: updateOrganization} = useMutation({
        mutationKey: ["organizations"],
        mutationFn: async (payload: Partial<SelectOrganization>) => {
            const response = await fetch("/api/organizations", {
                method: "PATCH",
                body: JSON.stringify(payload),
            });
            return response.json() as Promise<SelectOrganization>;
        },
        onSuccess: () => {
            refetchOrganizations();
        }
    });


    const setCurrentOrganization = (organizationId: number) => {
        localStorage.setItem("currentOrganizationId", organizationId.toString());
        setCurrentOrganizationId(organizationId);
    }

    useEffect(() => {
        const organizationId = localStorage.getItem("currentOrganizationId");
        setCurrentOrganization(organizationId ? parseInt(organizationId) : organizations?.[0]?.id ??0);
    }, [organizations]);


    return {
        organizations,
        isOrganizationLoading,
        updateOrganization,
        currentOrganizationId,
        setCurrentOrganization,
        error
    }
}