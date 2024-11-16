"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { verifyOtp } from "@/app/auth/actions";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "./ui/input-otp";

export default function VerifyForm() {
    const initialState = {
        message: "",
    };

    const [formState, formAction] = useActionState(verifyOtp, initialState);
    const { pending } = useFormStatus();

    return (
        <form action={formAction}>
            <div className="grid gap-2">
                <input type="hidden" name="type" value="sms" />
                <InputOTP name="otp" maxLength={6}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <Button className="w-full mt-4" type="submit" aria-disabled={pending}>
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
