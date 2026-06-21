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

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function EmployeeFormFields({ editEmployee }: { editEmployee: EmployeeObject | null }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EmployeeFormData>();

  const workSchedule = watch("workSchedule");
  const scheduleEnabled = workSchedule !== null && workSchedule !== undefined;
  const days = workSchedule?.days || [];
  const startTime = workSchedule?.startTime || "09:00";
  const endTime = workSchedule?.endTime || "17:00";

  const handleToggleSchedule = (checked: boolean) => {
    if (checked) {
      setValue("workSchedule", {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        startTime: "09:00",
        endTime: "17:00",
      });
    } else {
      setValue("workSchedule", null);
    }
  };

  const handleDayToggle = (day: string) => {
    let nextDays = [...days];
    if (nextDays.includes(day)) {
      nextDays = nextDays.filter((d) => d !== day);
    } else {
      nextDays.push(day);
    }
    setValue("workSchedule.days", nextDays);
  };

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

      <div className="mt-4 border-t border-white/10 pt-4">
        <label className="text-brand-primary-light mb-3 flex cursor-pointer items-center gap-2 text-sm font-medium select-none">
          <input
            type="checkbox"
            checked={scheduleEnabled}
            onChange={(e) => handleToggleSchedule(e.target.checked)}
            className="focus:ring-offset-brand-primary rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500"
          />
          Set Work Schedule
        </label>

        {scheduleEnabled && (
          <div className="space-y-4 rounded-xl border border-white/5 bg-white/5 p-4">
            <div>
              <span className="text-brand-primary-light mb-2 block text-[11px] font-bold tracking-wider uppercase">
                Work Days
              </span>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const active = days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        active
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "text-brand-primary-light bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-brand-primary-light mb-2 block text-[11px] font-bold tracking-wider uppercase">
                  Start Time
                </span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setValue("workSchedule.startTime", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-brand-primary-light mb-2 block text-[11px] font-bold tracking-wider uppercase">
                  End Time
                </span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setValue("workSchedule.endTime", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
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
