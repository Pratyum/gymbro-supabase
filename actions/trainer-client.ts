"use server";

import { db } from "@/utils/db/db";
import { trainerClients, usersTable } from "@/utils/db/schema";
import { and, eq, inArray, not } from "drizzle-orm";
import { getUser } from "./user";

// Get all clients for a trainer
export async function getTrainerClients(trainerId?: number) {
    try {
        const { dbUser } = await getUser();
        const trainerIdToUse = trainerId || dbUser.id;

        // Ensure user can access this trainer's data
        if (trainerId && trainerId !== dbUser.id && dbUser.role !== "admin") {
            return { success: false, message: "Unauthorized access" };
        }

        // Get all clients for the trainer
        const assignments = await db
            .select({
                assignment: trainerClients,
                client: usersTable,
            })
            .from(trainerClients)
            .where(eq(trainerClients.trainerId, trainerIdToUse))
            .innerJoin(usersTable, eq(trainerClients.clientId, usersTable.id));

        return { success: true, data: assignments };
    } catch (error) {
        console.error("Failed to get trainer clients:", error);
        return { success: false, message: "Failed to get trainer clients" };
    }
}

// Get all trainers (for client assignment)
export async function getAllTrainers() {
    try {
        // Get trainers
        const trainers = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.role, "trainer"));

        return { success: true, data: trainers };
    } catch (error) {
        console.error("Failed to get trainers:", error);
        return { success: false, message: "Failed to get trainers" };
    }
}

// Get all clients without a trainer
export async function getUnassignedClients() {
    try {
        const { dbUser } = await getUser();
        
        // Ensure user has access to organization clients
        if (!dbUser.organizationId && dbUser.role !== "admin") {
            return { success: false, message: "No organization access" };
        }

        // Get clients that are not in trainer_clients table
        const clientsWithTrainers = await db
            .select({ clientId: trainerClients.clientId })
            .from(trainerClients);

        const clientIds = clientsWithTrainers.map(c => c.clientId).filter(Boolean) as number[];

        const whereConditions = [
            eq(usersTable.role, "member"),
            ...(dbUser.organizationId ? [eq(usersTable.organizationId, dbUser.organizationId)] : []),
            ...(clientIds.length > 0 ? [not(inArray(usersTable.id, clientIds))] : [])
        ];

        const unassignedClients = await db
            .select()
            .from(usersTable)
            .where(and(...whereConditions));

        return { success: true, data: unassignedClients };
    } catch (error) {
        console.error("Failed to get unassigned clients:", error);
        return { success: false, message: "Failed to get unassigned clients" };
    }
}

// Assign client to trainer
export async function assignClientToTrainer(
    clientId: number,
    trainerId: number,
    notes?: string
) {
    try {
        // Validate trainer and client exist and have correct roles
        const [trainer, client] = await Promise.all([
            db.select().from(usersTable).where(and(
                eq(usersTable.id, trainerId),
                eq(usersTable.role, "trainer")
            )),
            db.select().from(usersTable).where(and(
                eq(usersTable.id, clientId),
                eq(usersTable.role, "member")
            ))
        ]);

        if (!trainer.length) {
            return { success: false, message: "Trainer not found" };
        }
        if (!client.length) {
            return { success: false, message: "Client not found" };
        }
        // Check if assignment already exists
        const existingAssignment = await db
            .select()
            .from(trainerClients)
            .where(and(
                eq(trainerClients.trainerId, trainerId),
                eq(trainerClients.clientId, clientId)
            ));

        if (existingAssignment.length) {
            return { success: false, message: "Client already assigned to this trainer" };
        }

        // Create assignment
        const assignment = await db
            .insert(trainerClients)
            .values({
                trainerId,
                clientId,
                notes,
            })
            .returning();

        return { success: true, data: assignment[0] };
    } catch (error) {
        console.error("Failed to assign client:", error);
        return { success: false, message: "Failed to assign client" };
    }
}

// Unassign client from trainer
export async function unassignClient(assignmentId: number) {
    try {
        const { dbUser } = await getUser();

        // Get the assignment to check ownership
        const assignment = await db
            .select()
            .from(trainerClients)
            .where(eq(trainerClients.id, assignmentId));

        if (!assignment.length) {
            return { success: false, message: "Assignment not found" };
        }

        // Check if user has permission to delete this assignment
        if (dbUser.role !== "admin" &&
            dbUser.id !== assignment[0].trainerId &&
            dbUser.id !== assignment[0].clientId) {
            return { success: false, message: "Unauthorized" };
        }
        // Delete assignment
        await db
            .delete(trainerClients)
            .where(eq(trainerClients.id, assignmentId));

        return { success: true };
    } catch (error) {
        console.error("Failed to unassign client:", error);
        return { success: false, message: "Failed to unassign client" };
    }
}