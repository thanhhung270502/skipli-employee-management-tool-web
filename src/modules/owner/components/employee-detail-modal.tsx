"use client";
import type { EmployeeObject } from "@/common/models/employee";
import { useQueryEmployeeTasks } from "@/shared/hooks";
import { Badge, Button, Modal, Typography, Card } from "@/shared/components";
import { Mail, Phone, Calendar, Clock, ClipboardList } from "lucide-react";

interface EmployeeDetailModalProps {
  open: boolean;
  employee: EmployeeObject | null;
  onClose: () => void;
}

export function EmployeeDetailModal({ open, employee, onClose }: EmployeeDetailModalProps) {
  const employeeId = employee?.id ?? "";
  const { data, isLoading } = useQueryEmployeeTasks(employeeId, open && !!employee);
  const tasks = data?.tasks ?? [];

  if (!employee) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Employee Profile & Tasks"
      maxWidthClassName="max-w-[600px]"
    >
      <div className="space-y-6 py-2">
        {/* Profile Card Header */}
        <div className="flex items-start gap-4 border-b border-white/10 pb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
            {employee.name[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <Typography variant="h3" color="primary" className="truncate font-extrabold">
              {employee.name}
            </Typography>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="purple">{employee.role}</Badge>
              <Badge variant="info">{employee.department}</Badge>
              <Badge variant={employee.isSetup ? "success" : "warning"}>
                {employee.isSetup ? "Active" : "Pending Setup"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact & Schedule Details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-white/5 bg-white/5 p-4">
            <Typography
              variant="small"
              color="primary"
              className="text-brand-primary-light flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
            >
              Contact Info
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Mail size={14} className="text-indigo-400" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Phone size={14} className="text-indigo-400" />
                <span>{employee.phone || "—"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-white/5 bg-white/5 p-4">
            <Typography
              variant="small"
              color="primary"
              className="text-brand-primary-light flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
            >
              Work Schedule
            </Typography>
            {employee.workSchedule ? (
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-400" />
                  <span className="font-semibold text-indigo-400">
                    {employee.workSchedule.days.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-indigo-400" />
                  <span>
                    {employee.workSchedule.startTime} - {employee.workSchedule.endTime}
                  </span>
                </div>
              </div>
            ) : (
              <Typography variant="small" color="muted">
                No work schedule defined yet.
              </Typography>
            )}
          </div>
        </div>

        {/* Assigned Tasks Section */}
        <div className="space-y-3">
          <Typography
            variant="h4"
            color="primary"
            className="flex items-center gap-2 text-sm font-bold"
          >
            <ClipboardList size={16} className="text-indigo-400" />
            Assigned Tasks ({tasks.length})
          </Typography>

          <div className="max-h-[220px] space-y-2.5 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-white/40">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-white/2 py-8 text-center text-sm text-white/40">
                No tasks assigned to this employee.
              </div>
            ) : (
              tasks.map((task) => (
                <Card
                  key={task.id}
                  className="flex items-center justify-between gap-4 border border-white/5 p-3.5 transition-colors hover:border-white/10"
                >
                  <div className="min-w-0 flex-1">
                    <Typography variant="small" color="primary" className="truncate font-semibold">
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography variant="caption" color="muted" className="mt-0.5 line-clamp-1">
                        {task.description}
                      </Typography>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant={
                        task.status === "done"
                          ? "success"
                          : task.status === "in_progress"
                            ? "info"
                            : "warning"
                      }
                      className="capitalize"
                    >
                      {task.status === "in_progress" ? "In Progress" : task.status}
                    </Badge>
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "danger"
                          : task.priority === "medium"
                            ? "purple"
                            : "neutral"
                      }
                      className="capitalize"
                    >
                      {task.priority || "medium"}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="flex justify-end pt-2">
          <Button variant="ghost" className="px-6" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
