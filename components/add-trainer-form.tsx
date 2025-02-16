"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState, useActionState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useFormStatus } from "react-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { PhoneInput } from "./ui/phone-number";
import { inviteUser } from "@/app/auth/actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export function AddTrainerForm({
    action,
}: {
  action: (
    state: { message: string },
    formData: FormData,
  ) => Promise<{ message: string }>;
}) {
    const initialState = {
        message: "",
    };

    const [formState, formAction] = useActionState(action, initialState);
    const { pending } = useFormStatus();
    return (
        <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" type="text" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <PhoneInput
                        placeholder="+919444489090"
                        name="phone_number"
                        required
                    />
                </div>
                <Input type="hidden" name="type" value="trainer" aria-hidden />
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role">
                        <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="trainer">Trainer</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button
                variant="emerald"
                type="submit"
                className="w-full"
                disabled={pending}
            >
                {pending && (
                    <>
                        <FaSpinner className="animate-spin mr-2" /> Loading
                    </>
                )}
                {!pending && (
                    <>
                        <Plus className="mr-2 h-4 w-4" /> Add New Trainer
                    </>
                )}
            </Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">
                    {formState.message}
                </p>
            )}
        </form>
    );
}

export function AddTrainerDialog({ open = false }: { open?: boolean }) {
    const [isOpen, setIsOpen] = useState(open);

    const action = async (state: { message: string }, formData: FormData) => {
        const response = await inviteUser(state, formData);
        if (!response.message) {
            setIsOpen(false);
        }
        return { message: response.message };
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Trainer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Trainer</DialogTitle>
                    <DialogDescription>Add a trainer to your gym</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <AddTrainerForm action={action} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
