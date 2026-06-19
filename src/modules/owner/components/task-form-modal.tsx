"use client";
import { Calendar } from "lucide-react";
import { FormProvider, useFormContext } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeObject } from "@/common/models/employee";
import type { TaskFormData } from "../hooks/use-task-form";
import { Button, FormField, Input, Modal, Select, Textarea } from "@/shared/components";

interface TaskFormModalProps {
  open: boolean;
  employees: EmployeeObject[];
  methods: UseFormReturn<TaskFormData>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

function TaskFormFields({ employees }: { employees: EmployeeObject[] }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TaskFormData>();

  return (
    <>
      <FormField label="Task Title" error={errors.title?.message}>
        <Input placeholder="E.g. Fix login bug" {...register("title")} />
      </FormField>

      <FormField label="Description (optional)">
        <Textarea placeholder="Task details..." rows={3} {...register("description")} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Assign To"
          error={errors.assignedTo?.message}
          hint={employees.length === 0 ? "No active employees yet" : undefined}
        >
          <Select {...register("assignedTo")}>
            <option value="">Select employee...</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.department}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label={
            <>
              <Calendar size={12} className="mr-1 inline" />
              Due Date (optional)
            </>
          }
        >
          <Input type="date" {...register("dueDate")} />
        </FormField>
      </div>

      <FormField label="Priority">
        <Select {...register("priority")}>
          <option value="low">Low 🟢</option>
          <option value="medium">Medium 🟡</option>
          <option value="high">High 🔴</option>
        </Select>
      </FormField>
    </>
  );
}

export function TaskFormModal({
  open,
  employees,
  methods,
  onSubmit,
  onClose,
  isSubmitting,
  isEdit = false,
}: TaskFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Task" : "Create New Task"}>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <TaskFormFields employees={employees} />
          <div className="mt-4 flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-2!"
              loading={isSubmitting}
              loadingText={isEdit ? "Saving..." : "Creating..."}
            >
              {isEdit ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
