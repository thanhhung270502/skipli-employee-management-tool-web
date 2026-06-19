"use client";
import { motion } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { User, Mail, Phone, Save } from "lucide-react";
import { useProfileForm } from "../hooks";
import { Badge } from "@/shared/components";


export function EmployeeProfilePage() {
  const { profile, loading, methods, onSubmit, isSaving, isDirty } =
    useProfileForm();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
      </div>

      <div className="max-w-[600px]">
        <motion.div
          className="card flex items-center gap-5 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="avatar avatar-lg !text-[28px]">
            {profile?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {profile?.name}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {profile?.role} · {profile?.department}
            </p>
            <Badge
              variant={profile?.isSetup ? "success" : "warning"}
              className="mt-2"
            >
              {profile?.isSetup ? "✓ Active Account" : "Pending Setup"}
            </Badge>

          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <span className="card-title">Edit Information</span>
            {isDirty && (
              <Badge variant="warning">Unsaved changes</Badge>

            )}
          </div>

          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <User size={12} className="inline mr-1" />
                  Full Name
                </label>
                <input
                  className="form-input"
                  {...methods.register("name")}
                />
                {methods.formState.errors.name && (
                  <p className="form-hint !text-[var(--danger)]">
                    {methods.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={12} className="inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  {...methods.register("email")}
                />
                {methods.formState.errors.email && (
                  <p className="form-hint !text-[var(--danger)]">
                    {methods.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={12} className="inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+1 234 567 8900"
                  {...methods.register("phone")}
                />
              </div>

              <hr className="divider" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    className="form-input"
                    value={profile?.department ?? ""}
                    disabled
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Role</label>
                  <input
                    className="form-input"
                    value={profile?.role ?? ""}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              <p className="form-hint mb-5">
                Department and role can only be changed by your manager.
              </p>

              <button
                type="submit"
                className="btn btn-primary w-auto"
                disabled={isSaving || !isDirty}
              >
                {isSaving ? (
                  <>
                    <span className="spinner" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
}
