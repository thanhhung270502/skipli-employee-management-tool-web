"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { useEmployeeLogin } from "../hooks";
import { OtpInput } from "../components";
import {
  Alert,
  AuthCard,
  AuthHeading,
  AuthLogo,
  AuthPage,
  Button,
  DividerText,
  FormField,
  Input,
  Typography,
} from "@/shared/components";

export function EmployeeLoginPage() {
  const {
    step,
    loading,
    error,
    countdown,
    otp,
    email,
    otpRefs,
    emailMethods,
    handleSendOtp,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleValidateOtp,
    goBack,
  } = useEmployeeLogin();

  return (
    <AuthPage>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AuthCard>
          <AuthLogo />

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <AuthHeading
                  title="Employee Login"
                  subtitle="Enter your work email to receive an access code"
                />

                <FormProvider {...emailMethods}>
                  <form onSubmit={handleSendOtp}>
                    {error && <Alert>{error}</Alert>}
                    <FormField
                      label="Work Email"
                      error={emailMethods.formState.errors.email?.message}
                    >
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        autoFocus
                        {...emailMethods.register("email")}
                      />
                    </FormField>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                      loadingText="Sending..."
                    >
                      Send Access Code →
                    </Button>
                  </form>
                </FormProvider>

                <DividerText className="mt-6">Manager?</DividerText>
                <Button href="/login" variant="ghost" className="mt-2 w-full text-center">
                  Login as Manager
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Button
                  variant="custom"
                  onClick={goBack}
                  className="mb-4 flex cursor-pointer items-center gap-1.5 border-none bg-transparent text-[13px] text-brand-primary-light"
                >
                  ← Back
                </Button>
                <AuthHeading
                  title="Check Your Email"
                  subtitle={
                    <>
                      We sent a code to{" "}
                      <Typography as="strong" variant="small" color="primary">
                        {email}
                      </Typography>
                    </>
                  }
                />

                <form onSubmit={handleValidateOtp}>
                  {error && <Alert>{error}</Alert>}
                  <FormField>
                    <OtpInput
                      otp={otp}
                      onChange={handleOtpChange}
                      onKeyDown={handleOtpKeyDown}
                      onPaste={handleOtpPaste}
                      inputRefs={otpRefs}
                    />
                  </FormField>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    loadingText="Verifying..."
                  >
                    Login →
                  </Button>

                  <div className="mt-5 text-center">
                    {countdown > 0 ? (
                      <Typography variant="small" color="muted">
                        Resend in {countdown}s
                      </Typography>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        loading={loading}
                        variant="custom"
                        className="cursor-pointer border-none bg-transparent text-[13px] text-brand-primary-light"
                      >
                        Resend Code
                      </Button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>
      </motion.div>
    </AuthPage>
  );
}
