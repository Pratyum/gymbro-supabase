// components/providers/auth-provider.tsx
"use client";

import { AuthUser } from "@/types";
import { SelectUser } from "@/utils/db/schema";
import { createClient } from "@/utils/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthUser>({
    supabaseUser: null,
    dbUser: null,
    session: null,
    isLoading: true,
    error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
    const [dbUser, setDbUser] = useState<SelectUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function getSession() {
            try {
                setIsLoading(true);

                // Get the session from Supabase
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    throw sessionError;
                }

                setSession(session);

                // If there's a session, get the user
                if (session) {
                    const { data: { user }, error: userError } = await supabase.auth.getUser();

                    if (userError) {
                        throw userError;
                    }

                    setSupabaseUser(user);

                    // Fetch the database user
                    if (user) {
                        const response = await fetch('/api/user/me');
                        if (!response.ok) {
                            throw new Error('Failed to fetch database user');
                        }

                        const data = await response.json();
                        setDbUser(data.dbUser);
                    }
                }
            } catch (err) {
                console.error('Error getting user session:', err);
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setIsLoading(false);
            }
        }

        // Call the function to get the session
        getSession();

        // Set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setSupabaseUser(session?.user ?? null);

                // Fetch the database user when auth state changes
                if (session?.user) {
                    fetch('/api/user/me')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch database user');
                            }
                            return response.json();
                        })
                        .then(data => {
                            setDbUser(data.dbUser);
                        })
                        .catch(err => {
                            console.error('Error fetching database user:', err);
                            setError(err instanceof Error ? err : new Error(String(err)));
                        });
                } else {
                    setDbUser(null);
                }
            }
        );

        // Clean up the subscription
        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <AuthContext.Provider value={{ supabaseUser, dbUser, session, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
}