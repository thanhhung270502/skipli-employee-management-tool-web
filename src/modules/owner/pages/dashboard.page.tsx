"use client";
import { motion } from "framer-motion";
import { Users, CheckSquare, Clock, TrendingUp } from "lucide-react";
import { useQueryEmployees, useQueryAllTasks } from "@/shared/hooks";
import { DashboardSkeleton, Badge } from "@/shared/components";
import { StatCard } from "../components";
import { formatEnumToLabel } from "@/shared/utils";

export function DashboardPage() {
  const { data: empData, isLoading: empLoading } = useQueryEmployees();
  const { data: taskData, isLoading: taskLoading } = useQueryAllTasks();

  const loading = empLoading || taskLoading;
  const employees = empData?.employees ?? [];
  const tasks = taskData?.tasks ?? [];

  const stats = {
    totalEmployees: employees.length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
    doneTasks: tasks.filter((t) => t.status === "done").length,
  };

  const statCards = [
    {
      icon: Users,
      label: "Total Employees",
      value: stats.totalEmployees,
      colorClass: "stat-icon-purple",
    },
    {
      icon: CheckSquare,
      label: "Total Tasks",
      value: stats.totalTasks,
      colorClass: "stat-icon-blue",
    },
    {
      icon: Clock,
      label: "Pending Tasks",
      value: stats.pendingTasks,
      colorClass: "stat-icon-yellow",
    },
    { icon: TrendingUp, label: "Completed", value: stats.doneTasks, colorClass: "stat-icon-green" },
  ];

  const recentTasks = tasks.slice(0, 5);
  const recentEmployees = employees.slice(0, 5);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Tasks</span>
            <a href="/tasks" className="text-[13px] text-[var(--accent-primary)]">
              View all →
            </a>
          </div>
          {recentTasks.length === 0 ? (
            <div className="empty-state !py-8">
              <div className="empty-state-icon">📋</div>
              <p className="empty-state-title">No tasks yet</p>
              <p className="empty-state-desc">Create your first task for an employee</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 py-2.5 border-b border-[var(--border-subtle)]"
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-[var(--text-primary)] truncate"
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {task.assignedToName}
                    </p>
                  </div>
                  <Badge variant={task.status === "done" ? "success" : "warning"}>
                    {formatEnumToLabel(task.status)}
                  </Badge>

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Employees</span>
            <a href="/employees" className="text-[13px] text-[var(--accent-primary)]">
              View all →
            </a>
          </div>
          {recentEmployees.length === 0 ? (
            <div className="empty-state !py-8">
              <div className="empty-state-icon">👥</div>
              <p className="empty-state-title">No employees yet</p>
              <p className="empty-state-desc">Add your first team member</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {recentEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 py-2.5 border-b border-[var(--border-subtle)]"
                >
                  <div className="avatar avatar-sm">{emp.name[0].toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {emp.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{emp.department}</p>
                  </div>
                  <Badge variant={emp.isSetup ? "success" : "warning"}>
                    {emp.isSetup ? "Active" : "Pending"}
                  </Badge>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
