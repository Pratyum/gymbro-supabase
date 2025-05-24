"use client";

import { InviteUserParams, useInvite } from "@/hooks/use-invite";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PhoneInput } from "../ui/phone-number";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export function AddTrainerForm() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<InviteUserParams>({
        name: "",
        email: "",
        phone_number: "",
        role: "trainer",
    });

    const { inviteUser, isInviting } = useInvite();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value as InviteUserParams["role"] }));
    };

    const handlePhoneChange = (value: string) => {
        setFormData(prev => ({ ...prev, phone_number: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inviteUser(formData);
            // Reset form after successful invite
            setFormData({
                name: "",
                email: "",
                phone_number: "",
                role: "trainer",
            });
            queryClient.invalidateQueries({
                queryKey: ["trainers"],
            });
        } catch (error) {
            // Error handling is already done in the hook
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <PhoneInput
                        placeholder="+919444489090"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                        name="role"
                        value={formData.role}
                        onValueChange={handleSelectChange}
                    >
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
                disabled={isInviting}
            >
                {isInviting ? (
                    <>
                        <FaSpinner className="animate-spin mr-2" /> Sending Invitation...
                    </>
                ) : (
                    <>
                        <Plus className="mr-2 h-4 w-4" /> Add New Trainer
                    </>
                )}
            </Button>
        </form>
    );
}


export function AddTrainerDialog({ open = false }: { open?: boolean }) {
    const [isOpen, setIsOpen] = useState(open);

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
                    <AddTrainerForm />
                </div>
            </DialogContent>
        </Dialog>
    );
}
