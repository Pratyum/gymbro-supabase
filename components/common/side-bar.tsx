"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { adminTabs, tabs, trainerTabs } from "../constants/tabs";
import { Skeleton } from "../ui/skeleton";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

export const SidebarComponent = () => {
    const pathname = usePathname();
    const activeTab = tabs.find((tab) => tab.link === pathname)?.id;
    const { dbUser, supabaseUser } = useCurrentUser();
    const isAdmin = dbUser?.role === 'admin';
    const isTrainer = isAdmin || dbUser?.role === 'trainer';
    const renderSidebar = () => {
        return (
            <Sidebar collapsible="icon" className="hidden lg:flex">
                <SidebarHeader>
                    <TeamSwitcher teams={[
                        { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
                    ]} />
                </SidebarHeader>
                <SidebarContent>
                    {isAdmin && <SidebarGroup>
                        <SidebarGroupLabel>Admin</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminTabs.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            asChild
                                            variant={activeTab === item.id ? "outline" : "default"}
                                        >
                                            <Link href={item.link}>
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>}
                    {isTrainer && <SidebarGroup>
                        <SidebarGroupLabel>Trainer Dashboard</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {trainerTabs.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            asChild
                                            variant={activeTab === item.id ? "outline" : "default"}
                                        >
                                            <Link href={item.link}>
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>}
                    <SidebarGroup>
                        <SidebarGroupLabel>Personal Metrics</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {tabs.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            asChild
                                            variant={activeTab === item.id ? "outline" : "default"}
                                        >
                                            <Link href={item.link}>
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <Suspense fallback={<Skeleton />}>
                        <NavUser user={{
                            name: dbUser?.name ?? 'New User',
                            email: dbUser?.email ?? 'EMAIL',
                            avatar: supabaseUser?.user_metadata?.avatar_url??'',
                        }} />
                    </Suspense>
                </SidebarFooter>
            </Sidebar>
        );
    };

    return renderSidebar();
};
