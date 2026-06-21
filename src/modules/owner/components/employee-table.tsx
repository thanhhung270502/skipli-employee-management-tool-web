"use client";
import { motion } from "framer-motion";
import { Edit2, Trash2, Eye } from "lucide-react";
import type { EmployeeObject } from "@/common/models/employee";
import { Avatar, Badge, Button, Typography } from "@/shared/components";

interface EmployeeTableProps {
  employees: EmployeeObject[];
  onEdit: (emp: EmployeeObject) => void;
  onDelete: (id: string) => void;
  onViewDetail: (emp: EmployeeObject) => void;
}

export function EmployeeTable({ employees, onEdit, onDelete, onViewDetail }: EmployeeTableProps) {
  return (
    <div className="border-brand-primary bg-brand-primary-dark overflow-hidden rounded-2xl border">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-brand-primary text-brand-primary-light border-b bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider uppercase">
              Employee
            </th>
            <th className="border-brand-primary text-brand-primary-light border-b bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider uppercase">
              Department
            </th>
            <th className="border-brand-primary text-brand-primary-light border-b bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider uppercase">
              Role
            </th>
            <th className="border-brand-primary text-brand-primary-light border-b bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider uppercase">
              Schedule
            </th>
            <th className="border-brand-primary text-brand-primary-light border-b bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider uppercase">
              Contact
            </th>
            <th className="border-brand-primary text-brand-primary-light border-b bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider uppercase">
              Status
            </th>
            <th className="border-brand-primary text-brand-primary-light border-b bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <motion.tr
              key={emp.id}
              className="hover:bg-brand-primary/5 cursor-pointer transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              onClick={() => onViewDetail(emp)}
            >
              <td className="border-brand-primary border-b px-5 py-4 align-middle text-sm text-white last:border-b-0">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">{emp.name[0].toUpperCase()}</Avatar>
                  <div>
                    <Typography variant="small" color="primary" className="font-semibold">
                      {emp.name}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {emp.email}
                    </Typography>
                  </div>
                </div>
              </td>
              <td className="border-brand-primary border-b px-5 py-4 align-middle text-sm text-white">
                {emp.department}
              </td>
              <td className="border-brand-primary border-b px-5 py-4 align-middle text-sm text-white">
                <Badge variant="purple">{emp.role}</Badge>
              </td>
              <td className="border-brand-primary border-b px-5 py-4 align-middle text-sm text-white">
                {emp.workSchedule ? (
                  <div className="flex flex-col">
                    <span className="font-semibold text-indigo-400">
                      {emp.workSchedule.days.join(", ")}
                    </span>
                    <span className="text-brand-primary-light text-xs">
                      {emp.workSchedule.startTime} - {emp.workSchedule.endTime}
                    </span>
                  </div>
                ) : (
                  <span className="text-white/40">—</span>
                )}
              </td>
              <td className="border-brand-primary border-b px-5 py-4 align-middle text-sm text-white">
                <Typography variant="small" color="muted">
                  {emp.phone ?? "—"}
                </Typography>
              </td>
              <td className="border-brand-primary border-b px-5 py-4 align-middle text-sm text-white">
                <Badge variant={emp.isSetup ? "success" : "warning"}>
                  {emp.isSetup ? "✓ Active" : "⏳ Pending"}
                </Badge>
              </td>
              <td className="border-brand-primary border-b px-5 py-4 align-middle text-sm text-white">
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(emp);
                    }}
                    title="View Details"
                  >
                    <Eye size={14} className="text-indigo-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(emp);
                    }}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    iconOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(emp.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
