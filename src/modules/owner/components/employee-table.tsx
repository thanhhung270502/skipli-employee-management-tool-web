"use client";
import { motion } from "framer-motion";
import { Edit2, Trash2, Eye } from "lucide-react";
import type { EmployeeObject } from "@/common/models/employee";
import {
  Avatar,
  Badge,
  Button,
  ColumnDef,
  PaginationState,
  Table,
  Typography,
} from "@/shared/components";
import { useMemo } from "react";

interface EmployeeTableProps {
  employees: EmployeeObject[];
  isLoading: boolean;
  isFetching: boolean;
  totalItems: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  onEdit: (emp: EmployeeObject) => void;
  onDelete: (id: string) => void;
  onViewDetail: (emp: EmployeeObject) => void;
}

export function EmployeeTable({
  employees,
  isLoading,
  isFetching,
  totalItems,
  pagination,
  setPagination,
  onEdit,
  onDelete,
  onViewDetail,
}: EmployeeTableProps) {
  const columns = useMemo<ColumnDef<EmployeeObject>[]>(
    () => [
      {
        header: "Employee",
        id: "employee",
        cell: ({ row }) => {
          const emp = row.original;
          return (
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
          );
        },
      },
      {
        header: "Department",
        id: "department",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <Typography variant="small" color="primary">
              {emp.department}
            </Typography>
          );
        },
      },
      {
        header: "Role",
        id: "role",
        cell: ({ row }) => {
          const emp = row.original;
          return <Badge variant="purple">{emp.role}</Badge>;
        },
      },
      {
        header: "Schedule",
        id: "schedule",
        cell: ({ row }) => {
          const emp = row.original;
          if (!emp.workSchedule) return "--";
          return (
            <div className="flex flex-col">
              <Typography variant="small" color="primary" className="text-purple font-semibold">
                {emp.workSchedule.days.join(", ")}
              </Typography>
              <Typography variant="caption" color="muted">
                {emp.workSchedule.startTime} - {emp.workSchedule.endTime}
              </Typography>
            </div>
          );
        },
      },
      {
        header: "Contact",
        id: "contact",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <Typography variant="small" color="primary">
              {emp.phone ?? "—"}
            </Typography>
          );
        },
      },
      {
        header: "Status",
        id: "status",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <Badge variant={emp.isSetup ? "success" : "warning"}>
              {emp.isSetup ? "✓ Active" : "⏳ Pending"}
            </Badge>
          );
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const emp = row.original;
          return (
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
                rounded="full"
                className="bg-transparent hover:bg-white/10"
              >
                <Eye size={16} className="text-purple" />
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
                rounded="full"
                className="bg-transparent hover:bg-white/10"
              >
                <Edit2 size={16} />
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
                rounded="full"
                className="bg-transparent hover:bg-white/10"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <Table
        columns={columns}
        data={employees}
        pagination={pagination}
        setPagination={setPagination}
        manualPagination={true}
        rowCount={totalItems}
      />
    </>
  );
}
