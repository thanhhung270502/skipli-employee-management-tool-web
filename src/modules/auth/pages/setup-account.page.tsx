"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { useSetupAccount } from "../hooks";
import {
  Alert,
  AuthCard,
  AuthHeading,
  AuthLogo,
  AuthPage,
  Badge,
  Button,
  FormField,
  Input,
  PageLoading,
  Typography,
} from "@/shared/components";

function SetupAccountContent() {
  const { loading, error, employeeInfo, methods, onSubmit, isSubmitting, rootError } =
    useSetupAccount();

  if (loading) {
    return (
      <AuthPage>
        <PageLoading className="min-h-screen">
          <Typography variant="small" color="muted">
            Verifying invite link...
          </Typography>
        </PageLoading>
      </AuthPage>
    );
  }

  return (
    <AuthPage>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AuthCard>
          <AuthLogo />

          {error && !employeeInfo ? (
            <div>
              <AuthHeading title="Invalid Link" />
              <Alert>{error}</Alert>
              <Button href="/employee-login" variant="primary" className="mt-4">
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Badge variant="success" className="mb-4">
                  ✓ Invite Verified
                </Badge>
                <AuthHeading
                  title="Set Up Your Account"
                  subtitle={
                    <>
                      Welcome,{" "}
                      <Typography as="strong" variant="small" color="primary">
                        {employeeInfo?.name}
                      </Typography>
                      ! Create your login credentials.
                    </>
                  }
                />
              </div>

              <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                  {(rootError || error) && <Alert>{rootError ?? error}</Alert>}

                  <FormField label="Username" error={methods.formState.errors.username?.message}>
                    <Input
                      type="text"
                      placeholder="Choose a username"
                      autoFocus
                      {...methods.register("username")}
                    />
                  </FormField>

                  <FormField label="Password" error={methods.formState.errors.password?.message}>
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      {...methods.register("password")}
                    />
                  </FormField>

                  <FormField
                    label="Confirm Password"
                    error={methods.formState.errors.confirmPassword?.message}
                  >
                    <Input
                      type="password"
                      placeholder="Repeat your password"
                      {...methods.register("confirmPassword")}
                    />
                  </FormField>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isSubmitting}
                    loadingText="Setting up..."
                  >
                    Complete Setup →
                  </Button>
                </form>
              </FormProvider>
            </>
          )}
        </AuthCard>
      </motion.div>
    </AuthPage>
  );
}

export function SetupAccountPage() {
  return (
    <Suspense fallback={<PageLoading className="min-h-screen" />}>
      <SetupAccountContent />
    </Suspense>
  );
}
