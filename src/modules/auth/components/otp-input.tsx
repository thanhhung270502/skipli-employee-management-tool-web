"use client";
import React from "react";
import { cn } from "@/shared/utils";

interface OtpInputProps {
  otp: string[];
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}

const otpInputClassName =
  "size-[52px] h-[60px] rounded-md border-2 border-brand-primary bg-brand-primary-dark-hover text-center text-2xl font-bold text-white outline-none transition-all focus:scale-105 focus:border-brand-primary-light focus:ring-[3px] focus:ring-brand-primary-light/20";

export function OtpInput({ otp, onChange, onKeyDown, onPaste, inputRefs }: OtpInputProps) {
  return (
    <div className="flex justify-center gap-2.5" onPaste={onPaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className={cn("w-[52px]", otpInputClassName)}
        />
      ))}
    </div>
  );
}
