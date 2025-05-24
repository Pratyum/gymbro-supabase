import { getUser } from "@/actions/user";
import { db } from "@/utils/db/db";
import { trainerClients, usersTable } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Get all clients assigned to a trainer
export async function GET(request: NextRequest) {
    try {
        const { dbUser } = await getUser();

        // Verify user is a trainer
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Get all clients for the trainer
        const assignments = await db
            .select({
                assignment: trainerClients,
                client: usersTable,
            })
            .from(trainerClients)
            .where(eq(trainerClients.trainerId, dbUser.id))
            .innerJoin(usersTable, eq(trainerClients.clientId, usersTable.id));

        return NextResponse.json({ success: true, data: assignments });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// Assign client to trainer
export async function POST(request: NextRequest) {
    try {
        const { dbUser } = await getUser();
        const { clientId, notes } = await request.json();

        // Verify user is a trainer or admin
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Verify client exists
        const client = await db.select().from(usersTable).where(eq(usersTable.id, clientId));
        if (!client.length) {
            return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
        }

        // Check if assignment already exists
        const existingAssignment = await db
            .select()
            .from(trainerClients)
            .where(and(
                eq(trainerClients.trainerId, dbUser.id),
                eq(trainerClients.clientId, clientId)
            ));

        if (existingAssignment.length) {
            return NextResponse.json({ success: false, message: "Client already assigned to this trainer" }, { status: 400 });
        }

        // Create assignment
        const assignment = await db.insert(trainerClients).values({
            trainerId: dbUser.id,
            clientId,
            notes,
        }).returning();

        return NextResponse.json({ success: true, data: assignment[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}