"use client";
import { motion } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { User, Mail, Phone, Save } from "lucide-react";
import { useProfileForm } from "../hooks";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Divider,
  FormField,
  Input,
  PageHeader,
  PageLoading,
  Typography,
} from "@/shared/components";

export function EmployeeProfilePage() {
  const { profile, loading, methods, onSubmit, isSaving, isDirty } = useProfileForm();

  if (loading) {
    return <PageLoading className="min-h-[300px]" />;
  }

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information" />

      <div className="max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6 flex items-center gap-5">
            <Avatar size="lg" className="text-[28px]">
              {profile?.name?.[0]?.toUpperCase() ?? "?"}
            </Avatar>
            <div>
              <Typography variant="h4" color="primary">
                {profile?.name}
              </Typography>
              <Typography variant="small" color="muted">
                {profile?.role} · {profile?.department}
              </Typography>
              <Badge variant={profile?.isSetup ? "success" : "warning"} className="mt-2">
                {profile?.isSetup ? "✓ Active Account" : "Pending Setup"}
              </Badge>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Edit Information</CardTitle>
              {isDirty && <Badge variant="warning">Unsaved changes</Badge>}
            </CardHeader>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <FormField
                  label={
                    <>
                      <User size={12} className="mr-1 inline" />
                      Full Name
                    </>
                  }
                  error={methods.formState.errors.name?.message}
                >
                  <Input {...methods.register("name")} />
                </FormField>

                <FormField
                  label={
                    <>
                      <Mail size={12} className="mr-1 inline" />
                      Email Address
                    </>
                  }
                  error={methods.formState.errors.email?.message}
                >
                  <Input type="email" {...methods.register("email")} />
                </FormField>

                <FormField
                  label={
                    <>
                      <Phone size={12} className="mr-1 inline" />
                      Phone Number
                    </>
                  }
                >
                  <Input type="tel" placeholder="+1 234 567 8900" {...methods.register("phone")} />
                </FormField>

                <Divider />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Department">
                    <Input value={profile?.department ?? ""} disabled readOnly />
                  </FormField>
                  <FormField label="Job Role">
                    <Input value={profile?.role ?? ""} disabled readOnly />
                  </FormField>
                </div>

                <Typography variant="caption" color="muted" className="mb-5">
                  Department and role can only be changed by your manager.
                </Typography>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-auto"
                  disabled={!isDirty}
                  loading={isSaving}
                  loadingText="Saving..."
                >
                  <Save size={16} /> Save Changes
                </Button>
              </form>
            </FormProvider>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
