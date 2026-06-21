"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import {
  useQueryEmployees,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "@/shared/hooks";
import {
  Button,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  TableSkeleton,
  Typography,
} from "@/shared/components";
import type { EmployeeObject } from "@/common/models/employee";
import { useEmployeeForm } from "../hooks";
import { EmployeeFormModal, EmployeeTable, EmployeeDetailModal } from "../components";

export function EmployeesPage() {
  const { data, isLoading } = useQueryEmployees();
  const employees = data?.employees ?? [];

  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeeObject | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeObject | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { methods, resetForAdd, resetForEdit } = useEmployeeForm();

  const openAddModal = () => {
    setEditEmployee(null);
    resetForAdd();
    setModalOpen(true);
  };

  const openEditModal = (emp: EmployeeObject) => {
    setEditEmployee(emp);
    resetForEdit(emp);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditEmployee(null);
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      if (editEmployee) {
        await updateMutation.mutateAsync({ employeeId: editEmployee.id, ...data });
        toast.success("Employee updated!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Employee created! Invite email sent.");
      }
      closeModal();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? "Operation failed");
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Employee removed");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} team member${employees.length !== 1 ? "s" : ""}`}
        action={
          <Button variant="primary" className="w-auto" onClick={openAddModal}>
            <Plus size={16} /> Add Employee
          </Button>
        }
      />

      <div className="mb-6">
        <Input
          type="text"
          className="max-w-[400px]"
          placeholder="Search by name, email, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title={search ? "No results found" : "No employees yet"}
          description={
            search ? "Try a different search term" : "Add your first employee to get started"
          }
          action={
            !search ? (
              <Button variant="primary" className="mt-4 w-auto" onClick={openAddModal}>
                <Plus size={16} /> Add Employee
              </Button>
            ) : undefined
          }
        />
      ) : (
        <EmployeeTable
          employees={filtered}
          onEdit={openEditModal}
          onDelete={setDeleteConfirm}
          onViewDetail={setDetailEmployee}
        />
      )}

      <EmployeeFormModal
        open={modalOpen}
        editEmployee={editEmployee}
        methods={methods}
        onSubmit={handleSubmit}
        onClose={closeModal}
        isSubmitting={isSubmitting}
      />

      <EmployeeDetailModal
        open={!!detailEmployee}
        employee={detailEmployee}
        onClose={() => setDetailEmployee(null)}
      />

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Employee?"
        maxWidthClassName="max-w-[380px]"
      >
        <div className="py-2 text-center">
          <div className="mb-4 text-[48px]">⚠️</div>
          <Typography variant="small" color="muted" className="mb-6">
            This action cannot be undone. The employee will lose access immediately.
          </Typography>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              loading={deleteMutation.isPending}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
