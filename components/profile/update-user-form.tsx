"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { ResponsiveDrawer } from "../common/responsive-drawer";
import { useUser } from "@/contexts/user-context";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ResetPasswordForm from "../auth/reset-password-form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { Textarea } from "../ui/textarea";
import { SelectUser } from "@/utils/db/schema";

export function UpdateUserForm() {
    const { supabaseUser, apiUser, updateProfile } = useUser();
    const [formData, setFormData] = useState<Partial<SelectUser>>(apiUser ?? {});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name:</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email:</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData?.email ?? ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="bio">Plan</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        value={formData.plan}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit">Update Profile</Button>
            </form>
            <Accordion
                type="single"
                collapsible
                className="space-y-4 bg-slate-200/30"
            >
                <AccordionItem value="change-password">
                    <AccordionTrigger>Change Password</AccordionTrigger>
                    <AccordionContent className="mx-4">
                        <ResetPasswordForm />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
}

export function UpdateProfileDialog({ open = false }: { open?: boolean }) {
    const [isOpen, setIsOpen] = useState(open);

    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
        Update Profile Details
            </Button>
            <ResponsiveDrawer
                title="Update Profile Details"
                open={isOpen}
                setOpen={setIsOpen}
            >
                <UpdateUserForm />
            </ResponsiveDrawer>
        </>
    );
}
