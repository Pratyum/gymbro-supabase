import { getUser } from "@/actions/user";
import { db } from "@/utils/db/db";
import { trainerClients } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Remove client assignment
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { dbUser } = await getUser();
        const assignmentId = parseInt(params.id, 10);

        // Verify user is a trainer or admin
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Verify assignment belongs to this trainer
        const assignment = await db
            .select()
            .from(trainerClients)
            .where(and(
                eq(trainerClients.id, assignmentId),
                eq(trainerClients.trainerId, dbUser.id)
            ));

        if (!assignment.length) {
            return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 });
        }

        // Delete assignment
        await db
            .delete(trainerClients)
            .where(eq(trainerClients.id, assignmentId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// Update assignment notes
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { dbUser } = await getUser();
        const assignmentId = parseInt(params.id, 10);
        const { notes } = await request.json();

        // Verify user is a trainer or admin
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Verify assignment belongs to this trainer
        const assignment = await db
            .select()
            .from(trainerClients)
            .where(and(
                eq(trainerClients.id, assignmentId),
                eq(trainerClients.trainerId, dbUser.id)
            ));

        if (!assignment.length) {
            return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 });
        }

        // Update assignment
        const updated = await db
            .update(trainerClients)
            .set({ notes })
            .where(eq(trainerClients.id, assignmentId))
            .returning();

        return NextResponse.json({ success: true, data: updated[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}