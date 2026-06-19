"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { axiosInstance, getUser, connectSocket, disconnectSocket, getRoomId } from "@/common/lib";
import { useQueryEmployees } from "@/shared/hooks";
import { API_GET_MESSAGES } from "@/common/models/chat";
import type { MessageObject, GetMessagesResponse } from "@/common/models/chat";
import type { EmployeeObject } from "@/common/models/employee";
import { logger } from "@/shared/libs";
import { getTimestamp, cn } from "@/shared/utils";
import {
  Avatar,
  Button,
  ChatMessage,
  EmptyState,
  PageHeader,
  PageLoading,
  Typography,
  TypingIndicator,
  chatContactActiveClass,
  chatContactClass,
  chatContainerClass,
  chatHeaderClass,
  chatInputAreaClass,
  chatInputClass,
  chatMainClass,
  chatMessagesClass,
  chatSendBtnClass,
  chatSidebarClass,
  chatSidebarHeaderClass,
} from "@/shared/components";

export function ChatPage() {
  const { data, isLoading } = useQueryEmployees();
  const employees = (data?.employees ?? []).filter((e) => e.isSetup);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeObject | null>(null);
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user = getUser();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  const selectEmployee = async (emp: EmployeeObject) => {
    setSelectedEmployee(emp);
    setMessages([]);

    const roomId = getRoomId(user?.phoneNumber ?? "", emp.id);

    try {
      const res = await axiosInstance.get<GetMessagesResponse>(
        API_GET_MESSAGES.buildUrlPath(roomId)
      );
      setMessages(res.data?.messages ?? []);
    } catch (e) {
      logger.error("Failed to load messages:", { e });
    }

    const socket = connectSocket(user?.token ?? "");
    socket.off("receive_message");
    socket.off("user_typing");
    socket.off("user_stopped_typing");

    socket.emit("join_room", {
      roomId,
      userId: user?.phoneNumber,
      role: "owner",
      name: "Manager",
    });

    socket.on("receive_message", (msg: MessageObject) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("user_typing", ({ senderName }: { senderName: string }) => {
      setTypingUser(senderName);
      setIsTyping(true);
    });

    socket.on("user_stopped_typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedEmployee) return;
    const socket = connectSocket(user?.token ?? "");
    const roomId = getRoomId(user?.phoneNumber ?? "", selectedEmployee.id);

    socket.emit("send_message", {
      roomId,
      senderId: user?.phoneNumber,
      senderName: "Manager",
      senderRole: "owner",
      text: newMessage.trim(),
    });
    setNewMessage("");
    socket.emit("typing_stop", { roomId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (!selectedEmployee) return;
    const socket = connectSocket(user?.token ?? "");
    const roomId = getRoomId(user?.phoneNumber ?? "", selectedEmployee.id);

    socket.emit("typing_start", { roomId, senderName: "Manager" });
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
      <PageHeader title="Chat" subtitle="Real-time messaging with your team" />

      <div className={chatContainerClass}>
        <div className={chatSidebarClass}>
          <div className={chatSidebarHeaderClass}>💬 Conversations</div>
          {isLoading ? (
            <PageLoading className="h-[200px]" />
          ) : employees.length === 0 ? (
            <EmptyState icon="👥" title="No active employees" className="p-6!" />
          ) : (
            employees.map((emp) => (
              <div
                key={emp.id}
                className={cn(
                  chatContactClass,
                  selectedEmployee?.id === emp.id && chatContactActiveClass
                )}
                onClick={() => selectEmployee(emp)}
              >
                <Avatar size="sm">{emp.name[0].toUpperCase()}</Avatar>
                <div className="min-w-0 flex-1">
                  <Typography variant="small" color="primary" className="truncate font-semibold">
                    {emp.name}
                  </Typography>
                  <Typography variant="caption" color="muted" className="truncate">
                    {emp.department}
                  </Typography>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={chatMainClass}>
          {!selectedEmployee ? (
            <PageLoading className="h-full">
              <MessageSquare size={40} className="text-brand-primary-light opacity-40" />
              <Typography variant="small" color="muted">
                Select an employee to start chatting
              </Typography>
            </PageLoading>
          ) : (
            <>
              <div className={chatHeaderClass}>
                <Avatar size="sm">{selectedEmployee.name[0].toUpperCase()}</Avatar>
                <div>
                  <Typography variant="small" color="primary" className="font-semibold">
                    {selectedEmployee.name}
                  </Typography>
                  <Typography variant="caption" color="success">
                    ● Online
                  </Typography>
                </div>
              </div>

              <div className={chatMessagesClass}>
                {messages.length === 0 && (
                  <Typography variant="small" color="muted" className="py-10 text-center">
                    No messages yet. Say hello! 👋
                  </Typography>
                )}
                {messages.map((msg) => {
                  const isMine = msg.senderRole === "owner";
                  return (
                    <ChatMessage
                      key={msg.id}
                      isMine={isMine}
                      text={msg.text}
                      time={formatMessageTime(msg.timestamp)}
                      avatar={!isMine ? <Avatar size="sm">{msg.senderName[0]}</Avatar> : undefined}
                    />
                  );
                })}
                {isTyping && <TypingIndicator label={`${typingUser} is typing...`} />}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
