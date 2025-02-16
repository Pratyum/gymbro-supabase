"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/auth/actions";
import { PhoneInput } from "../ui/phone-number";

export default function SignupForm() {
    const initialState = {
        message: "",
    };

    const [formState, formAction, pending] = useActionState(signup, initialState);
    return (
        <form action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <PhoneInput
                    id="phoneNumber"
                    placeholder="+919444489090"
                    name="phoneNumber"
                    required
                />
            </div>
            <Button className="w-full mt-4" type="submit" disabled={pending}>
                {" "}
                {pending ? "Submitting..." : "Sign up"}
            </Button>
            {formState?.message && (
                <p className="text-sm text-red-500 text-center py-2">
                    {formState.message}
                </p>
            )}
        </form>
    );
}
