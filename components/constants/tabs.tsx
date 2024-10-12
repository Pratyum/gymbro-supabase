import { Dumbbell, Scale, User, Utensils } from "lucide-react";

export type TABS = "weight" | "nutrition" | "workouts" | "profile";

export const tabs = [
  { id: "weight", label: "Weight log", icon: Scale, link: "/weight" },
  { id: "nutrition", label: "Nutrition", icon: Utensils, link: "/nutrition" },
  { id: "workouts", label: "Workouts", icon: Dumbbell, link: "/workouts" },
  { id: "profile", label: "Profile", icon: User, link: "/profile" },
];
