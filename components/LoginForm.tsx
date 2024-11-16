"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/app/auth/actions";
import { PhoneInput } from "./ui/phone-number";
export default function LoginForm() {
    const initialState = {
        message: "",
    };
    const [formState, formAction] = useActionState(loginUser, initialState);
    return (
        <form action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <PhoneInput id="phoneNumber" name="phoneNumber" />
            </div>
            <Button className="w-full mt-4" type="submit">
        Sign In
            </Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">
                    {formState.message}
                </p>
            )}
        </form>
    );
}
