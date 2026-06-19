"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FormProvider } from "react-hook-form";
import { useOwnerLogin } from "../hooks";
import { OtpInput } from "../components";

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
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span className="auth-logo-text">Skipli</span>
        </div>

        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="auth-title">Manager Login</h1>
              <p className="auth-subtitle">
                Enter your phone number to receive an OTP via SMS
              </p>

              <FormProvider {...phoneMethods}>
                <form onSubmit={handleSendOtp}>
                  {error && <div className="alert alert-error">{error}</div>}
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+1 234 567 8900"
                      autoFocus
                      {...phoneMethods.register("phoneNumber")}
                    />
                    {phoneMethods.formState.errors.phoneNumber && (
                      <p className="form-hint !text-[var(--danger)]">
                        {phoneMethods.formState.errors.phoneNumber.message}
                      </p>
                    )}
                    <p className="form-hint">Include country code (e.g. +1 for US)</p>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" /> Sending...
                      </>
                    ) : (
                      "Send OTP →"
                    )}
                  </button>
                </form>
              </FormProvider>

              <div className="divider-text mt-6">
                <span>Employee?</span>
              </div>
              <a
                href="/employee-login"
                className="btn btn-ghost w-full mt-2 text-center"
              >
                Login as Employee
              </a>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={goBack}
                className="bg-none border-none cursor-pointer text-[var(--text-secondary)] text-[13px] mb-4 flex items-center gap-1.5"
              >
                ← Back
              </button>
              <h1 className="auth-title">Enter Access Code</h1>
              <p className="auth-subtitle">
                We sent a 6-digit code to{" "}
                <strong className="text-[var(--text-primary)]">
                  {phoneNumber}
                </strong>
              </p>

              <form onSubmit={handleValidateOtp}>
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-group">
                  <OtpInput
                    otp={otp}
                    onChange={handleOtpChange}
                    onKeyDown={handleOtpKeyDown}
                    onPaste={handleOtpPaste}
                    inputRefs={otpRefs}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Verifying...
                    </>
                  ) : (
                    "Verify & Login →"
                  )}
                </button>

                <div className="text-center mt-5">
                  {countdown > 0 ? (
                    <span className="text-[13px] text-[var(--text-muted)]">
                      Resend in {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        phoneMethods.handleSubmit((data) =>
                          handleSendOtp(
                            new Event("submit") as unknown as React.FormEvent
                          )
                        )()
                      }
                      disabled={loading}
                      className="bg-none border-none cursor-pointer text-[var(--accent-primary)] text-[13px]"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
