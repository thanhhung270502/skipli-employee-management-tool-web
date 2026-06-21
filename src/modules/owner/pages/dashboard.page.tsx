"use client";
import { motion } from "framer-motion";
import { Users, CheckSquare, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useQueryEmployees, useQueryAllTasks } from "@/shared/hooks";
import {
  Avatar,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  DashboardSkeleton,
  EmptyState,
  PageHeader,
  Typography,
} from "@/shared/components";
import { StatCard } from "../components";
import { cn, formatEnumToLabel } from "@/shared/utils";

export function DashboardPage() {
  const { data: empData, isLoading: empLoading } = useQueryEmployees();
  const { data: taskData, isLoading: taskLoading } = useQueryAllTasks();

  const loading = empLoading || taskLoading;
  const employees = empData?.employees ?? [];
  const tasks = taskData?.tasks ?? [];

  const stats = {
    totalEmployees: empData?.total_record ?? employees.length,
    totalTasks: taskData?.total_record ?? tasks.length,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
    doneTasks: tasks.filter((t) => t.status === "done").length,
  };

  const statCards = [
    {
      icon: Users,
      label: "Total Employees",
      value: stats.totalEmployees,
      colorClass: "purple" as const,
    },
    {
      icon: CheckSquare,
      label: "Total Tasks",
      value: stats.totalTasks,
      colorClass: "blue" as const,
    },
    {
      icon: Clock,
      label: "Pending Tasks",
      value: stats.pendingTasks,
      colorClass: "yellow" as const,
    },
    { icon: TrendingUp, label: "Completed", value: stats.doneTasks, colorClass: "green" as const },
  ];

  const recentTasks = tasks.slice(0, 5);
  const recentEmployees = employees.slice(0, 5);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

      <motion.div
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-0">
          <CardHeader className="border-brand-primary mb-0 border-b px-6 py-4">
            <CardTitle>Recent Tasks</CardTitle>
            <Link href="/tasks" className="text-brand-primary-light text-[13px] hover:text-white">
              View all →
            </Link>
          </CardHeader>
          {recentTasks.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No tasks yet"
              description="Create your first task for an employee"
              className="py-8!"
            />
          ) : (
            <div className="flex flex-col px-6">
              {recentTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={cn(
                    "border-brand-primary flex items-center gap-3 border-b py-2.5",
                    index === recentTasks.length - 1 && "border-b-0"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <Typography variant="small" color="primary" className="truncate font-medium">
                      {task.title}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {task.assignedToName}
                    </Typography>
                  </div>
                  <Badge variant={task.status === "done" ? "success" : "warning"}>
                    {formatEnumToLabel(task.status)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
            <Link
              href="/employees"
              className="text-brand-primary-light text-[13px] hover:text-white"
            >
              View all →
            </Link>
          </CardHeader>
          {recentEmployees.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No employees yet"
              description="Add your first team member"
              className="py-8!"
            />
          ) : (
            <div className="flex flex-col gap-1">
              {recentEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="border-brand-primary flex items-center gap-3 border-b py-2.5"
                >
                  <Avatar size="sm">{emp.name[0].toUpperCase()}</Avatar>
                  <div className="min-w-0 flex-1">
                    <Typography variant="small" color="primary" className="font-medium">
                      {emp.name}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {emp.department}
                    </Typography>
                  </div>
                  <Badge variant={emp.isSetup ? "success" : "warning"}>
                    {emp.isSetup ? "Active" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
