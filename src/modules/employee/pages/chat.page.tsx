"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { axiosInstance, getUser, connectSocket, disconnectSocket } from "@/common/lib";
import { API_GET_MESSAGES } from "@/common/models/chat";
import type { MessageObject, GetMessagesResponse } from "@/common/models/chat";
import { logger } from "@/shared/libs";
import { getTimestamp } from "@/shared/utils";
import {
  Avatar,
  Button,
  ChatMessage,
  PageHeader,
  PageLoading,
  Typography,
  TypingIndicator,
  chatContainerClass,
  chatHeaderClass,
  chatInputAreaClass,
  chatInputClass,
  chatMainClass,
  chatMessagesClass,
  chatSendBtnClass,
} from "@/shared/components";

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
      <PageHeader
        title="Chat with Manager"
        subtitle={
          connected ? (
            <Typography as="span" variant="small" color="success">
              ● Connected
            </Typography>
          ) : (
            <Typography as="span" variant="small" color="muted">
              ○ Connecting...
            </Typography>
          )
        }
      />

      <div className="border-brand-primary bg-brand-primary-dark flex h-[calc(100vh-160px)] overflow-hidden rounded-2xl border">
        <div className={chatMainClass}>
          <div className={chatHeaderClass}>
            <Avatar size="sm">M</Avatar>
            <div>
              <Typography variant="small" color="primary" className="font-semibold">
                Manager
              </Typography>
              <Typography variant="caption" color="success">
                ● Online
              </Typography>
            </div>
          </div>

          <div className={chatMessagesClass}>
            {loading ? (
              <PageLoading className="h-[200px]" />
            ) : messages.length === 0 ? (
              <div className="px-6 py-15 text-center">
                <MessageSquare
                  size={40}
                  className="text-brand-primary-light mx-auto mb-3 opacity-30"
                />
                <Typography variant="small" color="muted">
                  No messages yet. Say hello to your manager! 👋
                </Typography>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderRole === "employee";
                return (
                  <ChatMessage
                    key={msg.id}
                    isMine={isMine}
                    text={msg.text}
                    time={formatMessageTime(msg.timestamp)}
                    avatar={!isMine ? <Avatar size="sm">M</Avatar> : undefined}
                  />
                );
              })
            )}

            {isTyping && <TypingIndicator label="Manager is typing..." />}
            <div ref={messagesEndRef} />
          </div>

          <div className={chatInputAreaClass}>
            <textarea
              className={chatInputClass}
              placeholder="Type a message... (Enter to send)"
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <Button
              variant="custom"
              className={chatSendBtnClass}
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
