"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  ScrollArea, 
  ScrollBar 
} from "@/components/ui/scroll-area";
import { 
  Layers, 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Video, 
  Settings,
  Search,
  PenLine
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "My Courses",
      icon: <BookOpen className="h-5 w-5 mr-2" />,
      href: "/dashboard/courses",
      active: pathname === "/dashboard/courses" || pathname.startsWith("/dashboard/courses/"),
    },
    {
      label: "My Notes",
      icon: <PenLine className="h-5 w-5 mr-2" />,
      href: "/dashboard/notes",
      active: pathname === "/dashboard/notes",
    },
    {
      label: "Research",
      icon: <Search className="h-5 w-5 mr-2" />,
      href: "/dashboard/research",
      active: pathname === "/dashboard/research",
    },
    {
      label: "Resources",
      icon: <FileText className="h-5 w-5 mr-2" />,
      href: "/dashboard/resources",
      active: pathname === "/dashboard/resources",
    },
    {
      label: "Videos",
      icon: <Video className="h-5 w-5 mr-2" />,
      href: "/dashboard/videos",
      active: pathname === "/dashboard/videos",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5 mr-2" />,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  const SidebarContent = (
    <div className="flex flex-col gap-2 pt-4">
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 px-2">
          <Layers className="h-6 w-6" />
          <span className="text-xl font-bold">EduFlow</span>
        </div>
      </div>
      <div className="px-4 py-2">
        <h3 className="px-2 text-sm font-medium text-muted-foreground">
          Main Navigation
        </h3>
      </div>
      <div className="grid gap-1 px-2">
        {routes.map((route) => (
          <Button
            key={route.href}
            asChild
            variant={route.active ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
            onClick={isMobile ? () => setOpen(false) : undefined}
          >
            <Link href={route.href}>
              {route.icon}
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="mr-2 flex md:hidden">
            <Layers className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea>
            {SidebarContent}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside 
      className={cn(
        "h-screen w-64 fixed top-0 left-0 z-30 border-r bg-background",
        className
      )}
    >
      <ScrollArea className="h-full">
        {SidebarContent}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </aside>
  );
}