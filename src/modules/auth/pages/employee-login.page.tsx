"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { useEmployeeLogin, useEmployeePasswordLogin } from "../hooks";
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
  PageLoading,
} from "@/shared/components";

function EmployeeLoginFormContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [activeTab, setActiveTab] = useState<"username" | "otp">("username");

  useEffect(() => {
    if (mode === "otp") {
      setActiveTab("otp");
    } else if (mode === "password") {
      setActiveTab("username");
    }
  }, [mode]);

  const otpLogin = useEmployeeLogin();
  const passwordLogin = useEmployeePasswordLogin();

  return (
    <AuthPage>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AuthCard>
          <AuthLogo />

          {/* Dual Login Mode Tabs */}
          <div className="mb-6 flex rounded-xl border border-white/5 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("username")}
              className={`flex-1 cursor-pointer rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "username"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-brand-primary-light hover:text-white"
              }`}
            >
              Username & Password
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("otp")}
              className={`flex-1 cursor-pointer rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "otp"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-brand-primary-light hover:text-white"
              }`}
            >
              Email OTP
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "username" ? (
              <motion.div
                key="username"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <AuthHeading
                  title="Employee Login"
                  subtitle="Enter your username and password to access your tasks"
                />

                <FormProvider {...passwordLogin.methods}>
                  <form onSubmit={passwordLogin.onSubmit}>
                    {passwordLogin.error && <Alert>{passwordLogin.error}</Alert>}
                    <FormField
                      label="Username"
                      error={passwordLogin.methods.formState.errors.username?.message}
                    >
                      <Input
                        type="text"
                        placeholder="your_username"
                        autoFocus
                        {...passwordLogin.methods.register("username")}
                      />
                    </FormField>

                    <FormField
                      label="Password"
                      error={passwordLogin.methods.formState.errors.password?.message}
                    >
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...passwordLogin.methods.register("password")}
                      />
                    </FormField>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={passwordLogin.loading}
                      loadingText="Logging in..."
                    >
                      Login →
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
                {otpLogin.step === "email" ? (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AuthHeading
                      title="Employee OTP Login"
                      subtitle="Enter your work email to receive an access code"
                    />

                    <FormProvider {...otpLogin.emailMethods}>
                      <form onSubmit={otpLogin.handleSendOtp}>
                        {otpLogin.error && <Alert>{otpLogin.error}</Alert>}
                        <FormField
                          label="Work Email"
                          error={otpLogin.emailMethods.formState.errors.email?.message}
                        >
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            autoFocus
                            {...otpLogin.emailMethods.register("email")}
                          />
                        </FormField>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          loading={otpLogin.loading}
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
                      onClick={otpLogin.goBack}
                      className="text-brand-primary-light mb-4 flex cursor-pointer items-center gap-1.5 border-none bg-transparent text-[13px]"
                    >
                      ← Back
                    </Button>
                    <AuthHeading
                      title="Check Your Email"
                      subtitle={
                        <>
                          We sent a code to{" "}
                          <Typography as="strong" variant="small" color="primary">
                            {otpLogin.email}
                          </Typography>
                        </>
                      }
                    />

                    <form onSubmit={otpLogin.handleValidateOtp}>
                      {otpLogin.error && <Alert>{otpLogin.error}</Alert>}
                      <FormField>
                        <OtpInput
                          otp={otpLogin.otp}
                          onChange={otpLogin.handleOtpChange}
                          onKeyDown={otpLogin.handleOtpKeyDown}
                          onPaste={otpLogin.handleOtpPaste}
                          inputRefs={otpLogin.otpRefs}
                        />
                      </FormField>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={otpLogin.loading}
                        loadingText="Verifying..."
                      >
                        Login →
                      </Button>

                      <div className="mt-5 text-center">
                        {otpLogin.countdown > 0 ? (
                          <Typography variant="small" color="muted">
                            Resend in {otpLogin.countdown}s
                          </Typography>
                        ) : (
                          <Button
                            type="button"
                            onClick={otpLogin.handleSendOtp}
                            loading={otpLogin.loading}
                            variant="custom"
                            className="text-brand-primary-light cursor-pointer border-none bg-transparent text-[13px]"
                          >
                            Resend Code
                          </Button>
                        )}
                      </div>
                    </form>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </AuthCard>
      </motion.div>
    </AuthPage>
  );
}

export function EmployeeLoginPage() {
  return (
    <Suspense fallback={<PageLoading className="min-h-screen" />}>
      <EmployeeLoginFormContent />
    </Suspense>
  );
}
