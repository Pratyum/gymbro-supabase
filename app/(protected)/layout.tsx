import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WorkoutLayout from "@/components/layouts/workout-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to your fitness journey",
  description: "Track your workouts and nutrition with ease",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WorkoutLayout>{children}</WorkoutLayout>;
}
