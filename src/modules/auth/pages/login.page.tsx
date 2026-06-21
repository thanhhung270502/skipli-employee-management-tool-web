"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { useOwnerLogin } from "../hooks";
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

export function LoginPage() {
  const {
    step,
    loading,
    error,
    countdown,
    otp,
    phoneNumber,
    otpRefs,
    phoneMethods,
    handleSendOtp,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleValidateOtp,
    goBack,
  } = useOwnerLogin();

  return (
    <AuthPage>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <AuthCard>
          <AuthLogo />

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <AuthHeading
                  title="Manager Login"
                  subtitle="Enter your phone number to receive an OTP via SMS"
                />

                <FormProvider {...phoneMethods}>
                  <form onSubmit={handleSendOtp}>
                    {error && <Alert>{error}</Alert>}
                    <FormField
                      label="Phone Number"
                      hint="Include country code (e.g. +1 for US)"
                      error={phoneMethods.formState.errors.phoneNumber?.message}
                    >
                      <Input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        autoFocus
                        {...phoneMethods.register("phoneNumber")}
                      />
                    </FormField>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                      loadingText="Sending..."
                    >
                      Send OTP →
                    </Button>
                  </form>
                </FormProvider>

                <DividerText className="mt-6">Employee?</DividerText>
                <Button href="/employee-login" variant="ghost" className="mt-2 w-full text-center">
                  Login as Employee
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
                  className="text-brand-primary-light mb-4 flex cursor-pointer items-center gap-1.5 border-none bg-transparent text-[13px]"
                >
                  ← Back
                </Button>
                <AuthHeading
                  title="Enter Access Code"
                  subtitle={
                    <>
                      We sent a 6-digit code to{" "}
                      <Typography as="strong" variant="small" color="primary">
                        {phoneNumber}
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
                    Verify & Login →
                  </Button>

                  <div className="mt-5 text-center">
                    {countdown > 0 ? (
                      <Typography variant="small" color="muted">
                        Resend in {countdown}s
                      </Typography>
                    ) : (
                      <Button
                        type="button"
                        onClick={() =>
                          phoneMethods.handleSubmit(() =>
                            handleSendOtp(new Event("submit") as unknown as React.FormEvent)
                          )()
                        }
                        loading={loading}
                        variant="custom"
                        className="text-brand-primary-light cursor-pointer border-none bg-transparent text-[13px]"
                      >
                        Resend OTP
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
