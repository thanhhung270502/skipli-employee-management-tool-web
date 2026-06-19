"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import {
  axiosInstance,
  getUser,
  connectSocket,
  disconnectSocket,
} from "@/common/lib";
import { API_GET_MESSAGES } from "@/common/models/chat";
import type { MessageObject, GetMessagesResponse } from "@/common/models/chat";
import { logger } from "@/shared/libs";
import { getTimestamp } from "@/shared/utils";

export function EmployeeChatPage() {
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user = getUser();

  const employeeId = user?.employee?.id ?? "";
  const roomId = `manager_${employeeId}`;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!employeeId) return;

    axiosInstance
      .get<GetMessagesResponse>(API_GET_MESSAGES.buildUrlPath(roomId))
      .then((res) => setMessages(res.data?.messages ?? []))
      .catch(logger.error)
      .finally(() => setLoading(false));

    const socket = connectSocket(user?.token ?? "");

    socket.emit("join_room", {
      roomId,
      userId: employeeId,
      role: "employee",
      name: user?.employee?.name ?? "Employee",
    });

    socket.on("room_joined", () => setConnected(true));

    socket.on("receive_message", (msg: MessageObject) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("user_typing", () => setIsTyping(true));
    socket.on("user_stopped_typing", () => setIsTyping(false));

    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = connectSocket(user?.token ?? "");

    socket.emit("send_message", {
      roomId,
      senderId: employeeId,
      senderName: user?.employee?.name ?? "Employee",
      senderRole: "employee",
      text: newMessage.trim(),
    });

    setNewMessage("");
    socket.emit("typing_stop", { roomId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    const socket = connectSocket(user?.token ?? "");
    socket.emit("typing_start", {
      roomId,
      senderName: user?.employee?.name ?? "Employee",
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { roomId });
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (ts: unknown): string => {
    const date = getTimestamp(ts);
    if (!date) return "";
    return format(date, "HH:mm");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Chat with Manager</h1>
          <p className="page-subtitle">
            {connected ? (
              <span className="text-[var(--success)]">● Connected</span>
            ) : (
              <span className="text-[var(--text-muted)]">
                ○ Connecting...
              </span>
            )}
          </p>
        </div>
      </div>

      <div
        className="chat-container !h-[calc(100vh-160px)] !rounded-[var(--radius-lg)]"
      >
        <div className="chat-main">
          <div className="chat-header">
            <div className="avatar avatar-sm">M</div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">
                Manager
              </p>
              <p className="text-xs text-[var(--success)]">● Online</p>
            </div>
          </div>

          <div className="chat-messages">
            {loading ? (
              <div className="page-loading !h-[200px]">
                <div className="spinner spinner-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div
                className="text-center py-[60px] px-6 text-[var(--text-muted)]"
              >
                <MessageSquare
                  size={40}
                  className="mx-auto mb-3 opacity-30"
                />
                <p className="text-sm">
                  No messages yet. Say hello to your manager! 👋
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderRole === "employee";
                return (
                  <div
                    key={msg.id}
                    className={`chat-message ${isMine ? "sent" : ""}`}
                  >
                    {!isMine && <div className="avatar avatar-sm">M</div>}
                    <div>
                      <div
                        className={`chat-bubble ${isMine ? "sent" : "received"}`}
                      >
                        {msg.text}
                      </div>
                      <div className="chat-timestamp">
                        {formatMessageTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="chat-typing">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
                <span className="ml-1">Manager is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              className="chat-input"
              placeholder="Type a message... (Enter to send)"
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
