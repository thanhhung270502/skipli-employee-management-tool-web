"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import {
  useQueryEmployees,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useTablePagination,
} from "@/shared/hooks";
import {
  Button,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  Pagination,
  TableSkeleton,
  Typography,
} from "@/shared/components";
import { DEFAULT_PAGE_SIZE } from "@/common/types";
import type { EmployeeObject } from "@/common/models/employee";
import { useEmployeeForm } from "../hooks";
import { EmployeeFormModal, EmployeeTable, EmployeeDetailModal } from "../components";

export function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { pagination, setPagination } = useTablePagination();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching } = useQueryEmployees({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });
  const employees = data?.employees ?? [];
  const totalEmployees = data?.total_record ?? 0;

  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<EmployeeObject | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeObject | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle={`${totalEmployees} team member${totalEmployees !== 1 ? "s" : ""}`}
        action={
          <Button variant="secondary" className="w-auto" onClick={openAddModal}>
            <Plus size={16} /> Add Employee
          </Button>
        }
      />

      <div className="mb-6">
        <Input
          type="text"
          className="max-w-[400px] rounded-full"
          placeholder="Search by name, email, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : employees.length === 0 ? (
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
        <div className="space-y-4">
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            isFetching={isFetching}
            totalItems={totalEmployees}
            pagination={pagination}
            setPagination={setPagination}
            onEdit={openEditModal}
            onDelete={setDeleteConfirm}
            onViewDetail={setDetailEmployee}
          />
        </div>
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
            <Button variant="primary" className="flex-1" onClick={() => setDeleteConfirm(null)}>
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
