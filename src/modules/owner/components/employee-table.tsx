"use client";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import type { EmployeeObject } from "@/common/models/employee";
import { Avatar, Badge, Button, Typography } from "@/shared/components";

interface EmployeeTableProps {
  employees: EmployeeObject[];
  onEdit: (emp: EmployeeObject) => void;
  onDelete: (id: string) => void;
}

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-primary bg-brand-primary-dark">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-brand-primary bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider text-brand-primary-light uppercase">
              Employee
            </th>
            <th className="border-b border-brand-primary bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider text-brand-primary-light uppercase">
              Department
            </th>
            <th className="border-b border-brand-primary bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider text-brand-primary-light uppercase">
              Role
            </th>
            <th className="border-b border-brand-primary bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider text-brand-primary-light uppercase">
              Contact
            </th>
            <th className="border-b border-brand-primary bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider text-brand-primary-light uppercase">
              Status
            </th>
            <th className="border-b border-brand-primary bg-white/2 px-5 py-3.5 text-left text-[11px] font-bold tracking-wider text-brand-primary-light uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <motion.tr
              key={emp.id}
              className="transition-colors hover:bg-brand-primary/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <td className="border-b border-brand-primary px-5 py-4 align-middle text-sm text-white last:border-b-0">
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
              <td className="border-b border-brand-primary px-5 py-4 align-middle text-sm text-white">
                {emp.department}
              </td>
              <td className="border-b border-brand-primary px-5 py-4 align-middle text-sm text-white">
                <Badge variant="purple">{emp.role}</Badge>
              </td>
              <td className="border-b border-brand-primary px-5 py-4 align-middle text-sm text-white">
                <Typography variant="small" color="muted">
                  {emp.phone ?? "—"}
                </Typography>
              </td>
              <td className="border-b border-brand-primary px-5 py-4 align-middle text-sm text-white">
                <Badge variant={emp.isSetup ? "success" : "warning"}>
                  {emp.isSetup ? "✓ Active" : "⏳ Pending"}
                </Badge>
              </td>
              <td className="border-b border-brand-primary px-5 py-4 align-middle text-sm text-white">
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={() => onEdit(emp)}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    iconOnly
                    onClick={() => onDelete(emp.id)}
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
