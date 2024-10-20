'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { tabs } from "../constants/tabs";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";


export const SidebarComponent = () => {
    const pathname = usePathname();
    const activeTab = tabs.find((tab) => tab.link === pathname)?.id;
    const renderSidebar = () => {
      return (
        <Sidebar className="hidden lg:flex">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Personal Metrics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tabs.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild variant={activeTab === item.id ? 'outline' : 'default'}>
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
      </Sidebar>
      )
    };
    
    return renderSidebar();
}