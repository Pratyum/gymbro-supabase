'use client';

import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { tabs } from "../constants/tabs";
import { usePathname } from "next/navigation";

export const BottomNavigation = () => {
    const pathname = usePathname();
    const activeTab = tabs.find((tab) => tab.link === pathname)?.id;
    return (
        <nav className="lg:hidden flex justify-around items-center h-16 border-t bg-background">
        {tabs.map((tab) => (
          <Button
            variant="ghost"
            key={tab.id}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            )}
            asChild
          >
            <Link href={tab.link}>
              <tab.icon className="w-5 h-5 mb-1" />
              {tab.label}
            </Link>
          </Button>
        ))}
      </nav>
    )
}