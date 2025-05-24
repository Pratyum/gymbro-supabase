// components/trainer/trainer-tasks.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarClock,
    CheckCircle2,
    Circle,
    Clock,
    FilterX,
    ListTodo,
    Plus,
    UserRound
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Task = {
    id: number;
    title: string;
    description: string | null;
    clientId: number | null;
    dueDate: string | null;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    createdAt: string;
    clientName?: string;
};

type TaskFilter = {
    status: "all" | "pending" | "in_progress" | "completed";
    priority: "all" | "low" | "medium" | "high";
};

export function TrainerTasks({ limit, showAll = false }: { limit?: number; showAll?: boolean }) {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [filters, setFilters] = useState<TaskFilter>({
        status: "all",
        priority: "all",
    });

    const queryClient = useQueryClient();

    // Fetch tasks
    const {
        data: tasks,
        isLoading,
    } = useQuery({
        queryKey: ["trainer-tasks"],
        queryFn: async () => {
            const response = await fetch("/api/trainer-tasks");
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }
            return response.json().then(res => res.data as Task[]);
        },
    });

    // Fetch clients for assignment
    const { data: clients } = useQuery({
        queryKey: ["trainer-clients-simple"],
        queryFn: async () => {
            const response = await fetch("/api/trainer-client/simple");
            if (!response.ok) {
                throw new Error("Failed to fetch clients");
            }
            return response.json().then(res => res.data);
        },
        enabled: isAddingTask,
    });

    // Create task mutation
    const createTaskMutation = useMutation({
        mutationFn: async (newTask: Omit<Task, "id" | "createdAt">) => {
            const response = await fetch("/api/trainer-tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            return response.json();
        },
        onSuccess: () => {
            setIsAddingTask(false);
            queryClient.invalidateQueries({ queryKey: ["trainer-tasks"] });
            toast({
                title: "Task created",
                description: "Your task has been created successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create task. Please try again.",
                variant: "destructive",
            });
        },
    });

    // Update task status mutation
    const updateTaskStatusMutation = useMutation({
        mutationFn: async ({ taskId, status }: { taskId: number; status: string }) => {
            const response = await fetch(`/api/trainer-tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trainer-tasks"] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update task. Please try again.",
                variant: "destructive",
            });
        },
    });

    // Delete task mutation
    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId: number) => {
            const response = await fetch(`/api/trainer-tasks/${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trainer-tasks"] });
            toast({
                title: "Task deleted",
                description: "Your task has been deleted successfully.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete task. Please try again.",
                variant: "destructive",
            });
        },
    });

    // New task form state
    const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt">>({
        title: "",
        description: "",
        clientId: null,
        dueDate: null,
        priority: "medium",
        status: "pending",
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        createTaskMutation.mutate(newTask);
    };

    const handleTaskStatusChange = (taskId: number, status: string) => {
        updateTaskStatusMutation.mutate({ taskId, status });
    };

    const handleDeleteTask = (taskId: number) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTaskMutation.mutate(taskId);
        }
    };

    const resetFilters = () => {
        setFilters({
            status: "all",
            priority: "all",
        });
    };

    // Filter tasks
    const filteredTasks = tasks?.filter(task => {
        if (filters.status !== "all" && task.status !== filters.status) return false;
        if (filters.priority !== "all" && task.priority !== filters.priority) return false;
        return true;
    });

    // Sort tasks: first by status (pending first), then by priority (high first), then by due date
    const sortedTasks = filteredTasks?.sort((a, b) => {
        // First by status
        const statusOrder = { pending: 0, in_progress: 1, completed: 2 };
        if (statusOrder[a.status as keyof typeof statusOrder] !== statusOrder[b.status as keyof typeof statusOrder]) {
            return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
        }

        // Then by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
            return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        }

        // Then by due date (if exists)
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        // Tasks with due dates come before tasks without due dates
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;

        // Finally by creation date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Limit tasks if needed
    const displayedTasks = limit && !showAll ? sortedTasks?.slice(0, limit) : sortedTasks;

    // Render priority badge
    const renderPriorityBadge = (priority: string) => {
        switch (priority) {
        case "high":
            return <Badge variant="destructive">High</Badge>;
        case "medium":
            return <Badge variant="secondary">Medium</Badge>;
        case "low":
            return <Badge variant="outline">Low</Badge>;
        default:
            return null;
        }
    };

    // Render status icon
    const renderStatusIcon = (status: string) => {
        switch (status) {
        case "completed":
            return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case "in_progress":
            return <Clock className="h-5 w-5 text-amber-500" />;
        case "pending":
            return <Circle className="h-5 w-5 text-gray-400" />;
        default:
            return null;
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-xl font-bold flex items-center">
                        <ListTodo className="mr-2" /> Tasks
                    </CardTitle>
                    <CardDescription>
                        Manage your tasks and to-dos
                    </CardDescription>
                </div>
                <Button onClick={() => setIsAddingTask(true)} size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Task
                </Button>
            </CardHeader>

            {showAll && (
                <div className="px-6 pb-2 flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2">
                        <Label>Status:</Label>
                        <Select
                            value={filters.status}
                            onValueChange={(value: any) => setFilters(prev => ({ ...prev, status: value as TaskFilter['status'] }))}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label>Priority:</Label>
                        <Select
                            value={filters.priority}
                            onValueChange={(value: any) => setFilters(prev => ({ ...prev, priority: value as TaskFilter['priority'] }))}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {(filters.status !== "all" || filters.priority !== "all") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="flex items-center gap-1 ml-2"
                        >
                            <FilterX className="h-4 w-4" /> Clear Filters
                        </Button>
                    )}
                </div>
            )}

            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: limit || 3 }).map((_, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayedTasks && displayedTasks.length > 0 ? (
                    <AnimatePresence>
                        <ul className="space-y-3">
                            {displayedTasks.map((task) => (
                                <motion.li
                                    key={task.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex items-start p-3 rounded-lg border ${task.status === "completed" ? "border-green-200 bg-green-50" :
                                        task.priority === "high" ? "border-red-200 bg-red-50" :
                                            "border-gray-200 bg-white"
                                    }`}
                                >
                                    <div className="flex-shrink-0 mr-3 pt-0.5">
                                        <Checkbox
                                            checked={task.status === "completed"}
                                            onCheckedChange={(checked) => {
                                                handleTaskStatusChange(
                                                    task.id,
                                                    checked ? "completed" : "pending"
                                                );
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""
                                            }`}>
                                                {task.title}
                                            </h4>
                                            {renderPriorityBadge(task.priority)}
                                        </div>

                                        {task.description && (
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                            {task.clientName && (
                                                <span className="flex items-center gap-1">
                                                    <UserRound className="h-3 w-3" />
                                                    {task.clientName}
                                                </span>
                                            )}

                                            {task.dueDate && (
                                                <span className="flex items-center gap-1">
                                                    <CalendarClock className="h-3 w-3" />
                                                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                                                </span>
                                            )}

                                            <span className="flex items-center gap-1">
                                                {renderStatusIcon(task.status)}
                                                <span className="capitalize">{task.status.replace("_", " ")}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 ml-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleTaskStatusChange(task.id, "pending")}
                                                    disabled={task.status === "pending"}
                                                >
                                                    Mark as Pending
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleTaskStatusChange(task.id, "in_progress")}
                                                    disabled={task.status === "in_progress"}
                                                >
                                                    Mark as In Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleTaskStatusChange(task.id, "completed")}
                                                    disabled={task.status === "completed"}
                                                >
                                                    Mark as Completed
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {filters.status !== "all" || filters.priority !== "all"
                            ? "No tasks matching the selected filters."
                            : "No tasks yet. Click 'Add Task' to create one."}
                    </div>
                )}
            </CardContent>

            {!showAll && displayedTasks && displayedTasks.length > (limit??0) && (
                <CardFooter className="flex justify-center pt-2">
                    <Button asChild>
                        <Link href="/trainer/tasks">
                            View All Tasks
                        </Link>
                    </Button>
                </CardFooter>
            )}

            {/* Add Task Dialog */}
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Create a new task to keep track of your work
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateTask}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={newTask.description || ""}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="client" className="text-right">
                                    Client
                                </Label>
                                <Select
                                    value={newTask.clientId?.toString() || ""}
                                    onValueChange={(value: any) => setNewTask({ ...newTask, clientId: value ? parseInt(value, 10) : null })}
                                >
                                    <SelectTrigger id="client" className="col-span-3">
                                        <SelectValue placeholder="Select a client (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {clients?.map((client: {id: number; name: string;}) => (
                                            <SelectItem key={client.id} value={client.id.toString()}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dueDate" className="text-right">
                                    Due Date
                                </Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ""}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="priority" className="text-right">
                                    Priority
                                </Label>
                                <Select
                                    value={newTask.priority}
                                    onValueChange={(value: any) => setNewTask({ ...newTask, priority: value as Task['priority'] })}
                                >
                                    <SelectTrigger id="priority" className="col-span-3">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddingTask(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!newTask.title}>
                                Create Task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}