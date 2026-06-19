"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout, getUser } from "@/common/lib";
import { Button, Typography } from "@/shared/components";
import { cn } from "@/shared/utils";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react";

const ownerNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/employees", icon: Users, label: "Employees" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
];

const employeeNav = [
  { href: "/employee/tasks", icon: CheckSquare, label: "My Tasks" },
  { href: "/employee/profile", icon: Users, label: "Profile" },
  { href: "/employee/chat", icon: MessageSquare, label: "Chat" },
];

const navItemBase =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-md border-none bg-transparent px-3 py-2.5 text-left text-sm font-medium no-underline transition-all [&>svg]:size-[18px] [&>svg]:shrink-0";

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

interface SidebarProps {
  role: "owner" | "employee";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const user = getUser();
  const nav = role === "owner" ? ownerNav : employeeNav;

  const displayName = role === "owner" ? "Manager" : (user?.employee?.name ?? "Employee");

  const initials = role === "owner" ? "M" : (user?.employee?.name ?? "E")[0].toUpperCase();

  return (
    <aside className="bg-brand-primary-dark sticky top-0 flex h-screen w-[260px] shrink-0 flex-col">
      <div className="border-brand-primary flex items-center gap-3 border-b px-6 py-5">
        <div className="bg-brand-primary flex size-9 items-center justify-center rounded-md text-lg">
          ⚡
        </div>
        <Typography variant="h3" color="primary">
          Skipli
        </Typography>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <Typography variant="overline" color="muted" className="p-2 pb-4">
          {role === "owner" ? "Manager" : "Employee"} Portal
        </Typography>
        {nav.map(({ href, icon: Icon, label }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                navItemBase,
                active
                  ? "bg-brand-primary font-semibold text-white"
                  : "text-brand-primary-light hover:bg-brand-primary-hover hover:text-white"
              )}
            >
              <Icon size={18} />
              <Typography as="span" variant="small" className="flex-1">
                {label}
              </Typography>
              {active && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-brand-primary border-t px-3 py-4">
        <div className="flex items-center gap-2.5 px-1 pb-2">
          <div className="bg-brand-primary flex size-10 shrink-0 items-center justify-center rounded-full">
            <Typography as="span" variant="h6" color="primary" className="font-bold">
              {initials}
            </Typography>
          </div>
          <div className="min-w-0 flex-1">
            <Typography variant="small" color="primary" className="truncate font-semibold">
              {displayName}
            </Typography>
            <Typography variant="caption" color="muted" className="text-[11px]">
              {role === "owner" ? user?.phoneNumber : user?.employee?.email}
            </Typography>
          </div>
        </div>

        <Button variant="primary" className={cn("justify-start")} onClick={logout}>
          <LogOut size={16} />
          <Typography as="span" variant="small">
            Sign Out
          </Typography>
        </Button>
      </div>
    </aside>
  );
}
