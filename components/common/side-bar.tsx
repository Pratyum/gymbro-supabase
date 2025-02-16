"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { adminTabs, tabs } from "../constants/tabs";
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
import { TeamSwitcher } from "./team-switcher";
import { GalleryVerticalEnd } from "lucide-react";
import { NavUser } from "./nav-user";

export const SidebarComponent = () => {
    const pathname = usePathname();
    const activeTab = tabs.find((tab) => tab.link === pathname)?.id;
    const renderSidebar = () => {
        return (
            <Sidebar collapsible="icon" className="hidden lg:flex">
                <SidebarHeader>
                    <TeamSwitcher teams={[
                        { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
                    ]} />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
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
                    </SidebarGroup>
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
                    <NavUser user={{
                        name: "Pratyum",
                        email: "pratyum96@gmail.com",
                        avatar: "/avatars/pratyum.jpg",
                    }} />
                </SidebarFooter>
            </Sidebar>
        );
    };

    return renderSidebar();
};
