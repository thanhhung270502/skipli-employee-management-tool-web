"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import type { EmployeeObject } from "@/common/models/employee";
import { Badge } from "@/shared/components";


interface EmployeeTableProps {
  employees: EmployeeObject[];
  onEdit: (emp: EmployeeObject) => void;
  onDelete: (id: string) => void;
}

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Role</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <motion.tr
              key={emp.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-sm">
                    {emp.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {emp.email}
                    </p>
                  </div>
                </div>
              </td>
              <td>{emp.department}</td>
              <td>
                <Badge variant="purple">{emp.role}</Badge>

              </td>
              <td>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  {emp.phone ?? "—"}
                </p>
              </td>
              <td>
                <Badge variant={emp.isSetup ? "success" : "warning"}>
                  {emp.isSetup ? "✓ Active" : "⏳ Pending"}
                </Badge>

              </td>
              <td>
                <div className="flex gap-1.5">
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => onEdit(emp)}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={() => onDelete(emp.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
