// components/memberships/new-member-dialog.tsx (modification)
"use client";

import { InviteUserParams, useInvite } from "@/hooks/use-invite";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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

type NewMemberDialogProps = {};

export const NewMemberDialog = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<InviteUserParams>({
        name: "",
        phone_number: "",
        email: "",
        role: "member",
    });

    const { inviteUser, isInviting } = useInvite();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value: string) => {
        setFormData(prev => ({ ...prev, phone_number: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inviteUser(formData);
            // Reset form and close dialog after successful invite
            setFormData({
                name: "",
                phone_number: "",
                email: "",
                role: "member",
            });
            setOpen(false);
            // Invalidate the query to refetch the updated list of members
            queryClient.invalidateQueries({
                queryKey: ["members"],
            });
        } catch (error) {
            // Error handling is already done in the hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="emerald" className="items-center gap-2">
                    <PlusCircle /> New Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>
                        {"Enter the details of the new member here. Click save when you're done."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone_number" className="text-right">
                                Phone
                            </Label>
                            <div className="col-span-3">
                                <PhoneInput
                                    placeholder="+919444489090"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handlePhoneChange}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan" className="text-right">
                                Role
                            </Label>
                            <Select
                                name="role"
                                value={formData.role}
                                onValueChange={(value) => handleSelectChange("role", value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="trainer">Trainer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="emerald"
                            type="submit"
                            disabled={isInviting}
                        >
                            {isInviting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" /> Sending Invitation...
                                </>
                            ) : (
                                "Send Invitation"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};