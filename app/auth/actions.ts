"use server";
import { getUser } from "@/actions/user";
import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { createStripeCustomer } from "@/utils/stripe/api";
import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import { AdminUserAttributes, EmailOtpType } from "@supabase/supabase-js";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// {role: "admin", email: "", name: "", phoneNumber:""}
export async function inviteUser(
    currentState: { message: string },
    formData: FormData,
) {
    const supabase = await createServiceRoleClient();
    const { dbUser: currentUser } = await getUser();
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const role = formData.get("role") as "admin" | "trainer" | "member";
    const name = formData.get("name") as string;
    if (!email || !role) {
        return { message: "Email and Role are required" };
    }
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { message: "Invalid email" };
    }
    const attributes: AdminUserAttributes = {
        ...(phoneNumber && {phone: phoneNumber}),
        email: email,
        user_metadata: {
            ...(phoneNumber && {phone: phoneNumber}),
            full_name: name,
            role: role,
        },
    };
    const { data, error } = await supabase.auth.admin.createUser(attributes);
    if (error) {
        return { message: error.message };
    }
    if (!data) {
        return { message: "Error sending invite" };
    }

    const { user } = data;
    const stripeId = await createStripeCustomer(
    user!.id,
    phoneNumber,
    email,
    name,
    );
    const rows = await db
        .insert(usersTable)
        .values({
            email: email,
            plan: "none",
            role,
            name,
            phoneNumber,
            stripe_id: stripeId,
            organizationId: currentUser.organizationId,
        })
        .returning({ id: usersTable.id });

    if (rows.length === 0) {
        return { message: "Error creating user" };
    }

    revalidatePath("/admin/members");

    return { message: "" };
}

export async function resetPassword(
    currentState: { message: string },
    formData: FormData,
) {
    const supabase = await createClient();
    const passwordData = {
        password: formData.get("password") as string,
        confirm_password: formData.get("confirm_password") as string,
        code: formData.get("code") as string,
    };
    if (passwordData.password !== passwordData.confirm_password) {
        return { message: "Passwords do not match" };
    }

    const { data } = await supabase.auth.exchangeCodeForSession(
        passwordData.code,
    );

    let { error } = await supabase.auth.updateUser({
        password: passwordData.password,
    });
    if (error) {
        return { message: error.message };
    }
    redirect(`/forgot-password/reset/success`);
}

export async function forgotPassword(
    currentState: { message: string },
    formData: FormData,
) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/forgot-password/reset`,
    });

    if (error) {
        return { message: error.message };
    }
    redirect(`/forgot-password/success`);
}
export async function signup(
    currentState: { message: string },
    formData: FormData,
) {
    const supabase = await createClient();
    const cookiesStore = await cookies();

    if (formData.get("phoneNumber") as string) {
    // Sign up with phone number
        const { error, data } = await supabase.auth.signInWithOtp({
            phone: formData.get("phoneNumber") as string,
        });
        if (error) {
            return { message: error.message };
        }
        // Set the phone number in the cookies
        cookiesStore.set("phone_number", formData.get("phoneNumber") as string, {
            maxAge: 60 * 60 * 24 * 30,
        });
    } else {
    // Sign up with email and password
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const { error } = await supabase.auth.signUp(data);

        if (error) {
            return { message: error.message };
        }

        if (error) {
            redirect("/error");
        }
        // Set the email in the cookies
        cookiesStore.set("email", formData.get("email") as string, {
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    revalidatePath("/", "layout");
    redirect("/verify");
}

export async function verifyOtp(
    currentState: { message: string },
    formData: FormData,
) {
    const supabase = await createClient();
    const cookiesStore = await cookies();
    let error, data;
    const otpType = formData.get("type") as string;
    if (otpType === "sms") {
        if (!cookiesStore.has("phone_number")) {
            return { message: "Phone number not found" };
        }
        const phoneNumber = cookiesStore.get("phone_number");

        ({ error, data } = await supabase.auth.verifyOtp({
            type: "sms",
            phone: phoneNumber!.value.replace("+", "").replaceAll(" ", ""),
            token: formData.get("otp") as string,
        }));
    } else if (otpType === "email") {
        if (!cookiesStore.has("email")) {
            return { message: "Email not found" };
        }
        const email = cookiesStore.get("email") as unknown as string;
        ({ error, data } = await supabase.auth.verifyOtp({
            type: otpType as EmailOtpType,
            email: email,
            token: formData.get("otp") as string,
        }));
    }
    if (error) {
        return { message: error.message };
    }

    // Remove the phone number from the cookies
    cookiesStore.delete("phone_number");

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const checkUserInDB = await db
            .select()
            .from(usersTable)
            .where(
                or(
                    eq(usersTable.phoneNumber, user!.phone!),
                    eq(usersTable.email, user!.email!),
                ),
            );

        if (checkUserInDB.length === 0) {
            // create Stripe Customer Record
            const stripeID = await createStripeCustomer(user!.id, user!.email!, "");
            // Create record in DB
            await db.insert(usersTable).values({
                name: "",
                phoneNumber: user!.phone!,
                email: user!.email!,
                stripe_id: stripeID,
                plan: "none",
            });
        }
    } catch (e) {
        console.error(e);
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function loginUser(
    currentState: { message: string },
    formData: FormData,
) {
    const supabase = await createClient();
    const cookiesStore = await cookies();
    let data, error;
    if (formData.get("phoneNumber") as string) {
        ({ error, data } = await supabase.auth.signInWithOtp({
            phone: formData.get("phoneNumber") as string,
        }));

        // Set the phone number in the cookies
        cookiesStore.set("phone_number", formData.get("phoneNumber") as string, {
            maxAge: 60 * 60 * 24 * 30,
        });
    } else {
        ({ data, error } = await supabase.auth.signInWithPassword({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }));

        // Set the email in the cookies
        cookiesStore.set("email", formData.get("email") as string, {
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    if (error) {
        return { message: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/verify");
}

export async function logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    redirect("/login");
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/callback`,
        },
    });

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
    }
}

export async function signInWithGithub() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/callback`,
        },
    });

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
    }
}
