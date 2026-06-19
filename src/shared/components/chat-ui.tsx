import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

export const chatContainerClass =
  "flex h-[calc(100vh-160px)] overflow-hidden rounded-2xl border border-brand-primary bg-brand-primary-dark";

export const chatSidebarClass =
  "flex w-[280px] flex-col border-r border-brand-primary bg-brand-primary-dark";

export const chatSidebarHeaderClass =
  "border-b border-brand-primary px-5 py-5 text-base font-bold text-white";

export const chatContactClass =
  "flex cursor-pointer items-center gap-3 border-b border-brand-primary px-5 py-3.5 transition-colors hover:bg-brand-primary/10";

export const chatContactActiveClass =
  "border-l-[3px] border-l-brand-primary-light bg-brand-primary/15";

export const chatMainClass = "flex min-w-0 flex-1 flex-col";

export const chatHeaderClass =
  "flex items-center gap-3 border-b border-brand-primary bg-brand-primary-dark px-6 py-4";

export const chatMessagesClass = "flex flex-1 flex-col gap-3 overflow-y-auto p-6";

export const chatInputAreaClass =
  "flex items-end gap-3 border-t border-brand-primary bg-brand-primary-dark px-6 py-4";

export const chatInputClass =
  "max-h-[120px] flex-1 resize-none rounded-full border border-brand-primary bg-brand-primary-dark-hover px-5 py-3 font-[inherit] text-sm text-white outline-none transition-all focus:border-brand-primary-light";

export const chatSendBtnClass =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white shadow-md transition-all hover:scale-105 disabled:opacity-50";

export function getMessageRowClass(isMine: boolean) {
  return cn(
    "flex max-w-[75%] gap-2.5 animate-[messageIn_0.2s_ease-out]",
    isMine && "flex-row-reverse self-end"
  );
}

export function getBubbleClass(isMine: boolean) {
  return cn(
    "max-w-full rounded-[18px] px-4 py-3 text-sm leading-relaxed",
    isMine
      ? "rounded-br-sm bg-brand-primary text-white"
      : "rounded-bl-sm bg-brand-primary-dark-hover text-white"
  );
}

type TypingIndicatorProps = {
  label: string;
};

export function TypingIndicator({ label }: TypingIndicatorProps) {
  return (
    <div className="text-brand-primary-light flex items-center gap-1 px-3 py-2 text-xs">
      <span className="bg-brand-primary-light size-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
      <span className="bg-brand-primary-light size-1.5 animate-bounce rounded-full [animation-delay:200ms]" />
      <span className="bg-brand-primary-light size-1.5 animate-bounce rounded-full [animation-delay:400ms]" />
      <span className="ml-1">{label}</span>
    </div>
  );
}

type ChatMessageProps = {
  isMine: boolean;
  text: string;
  time: string;
  avatar?: ReactNode;
};

export function ChatMessage({ isMine, text, time, avatar }: ChatMessageProps) {
  return (
    <div className={getMessageRowClass(isMine)}>
      {!isMine && avatar}
      <div>
        <div className={getBubbleClass(isMine)}>{text}</div>
        <p className="text-brand-primary-light mt-1 text-right text-[11px]">{time}</p>
      </div>
    </div>
  );
}
