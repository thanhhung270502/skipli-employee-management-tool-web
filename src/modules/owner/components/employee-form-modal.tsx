"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Building } from "lucide-react";
import { FormProvider, useFormContext } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeObject } from "@/common/models/employee";
import type { EmployeeFormData } from "../hooks/use-employee-form";

interface EmployeeFormModalProps {
  open: boolean;
  editEmployee: EmployeeObject | null;
  methods: UseFormReturn<EmployeeFormData>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

function EmployeeFormFields({ editEmployee }: { editEmployee: EmployeeObject | null }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployeeFormData>();

  return (
    <>
      <div className="form-group">
        <label className="form-label">
          <User size={12} className="inline mr-1" />
          Full Name
        </label>
        <input
          className="form-input"
          placeholder="John Doe"
          {...register("name")}
        />
        {errors.name && (
          <p className="form-hint !text-[var(--danger)]">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          <Mail size={12} className="inline mr-1" />
          Email
        </label>
        <input
          type="email"
          className="form-input"
          placeholder="john@company.com"
          disabled={!!editEmployee}
          {...register("email")}
        />
        {errors.email && (
          <p className="form-hint !text-[var(--danger)]">
            {errors.email.message}
          </p>
        )}
        {!editEmployee && (
          <p className="form-hint">An invite email will be sent to this address</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">
            <Phone size={12} className="inline mr-1" />
            Phone
          </label>
          <input
            type="tel"
            className="form-input"
            placeholder="+1 234 567 8900"
            {...register("phone")}
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Building size={12} className="inline mr-1" />
            Department
          </label>
          <input
            className="form-input"
            placeholder="Engineering"
            {...register("department")}
          />
          {errors.department && (
            <p className="form-hint !text-[var(--danger)]">
              {errors.department.message}
            </p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Job Role</label>
        <input
          className="form-input"
          placeholder="Software Engineer"
          {...register("role")}
        />
      </div>
    </>
  );
}

export function EmployeeFormModal({
  open,
  editEmployee,
  methods,
  onSubmit,
  onClose,
  isSubmitting,
}: EmployeeFormModalProps) {
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
              <h2 className="modal-title">
                {editEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button className="modal-close" onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <EmployeeFormFields editEmployee={editEmployee} />
                <div className="flex gap-3 mt-2">
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
                        <span className="spinner" />{" "}
                        {editEmployee ? "Saving..." : "Creating..."}
                      </>
                    ) : editEmployee ? (
                      "Save Changes"
                    ) : (
                      "Add & Send Invite"
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
