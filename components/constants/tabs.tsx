import {
    Building,
    Calendar,
    ChartNetwork,
    Dumbbell,
    LayoutDashboard,
    Scale,
    User,
    Utensils,
} from "lucide-react";

export type TABS = "weight" | "nutrition" | "workouts" | "profile";

export const adminTabs = [
    { id: "trainers", label: "Trainers", icon: Dumbbell, link: "/admin/trainers" },
    { id: "members", label: "Members", icon: User, link: "/admin/members" },
    { id: "sales", label: "Sales", icon: Building, link: "/admin/sales" },
    { id: "leads", label: "Leads", icon: ChartNetwork, link: "/admin/leads" },
    {
        id: "schedule",
        label: "Appointments",
        icon: Calendar,
        link: "/admin/schedule",
    },
];
export const trainerTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, link: "/trainer/dashboard" },
    { id: "sessions", label: "Members", icon: Calendar, link: "/trainer/schedule" },
]
export const tabs = [
    { id: "weight", label: "Weight log", icon: Scale, link: "/weight" },
    { id: "nutrition", label: "Nutrition", icon: Utensils, link: "/nutrition" },
    { id: "workouts", label: "Workouts", icon: Dumbbell, link: "/workouts" },
    { id: "profile", label: "Profile", icon: User, link: "/profile" },
];
