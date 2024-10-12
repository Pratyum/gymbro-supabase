'use client';

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { tabs } from "../constants/tabs";


export const Sidebar = () => {
    const pathname = usePathname();
    const activeTab = tabs.find((tab) => tab.link === pathname)?.id;

    return (<nav className="hidden lg:flex flex-col w-64 border-r gap-1">
        {tabs.map((tab) => (
          <Button
          variant={"ghost"}
            key={tab.id}
            className={cn(
              "flex items-center space-x-2 px-4 py-3 text-sm",
              activeTab === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-primary/5"
            )}
            asChild
          >
            <Link href={tab.link}>
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </Link>
          </Button>
        ))}
      </nav>)
}