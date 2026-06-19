"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout, getUser } from "@/common/lib";
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

interface SidebarProps {
  role: "owner" | "employee";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const user = getUser();
  const nav = role === "owner" ? ownerNav : employeeNav;

  const displayName =
    role === "owner" ? "Manager" : user?.employee?.name ?? "Employee";

  const initials =
    role === "owner" ? "M" : (user?.employee?.name ?? "E")[0].toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <span className="sidebar-logo-text">Skipli</span>
      </div>

      <nav className="sidebar-section">
        <p className="sidebar-section-title">
          {role === "owner" ? "Manager" : "Employee"} Portal
        </p>
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-nav-item ${
              pathname === href || pathname.startsWith(href + "/") ? "active" : ""
            }`}
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            {(pathname === href || pathname.startsWith(href + "/")) && (
              <ChevronRight size={14} className="opacity-50" />
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div
          className="flex items-center gap-2.5 mb-3 px-1"
        >
          <div className="avatar avatar-sm !text-[13px]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[13px] font-semibold text-[var(--text-primary)] truncate"
            >
              {displayName}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              {role === "owner" ? user?.phoneNumber : user?.employee?.email}
            </p>
          </div>
        </div>

        <button
          className="sidebar-nav-item w-full text-[var(--danger)]"
          onClick={logout}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
