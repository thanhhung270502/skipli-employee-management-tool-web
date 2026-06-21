"use client";
import { Calendar } from "lucide-react";
import { FormProvider, useFormContext, Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeObject } from "@/common/models/employee";
import { ETaskPriority } from "@/common/models/task";
import type { TaskFormData } from "../hooks/use-task-form";
import {
  Button,
  FormField,
  Input,
  Modal,
  Select,
  Textarea,
  getOptionsValue,
  onSelectChange,
} from "@/shared/components";

const PRIORITY_OPTIONS = [
  { value: ETaskPriority.LOW, label: "Low 🟢" },
  { value: ETaskPriority.MEDIUM, label: "Medium 🟡" },
  { value: ETaskPriority.HIGH, label: "High 🔴" },
];

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
    control,
    formState: { errors },
  } = useFormContext<TaskFormData>();

  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: `${e.name} — ${e.department}`,
  }));

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
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <Select
                options={employeeOptions}
                value={getOptionsValue(employeeOptions, field.value) ?? null}
                onChange={onSelectChange(field.onChange)}
                placeholder="Select employee..."
                disabled={employees.length === 0}
                isSearchable
                isClearable={false}
                fullWidth
              />
            )}
          />
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
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              options={PRIORITY_OPTIONS}
              value={getOptionsValue(PRIORITY_OPTIONS, field.value) ?? null}
              onChange={onSelectChange(field.onChange)}
              isSearchable={false}
              isClearable={false}
              fullWidth
            />
          )}
        />
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
