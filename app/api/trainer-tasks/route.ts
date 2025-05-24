import { getUser } from "@/actions/user";
import { db } from "@/utils/db/db";
import { trainerTasks, usersTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Get all tasks for a trainer
export async function GET(request: NextRequest) {
    try {
        const { dbUser } = await getUser();

        // Verify user is a trainer or admin
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        // Get all tasks with client info
        const tasks = await db
            .select({
                task: trainerTasks,
                client: usersTable,
            })
            .from(trainerTasks)
            .leftJoin(usersTable, eq(trainerTasks.clientId, usersTable.id))
            .where(eq(trainerTasks.trainerId, dbUser.id))
            .orderBy(trainerTasks.createdAt);

        // Map to a friendlier format
        const formattedTasks = tasks.map(({ task, client }) => ({
            ...task,
            clientName: client?.name || null,
        }));

        return NextResponse.json({ success: true, data: formattedTasks });
    } catch (error) {
        console.error("Error fetching trainer tasks:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

// Create a new task
export async function POST(request: NextRequest) {
    try {
        const { dbUser } = await getUser();

        // Verify user is a trainer or admin
        if (dbUser.role !== "trainer" && dbUser.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const payload = await request.json();

        // Validate required fields
        if (!payload.title) {
            return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
        }
        // Validate enum fields
        const validPriorities = ["low", "medium", "high"];
        const validStatuses = ["pending", "in_progress", "completed"];
        if (payload.priority && !validPriorities.includes(payload.priority)) {
            return NextResponse.json({ success: false, message: "Invalid priority value" }, { status: 400 });
        }
        if (payload.status && !validStatuses.includes(payload.status)) {
            return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
        }

        // Create the task
        const task = await db.insert(trainerTasks).values({
            trainerId: dbUser.id,
            title: payload.title,
            description: payload.description || null,
            clientId: payload.clientId || null,
            dueDate: payload.dueDate || null,
            priority: payload.priority || "medium",
            status: payload.status || "pending",
        }).returning();

        return NextResponse.json({ success: true, data: task[0] });
    } catch (error) {
        console.error("Error creating trainer task:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}