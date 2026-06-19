"use client";
import { Building, Mail, Phone, User } from "lucide-react";
import { FormProvider, useFormContext } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeObject } from "@/common/models/employee";
import type { EmployeeFormData } from "../hooks/use-employee-form";
import { Button, FormField, Input, Modal } from "@/shared/components";

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
      <FormField
        label={
          <>
            <User size={12} className="mr-1 inline" />
            Full Name
          </>
        }
        error={errors.name?.message}
      >
        <Input placeholder="John Doe" {...register("name")} />
      </FormField>

      <FormField
        label={
          <>
            <Mail size={12} className="mr-1 inline" />
            Email
          </>
        }
        error={errors.email?.message}
        hint={!editEmployee ? "An invite email will be sent to this address" : undefined}
      >
        <Input
          type="email"
          placeholder="john@company.com"
          disabled={!!editEmployee}
          {...register("email")}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label={
            <>
              <Phone size={12} className="mr-1 inline" />
              Phone
            </>
          }
        >
          <Input type="tel" placeholder="+1 234 567 8900" {...register("phone")} />
        </FormField>

        <FormField
          label={
            <>
              <Building size={12} className="mr-1 inline" />
              Department
            </>
          }
          error={errors.department?.message}
        >
          <Input placeholder="Engineering" {...register("department")} />
        </FormField>
      </div>

      <FormField label="Job Role">
        <Input placeholder="Software Engineer" {...register("role")} />
      </FormField>
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
    <Modal
      open={open}
      onClose={onClose}
      title={editEmployee ? "Edit Employee" : "Add New Employee"}
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <EmployeeFormFields editEmployee={editEmployee} />
          <div className="mt-2 flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-2!"
              loading={isSubmitting}
              loadingText={editEmployee ? "Saving..." : "Creating..."}
            >
              {editEmployee ? "Save Changes" : "Add & Send Invite"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
