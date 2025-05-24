import { getUser } from "@/actions/user";
import { db } from "@/utils/db/db";
import { trainerTasks } from "@/utils/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { dbUser } = await getUser();
        const taskId = parseInt(params.id, 10);

        // Verify user is a trainer or admin
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Verify the task belongs to this trainer
        const task = await db
            .select()
            .from(trainerTasks)
            .where(and(
                eq(trainerTasks.id, taskId),
                eq(trainerTasks.trainerId, dbUser.id)
            ));

        if (!task.length) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        const payload = await request.json();

        // Validate enum fields if provided
        const validPriorities = ["low", "medium", "high"];
        const validStatuses = ["pending", "in_progress", "completed"];
        if (payload.priority !== undefined && !validPriorities.includes(payload.priority)) {
            return NextResponse.json({ success: false, message: "Invalid priority value" }, { status: 400 });
        }
        if (payload.status !== undefined && !validStatuses.includes(payload.status)) {
            return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
        }

        // Update the task
        const updatedTask = await db
            .update(trainerTasks)
            .set({
                title: payload.title !== undefined ? payload.title : undefined,
                description: payload.description !== undefined ? payload.description : undefined,
                clientId: payload.clientId !== undefined ? payload.clientId : undefined,
                dueDate: payload.dueDate !== undefined ? payload.dueDate : undefined,
                priority: payload.priority !== undefined ? payload.priority : undefined,
                status: payload.status !== undefined ? payload.status : undefined,
            })
            .where(eq(trainerTasks.id, taskId))
            .returning();

        return NextResponse.json({ success: true, data: updatedTask[0] });
    } catch (error) {
        console.error("Error updating trainer task:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// Delete a task
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { dbUser } = await getUser();
        const taskId = parseInt(params.id, 10);

        // Verify user is a trainer or admin
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Verify the task belongs to this trainer
        const task = await db
            .select()
            .from(trainerTasks)
            .where(and(
                eq(trainerTasks.id, taskId),
                eq(trainerTasks.trainerId, dbUser.id)
            ));

        if (!task.length) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        // Delete the task
        await db.delete(trainerTasks).where(eq(trainerTasks.id, taskId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting trainer task:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}