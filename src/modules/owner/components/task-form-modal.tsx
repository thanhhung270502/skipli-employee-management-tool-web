"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { FormProvider, useFormContext } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeObject } from "@/common/models/employee";
import type { TaskFormData } from "../hooks/use-task-form";

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
  const { register, formState: { errors } } = useFormContext<TaskFormData>();

  return (
    <>
      <div className="form-group">
        <label className="form-label">Task Title</label>
        <input
          className="form-input"
          placeholder="E.g. Fix login bug"
          {...register("title")}
        />
        {errors.title && (
          <p className="form-hint !text-[var(--danger)]">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Description (optional)</label>
        <textarea
          className="form-input resize-y"
          placeholder="Task details..."
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Assign To</label>
          <select
            className="form-input cursor-pointer"
            {...register("assignedTo")}
          >
            <option value="">Select employee...</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.department}
              </option>
            ))}
          </select>
          {errors.assignedTo && (
            <p className="form-hint !text-[var(--danger)]">
              {errors.assignedTo.message}
            </p>
          )}
          {employees.length === 0 && (
            <p className="form-hint !text-[var(--warning)]">
              No active employees yet
            </p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">
            <Calendar size={12} className="inline mr-1" />
            Due Date (optional)
          </label>
          <input
            type="date"
            className="form-input"
            {...register("dueDate")}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Priority</label>
        <select
          className="form-input cursor-pointer"
          {...register("priority")}
        >
          <option value="low">Low 🟢</option>
          <option value="medium">Medium 🟡</option>
          <option value="high">High 🔴</option>
        </select>
      </div>
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
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="modal-header">
              <h2 className="modal-title">{isEdit ? "Edit Task" : "Create New Task"}</h2>
              <button className="modal-close" onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <TaskFormFields employees={employees} />
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-ghost flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary !flex-[2]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner" /> {isEdit ? "Saving..." : "Creating..."}
                      </>
                    ) : (
                      isEdit ? "Save Changes" : "Create Task"
                    )}
                  </button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

