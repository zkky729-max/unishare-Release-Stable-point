import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MessageCircle,
  Plus,
  RefreshCw,
  UserRound,
  Search,
  Sparkles,
  ArrowLeft,
  MessagesSquare,
  X,
} from "lucide-react";

import { getConversations } from "../api/getConversations";
import NewConversationDialog from "../components/NewConversationDialog";

import type { Conversation } from "../types/message";

export default function MessagesPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [newConversationOpen, setNewConversationOpen] = useState(false);

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getConversations();

      console.log("MESSAGES PAGE - CONVERSATIONS:", data);

      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);

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
  // FILTER CONVERSATIONS
  // =====================================================

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) => {
      const name =
        conversation.other_user_full_name?.toLowerCase() || "";

      const username =
        conversation.other_user_username?.toLowerCase() || "";

      return (
        name.includes(query) ||
        username.includes(query) ||
        `@${username}`.includes(query)
      );
    });
  }, [conversations, search]);

  // =====================================================
  // OPEN CONVERSATION
  // =====================================================

  const handleOpenConversation = (conversationId: string) => {
    if (!conversationId) {
      console.error("Missing conversation ID");
      setError("تعذر فتح المحادثة");
      return;
    }

    navigate(`/messages/${conversationId}`);
  };

  // =====================================================
  // NEW CONVERSATION CREATED
  // =====================================================

  const handleConversationCreated = async (conversationId: string) => {
    if (!conversationId) {
      setError("لم يتم الحصول على معرف المحادثة");
      return;
    }

    setSuccess("تم فتح المحادثة بنجاح");

    navigate(`/messages/${conversationId}`);
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    void loadConversations();
  }, []);

  // =====================================================
  // OPEN NEW CONVERSATION
  // =====================================================

  const openNewConversation = () => {
    setSuccess("");
    setError("");
    setNewConversationOpen(true);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-background px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* =================================================
            HERO HEADER
        ================================================= */}

        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-500/15 md:p-8">

          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div className="min-w-0">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                <Sparkles size={15} />
                <span>تواصل وشارك المعرفة</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                رسائلك
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-blue-50 md:text-base">
                مساحتك للتواصل مع زملائك، وتبادل الأفكار،
                ومواصلة رحلتك الجامعية داخل UniShare.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-white/90">
                <MessagesSquare size={18} />
                <span>
                  {conversations.length} محادثة
                </span>
              </div>

            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={() => void loadConversations()}
                disabled={loading}
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                تحديث
              </button>

              <button
                type="button"
                onClick={openNewConversation}
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
              >
                <Plus size={19} />
                محادثة جديدة
              </button>

            </div>
          </div>
        </section>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        {success && (
          <div className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
            <MessageCircle size={19} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="cursor-pointer rounded-lg p-1 transition hover:bg-destructive/10"
              aria-label="إغلاق التنبيه"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* =================================================
            CONVERSATIONS SECTION
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">

          {/* SECTION HEADER */}

          <div className="border-b border-border/70 p-5 md:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                    <MessageCircle size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      المحادثات
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      جميع محادثاتك في مكان واحد
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                {filteredConversations.length} نتيجة
              </div>

            </div>

            {/* SEARCH */}

            <div className="relative mt-5">

              <Search
                size={19}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث عن محادثة أو مستخدم..."
                className="h-12 w-full rounded-xl border border-border bg-background pr-12 pl-11 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted"
                  aria-label="مسح البحث"
                >
                  <X size={17} />
                </button>
              )}

            </div>
          </div>

          {/* LOADING */}

          {loading ? (

            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
                <RefreshCw
                  size={27}
                  className="animate-spin text-blue-600"
                />
              </div>

              <p className="mt-5 text-base font-semibold">
                جاري تحميل المحادثات
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                لحظات ونكون معك...
              </p>

            </div>

          ) : conversations.length === 0 ? (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="px-6 py-16 text-center md:py-20">

              <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/10">
                <div className="absolute inset-2 rounded-[1.5rem] border border-blue-500/10" />

                <MessagesSquare
                  size={39}
                  className="text-indigo-500"
                />

                <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                  <Plus size={17} />
                </span>
              </div>

              <h3 className="mt-7 text-xl font-bold">
                محادثاتك تبدأ من هنا
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                لم تبدأ أي محادثة بعد. ابحث عن زملائك في UniShare
                وابدأ التواصل معهم وتبادل الأفكار والمعرفة.
              </p>

              <button
                type="button"
                onClick={openNewConversation}
                className="mt-7 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              >
                <Plus size={19} />
                ابدأ محادثة جديدة
                <ArrowLeft size={17} />
              </button>

            </div>

          ) : filteredConversations.length === 0 ? (

            /* =================================================
               NO SEARCH RESULTS
            ================================================= */

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Search
                  size={27}
                  className="text-muted-foreground"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                لم نعثر على محادثة
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                جرّب البحث باستخدام اسم آخر.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 cursor-pointer text-sm font-semibold text-blue-600 transition hover:text-indigo-600"
              >
                مسح البحث
              </button>

            </div>

          ) : (

            /* =================================================
               CONVERSATION LIST
            ================================================= */

            <div className="divide-y divide-border/70">

              {filteredConversations.map((conversation) => {

                const displayName =
                  conversation.other_user_full_name?.trim() ||
                  conversation.other_user_username?.trim() ||
                  "مستخدم";

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleOpenConversation(conversation.id)}
                    className="group flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-right transition duration-200 hover:bg-blue-500/[0.04] active:bg-blue-500/[0.08] md:px-6 md:py-5"
                  >

                    {/* AVATAR */}

                    <div className="relative shrink-0">

                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 ring-1 ring-border/60 transition duration-200 group-hover:ring-blue-500/40">

                        {conversation.other_user_avatar_url ? (
                          <img
                            src={conversation.other_user_avatar_url}
                            alt={displayName}
                            className="pointer-events-none h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound
                            size={27}
                            className="text-indigo-500"
                          />
                        )}

                      </div>

                    </div>

                    {/* USER INFORMATION */}

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-base font-bold transition group-hover:text-blue-600">
                        {displayName}
                      </h3>

                      {conversation.other_user_username ? (
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          @{conversation.other_user_username}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          مستخدم في UniShare
                        </p>
                      )}

                    </div>

                    {/* OPEN ICON */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground transition duration-200 group-hover:bg-blue-500 group-hover:text-white">
                      <ArrowLeft size={19} />
                    </div>

                  </button>
                );
              })}

            </div>
          )}

        </section>

        {/* =================================================
            BOTTOM TIP
        ================================================= */}

        {conversations.length > 0 && !loading && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
              <Sparkles size={18} />
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              اجعل تواصلك مثمراً، وشارك المعرفة والأفكار مع مجتمعك الجامعي.
            </p>
          </div>
        )}

      </div>

      {/* =====================================================
          NEW CONVERSATION DIALOG
      ===================================================== */}

      <NewConversationDialog
        open={newConversationOpen}
        onClose={() => setNewConversationOpen(false)}
        onConversationCreated={handleConversationCreated}
      />

    </div>
  );
}