
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Loader2,
  MessageCircle,
  Send,
  UserRound,
} from "lucide-react";

import { supabase } from "../../../lib/supabaseClient";

import { getMessages } from "../api/getMessages";
import { sendMessage } from "../api/sendMessage";
import { getConversations } from "../api/getConversations";

import type { Conversation } from "../types/message";
import type { Message } from "../api/getMessages";

// =====================================================
// HELPERS
// =====================================================

function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("ar-DZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMessageDate(date: string) {
  const messageDate = new Date(date);
  const today = new Date();

  if (messageDate.toDateString() === today.toDateString()) {
    return "اليوم";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "أمس";
  }

  return messageDate.toLocaleDateString("ar-DZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// =====================================================
// COMPONENT
// =====================================================

export default function ConversationPage() {
  const navigate = useNavigate();

  const { conversationId } = useParams<{
    conversationId: string;
  }>();

  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  // =====================================================
  // REFS
  // =====================================================

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const realtimeChannelRef = useRef<
    ReturnType<typeof supabase.channel> | null
  >(null);

  const currentProfileIdRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | undefined>(conversationId);
  const isInitialLoadRef = useRef(true);

  // =====================================================
  // KEEP REFS UPDATED
  // =====================================================

  useEffect(() => {
    currentProfileIdRef.current = currentProfileId;
  }, [currentProfileId]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // =====================================================
  // CURRENT USER PROFILE
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadCurrentProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          throw new Error("المستخدم غير مسجل الدخول");
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        if (!profile?.id) {
          throw new Error("لم يتم العثور على ملف المستخدم");
        }

        if (!cancelled) {
          setCurrentProfileId(profile.id);
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Load current profile error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "فشل تحميل بيانات المستخدم"
        );
      }
    };

    void loadCurrentProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // SCROLL HELPERS
  // =====================================================

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      window.setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior,
          block: "end",
        });
      }, 50);
    },
    []
  );

  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;

    if (!container) return true;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    return distanceFromBottom < 180;
  }, []);

  // =====================================================
  // MARK CONVERSATION AS READ
  // =====================================================

  const markConversationAsRead = useCallback(async () => {
    if (
      !conversationIdRef.current ||
      !currentProfileIdRef.current
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("conversation_members")
        .update({
          last_read_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationIdRef.current)
        .eq("user_id", currentProfileIdRef.current);

      if (error) {
        console.error("Mark conversation as read error:", error);
      }
    } catch (err) {
      console.error("Mark conversation as read error:", err);
    }
  }, []);

  // =====================================================
  // LOAD CONVERSATION
  // =====================================================

  useEffect(() => {
    if (!conversationId) {
      setError("معرف المحادثة غير موجود");
      setLoading(false);
      return;
    }

    let cancelled = false;

    isInitialLoadRef.current = true;

    const loadConversation = async () => {
      try {
        setLoading(true);
        setError("");

        const [conversations, conversationMessages] = await Promise.all([
          getConversations(),
          getMessages(conversationId),
        ]);

        if (cancelled) return;

        const currentConversation =
          conversations.find((item) => item.id === conversationId) ?? null;

        if (!currentConversation) {
          setError("لم يتم العثور على هذه المحادثة");
          setConversation(null);
          setMessages([]);
          return;
        }

        setConversation(currentConversation);
        setMessages(conversationMessages);

        await markConversationAsRead();

        if (!cancelled) {
          window.setTimeout(() => {
            scrollToBottom("auto");
            isInitialLoadRef.current = false;
          }, 100);
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Load conversation error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "فشل تحميل المحادثة"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadConversation();

    return () => {
      cancelled = true;
    };
  }, [conversationId, markConversationAsRead, scrollToBottom]);

  // =====================================================
  // REALTIME
  // =====================================================

  useEffect(() => {
    if (!conversationId) return;

    console.log("Starting realtime for conversation:", conversationId);

    const channel = supabase
      .channel(`conversation-messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incomingMessage = payload.new as Message;

          if (!incomingMessage?.id) return;

          const shouldScroll = isNearBottom();

          setMessages((previous) => {
            const exists = previous.some(
              (message) => message.id === incomingMessage.id
            );

            if (exists) return previous;

            return [...previous, incomingMessage];
          });

          if (
            incomingMessage.sender_id === currentProfileIdRef.current
          ) {
            scrollToBottom("smooth");
            return;
          }

          if (shouldScroll) {
            scrollToBottom("smooth");
            void markConversationAsRead();
          }
        }
      )
      .subscribe((status) => {
        console.log("Messages realtime status:", status);

        if (status === "CHANNEL_ERROR") {
          console.error("Realtime channel error");
        }

        if (status === "TIMED_OUT") {
          console.error("Realtime connection timed out");
        }
      });

    realtimeChannelRef.current = channel;

    return () => {
      console.log("Stopping realtime for conversation:", conversationId);

      void supabase.removeChannel(channel);
      realtimeChannelRef.current = null;
    };
  }, [
    conversationId,
    isNearBottom,
    markConversationAsRead,
    scrollToBottom,
  ]);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    if (loading || isInitialLoadRef.current) return;

    const timeout = window.setTimeout(() => {
      if (isNearBottom()) {
        scrollToBottom("smooth");
      }
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [messages, loading, isNearBottom, scrollToBottom]);

  // =====================================================
  // MARK AS READ WHEN USER RETURNS TO TAB
  // =====================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void markConversationAsRead();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [markConversationAsRead]);

  // =====================================================
  // MARK AS READ ON MOUNT / EXIT
  // =====================================================

  useEffect(() => {
    void markConversationAsRead();

    return () => {
      void markConversationAsRead();
    };
  }, [conversationId, currentProfileId, markConversationAsRead]);

  // =====================================================
  // TEXTAREA AUTO RESIZE
  // =====================================================

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [content]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSendMessage = async () => {
    const normalizedContent = content.trim();

    if (!normalizedContent || !conversationId || sending) return;

    try {
      setSending(true);
      setError("");

      const message = await sendMessage(
        conversationId,
        normalizedContent
      );

      setMessages((previous) => {
        const exists = previous.some((item) => item.id === message.id);

        if (exists) return previous;

        return [...previous, message];
      });

      setContent("");
      scrollToBottom("smooth");

      await markConversationAsRead();

      window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } catch (err) {
      console.error("Send message error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل إرسال الرسالة"
      );
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // KEYBOARD
  // =====================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/messages");
  };

  // =====================================================
  // USER DISPLAY
  // =====================================================

  const displayName =
    conversation?.other_user_full_name?.trim() ||
    conversation?.other_user_username?.trim() ||
    "مستخدم";

  const username = conversation?.other_user_username?.trim();

  // =====================================================
  // GROUP MESSAGES BY DATE
  // =====================================================

  const groupedMessages: {
    date: string;
    messages: Message[];
  }[] = [];

  messages.forEach((message) => {
    const date = formatMessageDate(message.created_at);

    const existing = groupedMessages.find(
      (group) => group.date === date
    );

    if (existing) {
      existing.messages.push(message);
    } else {
      groupedMessages.push({
        date,
        messages: [message],
      });
    }
  });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      dir="rtl"
      className="h-[100dvh] min-h-[500px] w-full overflow-hidden bg-[#f0f2f5] dark:bg-[#111b21] sm:flex sm:items-center sm:justify-center sm:p-4"
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#f0f2f5] dark:bg-[#111b21] sm:max-w-4xl sm:rounded-2xl sm:border sm:border-border/60 sm:bg-background sm:shadow-xl">

        {/* =================================================
            MESSENGER HEADER
        ================================================= */}

        <header className="z-30 flex h-[62px] shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-2 shadow-sm dark:border-gray-700 dark:bg-[#202c33] sm:h-[70px] sm:px-5">

          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0084ff] transition hover:bg-blue-50 active:scale-95 dark:hover:bg-white/10"
            aria-label="العودة إلى الرسائل"
          >
            <ArrowRight size={23} />
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            {conversation?.other_user_avatar_url ? (
              <img
                src={conversation.other_user_avatar_url}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={22} className="text-gray-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-bold text-[#050505] dark:text-white">
              {displayName}
            </h1>

            <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">
              {username ? `@${username}` : "محادثة خاصة"}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0084ff]">
            <MessageCircle size={22} />
          </div>
        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="z-20 mx-3 mt-2 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <div className="min-w-0 flex-1">{error}</div>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* =================================================
            CHAT AREA
        ================================================= */}

        <main
          ref={messagesContainerRef}
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f0f2f5] dark:bg-[#111b21]"
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-3 py-5 sm:px-6 sm:py-7">

            {/* LOADING */}

            {loading ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <Loader2
                  size={30}
                  className="animate-spin text-[#0084ff]"
                />

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  جاري تحميل المحادثة...
                </p>
              </div>
            ) : messages.length === 0 ? (
              /* EMPTY STATE */

              <div className="flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-xs text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm dark:bg-[#202c33]">
                    {conversation?.other_user_avatar_url ? (
                      <img
                        src={conversation.other_user_avatar_url}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound
                        size={36}
                        className="text-gray-400"
                      />
                    )}
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-[#050505] dark:text-white">
                    {displayName}
                  </h2>

                  {username && (
                    <p className="mt-1 text-sm text-gray-500">
                      @{username}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
                    هذه بداية محادثتكما. أرسل رسالة وابدأ الحديث!
                  </p>
                </div>
              </div>
            ) : (
              /* MESSAGES */

              <div className="flex flex-col gap-6">
                {groupedMessages.map((group) => (
                  <section
                    key={group.date}
                    className="flex flex-col gap-3"
                  >
                    {/* DATE */}

                    <div className="flex justify-center py-1">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-gray-500 shadow-sm dark:bg-[#202c33] dark:text-gray-300">
                        {group.date}
                      </span>
                    </div>

                    {/* MESSAGE LIST */}

                    <div className="flex flex-col gap-1.5">
                      {group.messages.map((message) => {
                        const isMyMessage =
                          currentProfileId !== null &&
                          message.sender_id === currentProfileId;

                        return (
                          <div
                            key={message.id}
                            className={`flex w-full ${
                              isMyMessage
                                ? "justify-start"
                                : "justify-end"
                            }`}
                          >
                            <div
                              className={`flex max-w-[88%] flex-col sm:max-w-[70%] ${
                                isMyMessage
                                  ? "items-start"
                                  : "items-end"
                              }`}
                            >
                              <div
                                className={`px-3.5 py-2 shadow-sm sm:px-4 ${
                                  isMyMessage
                                    ? "rounded-[18px] rounded-tr-[5px] bg-[#0084ff] text-white"
                                    : "rounded-[18px] rounded-tl-[5px] bg-white text-[#050505] dark:bg-[#202c33] dark:text-white"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.55]">
                                  {message.content}
                                </p>

                                <div
                                  className={`mt-1 flex items-center gap-1 ${
                                    isMyMessage
                                      ? "justify-start"
                                      : "justify-end"
                                  }`}
                                >
                                  <span
                                    className={`text-[10px] ${
                                      isMyMessage
                                        ? "text-white/75"
                                        : "text-gray-400 dark:text-gray-400"
                                    }`}
                                  >
                                    {formatMessageTime(message.created_at)}
                                  </span>

                                  {isMyMessage && (
                                    <Check
                                      size={12}
                                      className="text-white/80"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}

                <div ref={messagesEndRef} className="h-1 shrink-0" />
              </div>
            )}
          </div>
        </main>

        {/* =================================================
            MESSENGER COMPOSER
        ================================================= */}

        <footer className="z-30 shrink-0 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-[#202c33]">
          <div className="mx-auto w-full max-w-3xl px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2.5 sm:px-5 sm:pb-3">

            <div className="flex items-end gap-2">

              {/* MESSAGE INPUT */}

              <div className="flex min-h-[44px] flex-1 items-end rounded-[22px] bg-[#f0f2f5] px-4 py-1.5 dark:bg-[#111b21]">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending || !conversationId}
                  rows={1}
                  maxLength={5000}
                  placeholder="Aa"
                  className="max-h-32 min-h-[30px] flex-1 resize-none overflow-y-auto bg-transparent py-1.5 text-[15px] leading-6 text-[#050505] outline-none placeholder:text-gray-500 disabled:cursor-not-allowed dark:text-white dark:placeholder:text-gray-400"
                />
              </div>

              {/* SEND BUTTON */}

              <button
                type="button"
                onClick={() => void handleSendMessage()}
                disabled={
                  sending ||
                  !content.trim() ||
                  !conversationId
                }
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0084ff] transition hover:bg-blue-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
                aria-label="إرسال الرسالة"
              >
                {sending ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <Send
                    size={23}
                    strokeWidth={2.4}
                    className="translate-x-[-1px]"
                  />
                )}
              </button>
            </div>

            <p className="mt-1.5 text-center text-[9px] text-gray-400 sm:hidden">
              Enter للإرسال · Shift + Enter لسطر جديد
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
