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
  return new Date(date).toLocaleTimeString(
    "ar-DZ",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatMessageDate(date: string) {
  const messageDate = new Date(date);
  const today = new Date();

  const isToday =
    messageDate.toDateString() ===
    today.toDateString();

  if (isToday) {
    return "اليوم";
  }

  const yesterday = new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  if (
    messageDate.toDateString() ===
    yesterday.toDateString()
  ) {
    return "أمس";
  }

  return messageDate.toLocaleDateString(
    "ar-DZ",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

// =====================================================
// COMPONENT
// =====================================================

export default function ConversationPage() {
  const navigate = useNavigate();

  const { conversationId } =
    useParams<{
      conversationId: string;
    }>();

  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [currentProfileId, setCurrentProfileId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [content, setContent] =
    useState("");

  // =====================================================
  // REFS
  // =====================================================

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const realtimeChannelRef =
    useRef<ReturnType<
      typeof supabase.channel
    > | null>(null);

  const currentProfileIdRef =
    useRef<string | null>(null);

  const conversationIdRef =
    useRef<string | undefined>(
      conversationId
    );

  const isInitialLoadRef =
    useRef(true);

  // =====================================================
  // KEEP REFS UPDATED
  // =====================================================

  useEffect(() => {
    currentProfileIdRef.current =
      currentProfileId;
  }, [currentProfileId]);

  useEffect(() => {
    conversationIdRef.current =
      conversationId;
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

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error(
            "المستخدم غير مسجل الدخول"
          );
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (!profile?.id) {
          throw new Error(
            "لم يتم العثور على ملف المستخدم"
          );
        }

        if (!cancelled) {
          setCurrentProfileId(
            profile.id
          );
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Load current profile error:",
          err
        );

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
        messagesEndRef.current?.scrollIntoView(
          {
            behavior,
            block: "end",
          }
        );
      }, 50);
    },
    []
  );

  const isNearBottom = useCallback(() => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      return true;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    return distanceFromBottom < 180;
  }, []);

  // =====================================================
  // MARK CONVERSATION AS READ
  // =====================================================

  const markConversationAsRead =
    useCallback(async () => {
      if (
        !conversationIdRef.current ||
        !currentProfileIdRef.current
      ) {
        return;
      }

      try {
        const { error } =
          await supabase
            .from("conversation_members")
            .update({
              last_read_at:
                new Date().toISOString(),
            })
            .eq(
              "conversation_id",
              conversationIdRef.current
            )
            .eq(
              "user_id",
              currentProfileIdRef.current
            );

        if (error) {
          console.error(
            "Mark conversation as read error:",
            error
          );
        }
      } catch (err) {
        console.error(
          "Mark conversation as read error:",
          err
        );
      }
    }, []);

  // =====================================================
  // LOAD CONVERSATION
  // =====================================================

  useEffect(() => {
    if (!conversationId) {
      setError(
        "معرف المحادثة غير موجود"
      );

      setLoading(false);

      return;
    }

    let cancelled = false;

    isInitialLoadRef.current = true;

    const loadConversation =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            conversations,
            conversationMessages,
          ] = await Promise.all([
            getConversations(),
            getMessages(conversationId),
          ]);

          if (cancelled) {
            return;
          }

          const currentConversation =
            conversations.find(
              (item) =>
                item.id ===
                conversationId
            ) ?? null;

          if (!currentConversation) {
            setError(
              "لم يتم العثور على هذه المحادثة"
            );

            setConversation(null);
            setMessages([]);

            return;
          }

          setConversation(
            currentConversation
          );

          setMessages(
            conversationMessages
          );

          await markConversationAsRead();

          if (!cancelled) {
            window.setTimeout(() => {
              scrollToBottom("auto");

              isInitialLoadRef.current =
                false;
            }, 100);
          }
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Load conversation error:",
            err
          );

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
  }, [
    conversationId,
    markConversationAsRead,
    scrollToBottom,
  ]);

  // =====================================================
  // REALTIME
  // =====================================================

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    console.log(
      "Starting realtime for conversation:",
      conversationId
    );

    const channel =
      supabase
        .channel(
          `conversation-messages-${conversationId}`
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            console.log(
              "REALTIME MESSAGE:",
              payload
            );

            const incomingMessage =
              payload.new as Message;

            if (
              !incomingMessage?.id
            ) {
              return;
            }

            const shouldScroll =
              isNearBottom();

            setMessages(
              (previous) => {
                const exists =
                  previous.some(
                    (message) =>
                      message.id ===
                      incomingMessage.id
                  );

                if (exists) {
                  return previous;
                }

                return [
                  ...previous,
                  incomingMessage,
                ];
              }
            );

            if (
              incomingMessage.sender_id ===
              currentProfileIdRef.current
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
          console.log(
            "Messages realtime status:",
            status
          );

          if (
            status === "SUBSCRIBED"
          ) {
            console.log(
              "Realtime connected successfully"
            );
          }

          if (
            status === "CHANNEL_ERROR"
          ) {
            console.error(
              "Realtime channel error"
            );
          }

          if (
            status === "TIMED_OUT"
          ) {
            console.error(
              "Realtime connection timed out"
            );
          }
        });

    realtimeChannelRef.current =
      channel;

    return () => {
      console.log(
        "Stopping realtime for conversation:",
        conversationId
      );

      void supabase.removeChannel(
        channel
      );

      realtimeChannelRef.current =
        null;
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
    if (
      loading ||
      isInitialLoadRef.current
    ) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        if (isNearBottom()) {
          scrollToBottom("smooth");
        }
      }, 50);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    messages,
    loading,
    isNearBottom,
    scrollToBottom,
  ]);

  // =====================================================
  // MARK AS READ WHEN USER RETURNS TO TAB
  // =====================================================

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          void markConversationAsRead();
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

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
  }, [
    conversationId,
    currentProfileId,
    markConversationAsRead,
  ]);

  // =====================================================
  // TEXTAREA AUTO RESIZE
  // =====================================================

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      128
    )}px`;
  }, [content]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSendMessage =
    async () => {
      const normalizedContent =
        content.trim();

      if (
        !normalizedContent ||
        !conversationId ||
        sending
      ) {
        return;
      }

      try {
        setSending(true);
        setError("");

        const message =
          await sendMessage(
            conversationId,
            normalizedContent
          );

        setMessages(
          (previous) => {
            const exists =
              previous.some(
                (item) =>
                  item.id ===
                  message.id
              );

            if (exists) {
              return previous;
            }

            return [
              ...previous,
              message,
            ];
          }
        );

        setContent("");

        scrollToBottom("smooth");

        await markConversationAsRead();

        window.setTimeout(() => {
          textareaRef.current?.focus();
        }, 50);
      } catch (err) {
        console.error(
          "Send message error:",
          err
        );

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
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
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
    conversation?.other_user_full_name
      ?.trim() ||
    conversation?.other_user_username
      ?.trim() ||
    "مستخدم";

  const username =
    conversation?.other_user_username
      ?.trim();

  // =====================================================
  // GROUP MESSAGES BY DATE
  // =====================================================

  const groupedMessages: {
    date: string;
    messages: Message[];
  }[] = [];

  messages.forEach(
    (message) => {
      const date =
        formatMessageDate(
          message.created_at
        );

      const existing =
        groupedMessages.find(
          (group) =>
            group.date === date
        );

      if (existing) {
        existing.messages.push(
          message
        );
      } else {
        groupedMessages.push({
          date,
          messages: [message],
        });
      }
    }
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      dir="rtl"
      className="flex h-[100dvh] min-h-[560px] flex-col overflow-hidden bg-muted/30"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="z-30 shrink-0 border-b bg-background/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] w-full max-w-4xl items-center gap-3 px-3 sm:px-5">

          {/* BACK */}

          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            aria-label="العودة إلى الرسائل"
          >
            <ArrowRight size={21} />
          </button>

          {/* AVATAR */}

          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-background shadow-sm">
              {conversation?.other_user_avatar_url ? (
                <img
                  src={
                    conversation.other_user_avatar_url
                  }
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  size={21}
                  className="text-muted-foreground"
                />
              )}
            </div>
          </div>

          {/* USER INFO */}

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {displayName}
            </h1>

            {username ? (
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                @{username}
              </p>
            ) : (
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                محادثة خاصة
              </p>
            )}
          </div>

          {/* CHAT ICON */}

          <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-muted/60 sm:flex">
            <MessageCircle
              size={18}
              className="text-muted-foreground"
            />
          </div>
        </div>
      </header>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="z-20 mx-auto w-full max-w-4xl px-3 pt-3 sm:px-5">
          <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm">
            <div className="min-w-0 flex-1">
              {error}
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors hover:bg-destructive/10"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          CHAT AREA
      ================================================= */}

      <main
        ref={messagesContainerRef}
        className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {/* SOFT BACKGROUND */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:22px_22px]" />

          <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-full w-full max-w-4xl flex-col px-3 py-5 sm:px-5 sm:py-7">

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-background shadow-sm">
                <Loader2
                  size={24}
                  className="animate-spin text-primary"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-muted-foreground">
                جاري تحميل المحادثة...
              </p>
            </div>
          ) : messages.length === 0 ? (
            /* =================================================
               EMPTY
            ================================================= */

            <div className="flex flex-1 items-center justify-center px-4">
              <div className="w-full max-w-sm text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] border bg-background shadow-sm">
                  <MessageCircle
                    size={32}
                    strokeWidth={1.7}
                    className="text-primary"
                  />
                </div>

                <h2 className="mt-6 text-xl font-bold tracking-tight">
                  بداية محادثة جديدة
                </h2>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  ابدأ الحديث مع{" "}
                  <span className="font-semibold text-foreground">
                    {displayName}
                  </span>{" "}
                  وأرسل أول رسالة.
                </p>

                <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-[11px] text-muted-foreground shadow-sm">
                  <span className="text-xs">
                    🔒
                  </span>
                  محادثة خاصة بينكما
                </div>
              </div>
            </div>
          ) : (
            /* =================================================
               MESSAGES
            ================================================= */

            <div className="flex flex-col gap-7">
              {groupedMessages.map(
                (group) => (
                  <section
                    key={group.date}
                    className="flex flex-col gap-3"
                  >
                    {/* DATE DIVIDER */}

                    <div className="flex items-center gap-3 py-1">
                      <div className="h-px flex-1 bg-border/60" />

                      <span className="shrink-0 rounded-full border bg-background/90 px-3 py-1 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur">
                        {group.date}
                      </span>

                      <div className="h-px flex-1 bg-border/60" />
                    </div>

                    {/* MESSAGE LIST */}

                    <div className="flex flex-col gap-1.5">
                      {group.messages.map(
                        (message) => {
                          const isMyMessage =
                            currentProfileId !==
                              null &&
                            message.sender_id ===
                              currentProfileId;

                          return (
                            <div
                              key={
                                message.id
                              }
                              className={`flex w-full ${
                                isMyMessage
                                  ? "justify-start"
                                  : "justify-end"
                              }`}
                            >
                              <div
                                className={`flex max-w-[88%] flex-col sm:max-w-[72%] ${
                                  isMyMessage
                                    ? "items-start"
                                    : "items-end"
                                }`}
                              >
                                {/* BUBBLE */}

                                <div
                                  className={`relative px-4 py-2.5 shadow-sm ${
                                    isMyMessage
                                      ? "rounded-2xl rounded-tr-md bg-primary text-primary-foreground"
                                      : "rounded-2xl rounded-tl-md border bg-background text-foreground"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap break-words text-[14px] leading-6">
                                    {
                                      message.content
                                    }
                                  </p>

                                  {/* META */}

                                  <div
                                    className={`mt-1 flex items-center gap-1.5 ${
                                      isMyMessage
                                        ? "justify-start"
                                        : "justify-end"
                                    }`}
                                  >
                                    <span
                                      className={`text-[9px] leading-none ${
                                        isMyMessage
                                          ? "text-primary-foreground/65"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {formatMessageTime(
                                        message.created_at
                                      )}
                                    </span>

                                    {isMyMessage && (
                                      <Check
                                        size={
                                          12
                                        }
                                        strokeWidth={
                                          2.2
                                        }
                                        className="text-primary-foreground/70"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>
                )
              )}

              <div
                ref={messagesEndRef}
                className="h-1 shrink-0"
              />
            </div>
          )}
        </div>
      </main>

      {/* =================================================
          COMPOSER
      ================================================= */}

      <footer className="z-30 shrink-0 border-t bg-background/95 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-5">

          {/* COMPOSER */}

          <div className="flex items-end gap-2 rounded-[24px] border bg-muted/30 p-1.5 shadow-sm transition-all focus-within:border-primary/40 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/5">

            {/* TEXTAREA */}

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              disabled={
                sending ||
                !conversationId
              }
              rows={1}
              maxLength={5000}
              placeholder="اكتب رسالة..."
              className="max-h-32 min-h-[42px] flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {/* SEND BUTTON */}

            <button
              type="button"
              onClick={() =>
                void handleSendMessage()
              }
              disabled={
                sending ||
                !content.trim() ||
                !conversationId
              }
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:scale-[1.03] hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
              aria-label="إرسال الرسالة"
            >
              {sending ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Send
                  size={17}
                  strokeWidth={2.2}
                  className="translate-x-[-1px]"
                />
              )}
            </button>
          </div>

          {/* FOOTER HINT */}

          <div className="flex min-h-5 items-center justify-between px-2 pt-1.5">
            <p className="text-[9px] text-muted-foreground">
              Enter للإرسال · Shift + Enter لسطر جديد
            </p>

            {content.length > 0 && (
              <span className="text-[9px] tabular-nums text-muted-foreground">
                {content.length}/5000
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}