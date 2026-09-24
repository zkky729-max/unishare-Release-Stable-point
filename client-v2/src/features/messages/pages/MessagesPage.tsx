import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MessageCircle,
  Plus,
  RefreshCw,
  UserRound,
} from "lucide-react";

import { getConversations } from "../api/getConversations";

import NewConversationDialog from "../components/NewConversationDialog";

import type { Conversation } from "../types/message";

export default function MessagesPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [newConversationOpen, setNewConversationOpen] =
    useState(false);

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getConversations();

      console.log(
        "MESSAGES PAGE - CONVERSATIONS:",
        data
      );

      setConversations(data);
    } catch (err) {
      console.error(
        "Failed to load conversations:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل تحميل المحادثات"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN EXISTING CONVERSATION
  // =====================================================

  const handleOpenConversation = (
    conversationId: string
  ) => {
    if (!conversationId) {
      console.error(
        "Missing conversation ID"
      );

      setError(
        "تعذر فتح المحادثة"
      );

      return;
    }

    console.log(
      "OPENING CONVERSATION:",
      conversationId
    );

    navigate(
      `/messages/${conversationId}`
    );
  };

  // =====================================================
  // NEW CONVERSATION CREATED
  // =====================================================

  const handleConversationCreated = async (
    conversationId: string
  ) => {
    console.log(
      "Conversation created/opened:",
      conversationId
    );

    if (!conversationId) {
      setError(
        "لم يتم الحصول على معرف المحادثة"
      );

      return;
    }

    setSuccess(
      "تم فتح المحادثة بنجاح"
    );

    /*
     * لا نحتاج إلى انتظار loadConversations
     * قبل الانتقال إلى المحادثة.
     *
     * نذهب مباشرة إلى صفحة المحادثة.
     */

    navigate(
      `/messages/${conversationId}`
    );
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    void loadConversations();
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-5xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              الرسائل
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              تواصل مع زملائك في UniShare.
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => {
                void loadConversations();
              }}
              disabled={loading}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              تحديث
            </button>

            {/* NEW CONVERSATION */}

            <button
              type="button"
              onClick={() => {
                setSuccess("");
                setError("");
                setNewConversationOpen(true);
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus size={17} />

              محادثة جديدة
            </button>

          </div>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm">
            {success}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="rounded-2xl border bg-card p-10 text-center">

            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-muted-foreground"
            />

            <p className="mt-4 text-sm text-muted-foreground">
              جاري تحميل المحادثات...
            </p>

          </div>

        ) : conversations.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="rounded-2xl border bg-card p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <MessageCircle
                size={26}
                className="text-muted-foreground"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              لا توجد محادثات بعد
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              ابدأ محادثة جديدة مع أحد زملائك
              للتواصل معه مباشرة.
            </p>

            <button
              type="button"
              onClick={() => {
                setSuccess("");
                setError("");
                setNewConversationOpen(true);
              }}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus size={17} />

              ابدأ محادثة جديدة
            </button>

          </div>

        ) : (

          /* =================================================
             CONVERSATIONS
          ================================================= */

          <div className="overflow-hidden rounded-2xl border bg-card">

            {conversations.map(
              (conversation) => {

                const displayName =
                  conversation.other_user_full_name
                    ?.trim() ||
                  conversation.other_user_username
                    ?.trim() ||
                  "مستخدم";

                return (
                  <button
                    key={conversation.id}
                    type="button"

                    /*
                     * هذا هو الجزء الذي كان ناقصًا.
                     */

                    onClick={() => {
                      console.log(
                        "CONVERSATION CLICKED:",
                        conversation.id
                      );

                      handleOpenConversation(
                        conversation.id
                      );
                    }}

                    className="flex w-full cursor-pointer items-center gap-3 border-b p-4 text-right transition hover:bg-muted/50 active:bg-muted last:border-b-0"
                  >

                    {/* =================================================
                        AVATAR
                    ================================================= */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">

                      {conversation.other_user_avatar_url ? (
                        <img
                          src={
                            conversation.other_user_avatar_url
                          }
                          alt={displayName}
                          className="pointer-events-none h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound
                          size={22}
                          className="text-muted-foreground"
                        />
                      )}

                    </div>

                    {/* =================================================
                        USER INFO
                    ================================================= */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold">
                        {displayName}
                      </p>

                      {conversation.other_user_username && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          @
                          {
                            conversation.other_user_username
                          }
                        </p>
                      )}

                    </div>

                    {/* =================================================
                        ICON
                    ================================================= */}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">

                      <MessageCircle
                        size={18}
                        className="text-muted-foreground"
                      />

                    </div>

                  </button>
                );
              }
            )}

          </div>
        )}
      </div>

      {/* =====================================================
          NEW CONVERSATION DIALOG
      ===================================================== */}

      <NewConversationDialog
        open={newConversationOpen}
        onClose={() => {
          setNewConversationOpen(false);
        }}
        onConversationCreated={
          handleConversationCreated
        }
      />

    </div>
  );
}