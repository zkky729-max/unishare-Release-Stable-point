
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  AlertCircle,
  Globe,
  Lock,
  Loader2,
  MessageCircle,
  Send,
  Users,
  UserRound,
  Pin,
  FileText,
  Image as ImageIcon,
  Download,
  Reply,
  Check,
  X,
  Copy,
  UserPlus,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import {
  getGroupChatDetails,
  type GroupChatDetails,
} from "@/features/groupChats/api/getGroupChatDetails";

import {
  getGroupChatMembers,
  type GroupChatMember,
} from "@/features/groupChats/api/getGroupChatMembers";

import {
  getGroupChatMemberProfiles,
  type GroupChatMemberProfile,
} from "@/features/groupChats/api/getGroupChatMemberProfiles";

import {
  getGroupChatMessages,
  type GroupChatMessage,
} from "@/features/groupChats/api/getGroupChatMessages";

import {
  sendGroupChatMessage,
} from "@/features/groupChats/api/sendGroupChatMessage";

import {
  getGroupChatReactions,
  type GroupChatReaction,
} from "@/features/groupChats/api/getGroupChatReactions";

import {
  toggleGroupChatReaction,
} from "@/features/groupChats/api/toggleGroupChatReaction";

import {
  createGroupChatLinkInvitation,
  type GroupChatLinkInvitation,
} from "@/features/groupChats/api/createGroupChatInvitation";

import {
  manageGroupChatMessage,
} from "@/features/groupChats/api/manageGroupChatMessage";

// =====================================================
// HELPERS
// =====================================================

const QUICK_REACTIONS = [
  "❤️",
  "😂",
  "😮",
  "😢",
  "👍",
  "🔥",
  "👏",
];

const MEMBER_COLORS = [
  {
    bubble: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-700 dark:text-blue-300",
    accent: "bg-blue-500",
    avatar: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    bubble: "bg-violet-50 dark:bg-violet-950/50",
    text: "text-violet-700 dark:text-violet-300",
    accent: "bg-violet-500",
    avatar: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
  {
    bubble: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-300",
    accent: "bg-emerald-500",
    avatar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  {
    bubble: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-700 dark:text-amber-300",
    accent: "bg-amber-500",
    avatar: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    bubble: "bg-pink-50 dark:bg-pink-950/50",
    text: "text-pink-700 dark:text-pink-300",
    accent: "bg-pink-500",
    avatar: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  },
  {
    bubble: "bg-cyan-50 dark:bg-cyan-950/50",
    text: "text-cyan-700 dark:text-cyan-300",
    accent: "bg-cyan-500",
    avatar: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  },
  {
    bubble: "bg-orange-50 dark:bg-orange-950/50",
    text: "text-orange-700 dark:text-orange-300",
    accent: "bg-orange-500",
    avatar: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    bubble: "bg-teal-50 dark:bg-teal-950/50",
    text: "text-teal-700 dark:text-teal-300",
    accent: "bg-teal-500",
    avatar: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  },
];

function getStableColor(profileId: string) {
  let hash = 0;

  for (let index = 0; index < profileId.length; index++) {
    hash = (hash * 31 + profileId.charCodeAt(index)) | 0;
  }

  return MEMBER_COLORS[
    Math.abs(hash) % MEMBER_COLORS.length
  ];
}

function formatMessageTime(date: string) {
  return new Intl.DateTimeFormat("ar-DZ", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatMessageDate(date: string) {
  return new Intl.DateTimeFormat("ar-DZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function isSameDay(first: string, second: string) {
  return (
    new Date(first).toDateString() ===
    new Date(second).toDateString()
  );
}

function getFileIcon(type: string | null) {
  if (type?.startsWith("image/")) {
    return ImageIcon;
  }

  return FileText;
}

function getFileName(message: GroupChatMessage) {
  return message.attachment_name || "ملف مرفق";
}

// =====================================================
// PAGE
// =====================================================

export default function GroupChatPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------

  const [group, setGroup] =
    useState<GroupChatDetails | null>(null);

  const [members, setMembers] =
    useState<GroupChatMember[]>([]);

  const [memberProfiles, setMemberProfiles] =
    useState<GroupChatMemberProfile[]>([]);

  const [messages, setMessages] =
    useState<GroupChatMessage[]>([]);

  const [reactions, setReactions] =
    useState<GroupChatReaction[]>([]);

  const [currentProfileId, setCurrentProfileId] =
    useState<string | null>(null);

  const [isMember, setIsMember] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [reactionLoading, setReactionLoading] =
    useState<string | null>(null);

  const [deletingMessageId, setDeletingMessageId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [messageContent, setMessageContent] =
    useState("");

  const [replyingTo, setReplyingTo] =
    useState<GroupChatMessage | null>(null);

  // ---------------------------------------------------
  // INVITATION STATE
  // ---------------------------------------------------

  const [invitation, setInvitation] =
    useState<GroupChatLinkInvitation | null>(null);

  const [invitationOpen, setInvitationOpen] =
    useState(false);

  const [invitationLoading, setInvitationLoading] =
    useState(false);

  const [invitationCopied, setInvitationCopied] =
    useState(false);

  const [invitationError, setInvitationError] =
    useState<string | null>(null);

  // ---------------------------------------------------
  // REFS
  // ---------------------------------------------------

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  const isNearBottomRef =
    useRef(true);

  // ---------------------------------------------------
  // CURRENT MEMBER PERMISSIONS
  // ---------------------------------------------------

  const currentMember = useMemo(() => {
    if (!currentProfileId) {
      return null;
    }

    return members.find(
      (member) =>
        member.profile_id === currentProfileId
    ) ?? null;
  }, [members, currentProfileId]);

  const canCreateInvitation =
    currentMember?.member_role === "owner" ||
    currentMember?.member_role === "moderator";

  // ---------------------------------------------------
  // CREATE INVITATION
  // ---------------------------------------------------

  const handleCreateInvitation = async () => {
    if (
      !groupId ||
      !canCreateInvitation ||
      invitationLoading
    ) {
      return;
    }

    setInvitationLoading(true);
    setInvitationError(null);
    setInvitationCopied(false);
    setInvitation(null);

    try {
      const result =
        await createGroupChatLinkInvitation(
          groupId
        );

      setInvitation(result);
      setInvitationOpen(true);
    } catch (err) {
      console.error(
        "Create group invitation error:",
        err
      );

      setInvitationError(
        err instanceof Error
          ? err.message
          : "تعذر إنشاء رمز الدعوة"
      );

      setInvitationOpen(true);
    } finally {
      setInvitationLoading(false);
    }
  };

  // ---------------------------------------------------
  // COPY INVITATION TOKEN
  // ---------------------------------------------------

  const handleCopyInvitation = async () => {
    if (!invitation?.token) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        invitation.token
      );

      setInvitationCopied(true);
    } catch (err) {
      console.error(
        "Copy invitation token error:",
        err
      );

      setInvitationError(
        "تعذر نسخ الرمز. يمكنك تحديده ونسخه يدوياً."
      );
    }
  };

  // ---------------------------------------------------
  // MEMBER PROFILES
  // ---------------------------------------------------

  const memberProfilesMap = useMemo(() => {
    return new Map(
      memberProfiles.map((profile) => [
        profile.id,
        profile,
      ])
    );
  }, [memberProfiles]);

  const getMemberProfile = useCallback(
    (profileId: string) => {
      return memberProfilesMap.get(profileId);
    },
    [memberProfilesMap]
  );

  // ---------------------------------------------------
  // LOAD REACTIONS
  // ---------------------------------------------------

  const loadReactions = useCallback(
    async (messageIds: string[]) => {
      if (messageIds.length === 0) {
        setReactions([]);
        return;
      }

      try {
        const data =
          await getGroupChatReactions(messageIds);

        setReactions(data);
      } catch (err) {
        console.error(
          "Load group chat reactions error:",
          err
        );
      }
    },
    []
  );

  // ---------------------------------------------------
  // TOGGLE REACTION
  // ---------------------------------------------------

  const handleToggleReaction = async (
    messageId: string,
    reaction: string
  ) => {
    // التفاعلات متاحة لأعضاء المجموعة فقط
    if (!isMember || reactionLoading) {
      return;
    }

    const loadingKey = `${messageId}:${reaction}`;

    setReactionLoading(loadingKey);

    try {
      await toggleGroupChatReaction(
        messageId,
        reaction
      );

      await loadReactions(
        messages.map((message) => message.id)
      );
    } catch (err) {
      console.error(
        "Toggle group chat reaction error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر تحديث التفاعل"
      );
    } finally {
      setReactionLoading(null);
    }
  };

  // ---------------------------------------------------
  // DELETE MESSAGE
  // ---------------------------------------------------

  const handleDeleteMessage = async (
    message: GroupChatMessage
  ) => {
    // الحذف متاح للأعضاء فقط
    if (!isMember) {
      return;
    }

    const isOwnerOrModerator =
      currentMember?.member_role === "owner" ||
      currentMember?.member_role === "moderator";

    const canDelete =
      isMember &&
      (
        message.sender_id === currentProfileId ||
        isOwnerOrModerator
      );

    if (
      !canDelete ||
      message.deleted_at ||
      deletingMessageId
    ) {
      return;
    }

    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذه الرسالة؟"
    );

    if (!confirmed) {
      return;
    }

    setDeletingMessageId(message.id);
    setError(null);

    try {
      await manageGroupChatMessage(
        message.id,
        "delete"
      );

      const deletedAt = new Date().toISOString();

      setMessages((previous) =>
        previous.map((item) =>
          item.id === message.id
            ? {
                ...item,
                content: "[تم حذف الرسالة]",
                deleted_at: deletedAt,
                attachment_url: null,
                attachment_name: null,
                attachment_type: null,
              }
            : item
        )
      );

      setReactions((previous) =>
        previous.filter(
          (reaction) =>
            reaction.message_id !== message.id
        )
      );

      if (replyingTo?.id === message.id) {
        setReplyingTo(null);
      }
    } catch (err) {
      console.error(
        "Delete group chat message error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر حذف الرسالة"
      );
    } finally {
      setDeletingMessageId(null);
    }
  };

  // ---------------------------------------------------
  // LOAD GROUP DATA
  // ---------------------------------------------------

  const loadGroupData = useCallback(async () => {
    if (!groupId) {
      setError("معرّف المجموعة غير صالح");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(
          "يجب تسجيل الدخول لفتح المجموعة"
        );
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile?.id) {
        throw new Error(
          "لم يتم العثور على ملف المستخدم"
        );
      }

      setCurrentProfileId(profile.id);

      const groupDetails =
        await getGroupChatDetails(groupId);

      setGroup(groupDetails);

      if (!groupDetails.is_active) {
        setIsMember(false);
        setMembers([]);
        setMemberProfiles([]);
        setMessages([]);
        setReactions([]);
        return;
      }

      // تحميل قائمة الأعضاء وفق صلاحيات RLS الحالية
      const groupMembers =
        await getGroupChatMembers(groupId);

      setMembers(groupMembers);

      const currentUserIsMember =
        groupMembers.some(
          (member) =>
            member.profile_id === profile.id
        );

      setIsMember(currentUserIsMember);

      // قراءة الرسائل متاحة لجميع المستخدمين المسجلين
      // سواء كانوا أعضاء في المجموعة أم لا
      const groupMessages =
        await getGroupChatMessages(groupId, 50);

      setMessages(groupMessages);

      // نجمع معرفات الأعضاء ومرسلي الرسائل
      // حتى تظهر بيانات المرسلين لغير الأعضاء أيضاً
      const profileIds = [
        ...groupMembers.map(
          (member) => member.profile_id
        ),
        ...groupMessages.map(
          (message) => message.sender_id
        ),
      ];

      const uniqueProfileIds = [
        ...new Set(profileIds),
      ];

      const profiles =
        await getGroupChatMemberProfiles(
          uniqueProfileIds
        );

      setMemberProfiles(profiles);

      await loadReactions(
        groupMessages.map((message) => message.id)
      );
    } catch (err) {
      console.error(
        "Load group chat error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل المجموعة"
      );
    } finally {
      setLoading(false);
    }
  }, [groupId, loadReactions]);

  useEffect(() => {
    void loadGroupData();
  }, [loadGroupData]);

  // ---------------------------------------------------
  // REALTIME MESSAGES AND REACTIONS
  // ---------------------------------------------------

  useEffect(() => {
    // التحديثات الفورية متاحة لكل قارئ مسجل
    if (
      !groupId ||
      !group?.is_active
    ) {
      return;
    }

    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_chat_messages",
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          const newMessage =
            payload.new as GroupChatMessage;

          if (
            !newMessage?.id ||
            newMessage.deleted_at
          ) {
            return;
          }

          setMessages((previous) => {
            const alreadyExists =
              previous.some(
                (message) =>
                  message.id === newMessage.id
              );

            if (alreadyExists) {
              return previous;
            }

            return [
              ...previous,
              newMessage,
            ];
          });

          // محاولة تحميل بيانات مرسل الرسالة الجديدة
          void getGroupChatMemberProfiles([
            newMessage.sender_id,
          ])
            .then((profiles) => {
              if (profiles.length > 0) {
                setMemberProfiles((previous) => {
                  const existingIds = new Set(
                    previous.map((profile) => profile.id)
                  );

                  const newProfiles = profiles.filter(
                    (profile) =>
                      !existingIds.has(profile.id)
                  );

                  return [
                    ...previous,
                    ...newProfiles,
                  ];
                });
              }
            })
            .catch((err) => {
              console.error(
                "Load new message sender profile error:",
                err
              );
            });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_chat_reactions",
        },
        () => {
          void loadReactions(
            messages.map((message) => message.id)
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    groupId,
    group?.is_active,
    messages,
    loadReactions,
  ]);

  // ---------------------------------------------------
  // LOAD REACTIONS FOR NEW MESSAGES
  // ---------------------------------------------------

  useEffect(() => {
    const messageIds = messages.map(
      (message) => message.id
    );

    if (messageIds.length === 0) {
      setReactions([]);
      return;
    }

    void loadReactions(messageIds);
  }, [messages, loadReactions]);

  // ---------------------------------------------------
  // AUTO SCROLL
  // ---------------------------------------------------

  useEffect(() => {
    if (!isNearBottomRef.current) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleMessagesScroll = () => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    isNearBottomRef.current =
      distanceFromBottom < 120;
  };

  // ---------------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------------

  const handleSendMessage = async () => {
    const content = messageContent.trim();

    if (
      !content ||
      sending ||
      !groupId ||
      !isMember ||
      !group?.is_active
    ) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const sentMessage =
        await sendGroupChatMessage(
          groupId,
          {
            content,
            reply_to: replyingTo?.id ?? null,
          }
        );

      setMessages((previous) => {
        const alreadyExists =
          previous.some(
            (message) => message.id === sentMessage.id
          );

        if (alreadyExists) {
          return previous;
        }

        return [
          ...previous,
          sentMessage,
        ];
      });

      setMessageContent("");
      setReplyingTo(null);

      if (textareaRef.current) {
        textareaRef.current.style.height =
          "auto";
      }

      isNearBottomRef.current = true;

      textareaRef.current?.focus();
    } catch (err) {
      console.error(
        "Send group message error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر إرسال الرسالة"
      );
    } finally {
      setSending(false);
    }
  };

  // ---------------------------------------------------
  // KEYBOARD
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // TEXTAREA RESIZE
  // ---------------------------------------------------

  const handleMessageChange = (
    value: string
  ) => {
    setMessageContent(value);

    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    textarea.style.height =
      `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-9 h-9 animate-spin text-blue-600" />

          <p className="text-sm text-slate-500 dark:text-slate-400">
            جارٍ تحميل المجموعة...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // ERROR
  // ---------------------------------------------------

  if (error && !group) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            تعذر فتح المجموعة
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {error}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              رجوع
            </button>

            <button
              onClick={() => void loadGroupData()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  // ---------------------------------------------------
  // INACTIVE GROUP
  // ---------------------------------------------------

  if (!group.is_active) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6"
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة</span>
          </button>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />

            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {group.name}
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-sm">
              هذه المجموعة غير نشطة حاليًا.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // GROUP HEADER
  // ---------------------------------------------------

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors"
    >
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col px-3 sm:px-5 py-4">
        {/* HEADER */}

        <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm px-4 py-4 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition"
              title="رجوع"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              {group.avatar_url ? (
                <img
                  src={group.avatar_url}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-6 h-6 text-white" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg truncate">
                {group.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <Users className="w-3.5 h-3.5" />

                <span>
                  {members.length} أعضاء
                </span>

                <span className="text-slate-300 dark:text-slate-700">
                  |
                </span>

                {group.is_private ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>مجموعة خاصة</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>مجموعة عامة</span>
                  </>
                )}
              </div>
            </div>

            {canCreateInvitation && (
              <button
                type="button"
                onClick={() => void handleCreateInvitation()}
                disabled={invitationLoading}
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition"
              >
                {invitationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}

                <span className="hidden sm:inline">
                  دعوة الأعضاء
                </span>

                <span className="sm:hidden">
                  دعوة
                </span>
              </button>
            )}
          </div>

          {group.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 leading-6">
              {group.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex -space-x-2 space-x-reverse">
              {members.slice(0, 6).map((member) => {
                const profile = getMemberProfile(
                  member.profile_id
                );

                return (
                  <div
                    key={member.profile_id}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                    title={
                      profile?.full_name ||
                      profile?.username ||
                      "عضو"
                    }
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                );
              })}
            </div>

            <span className="text-[11px] text-slate-400">
              {members.length > 6
                ? `و ${members.length - 6} أعضاء آخرين`
                : "أعضاء المجموعة"}
            </span>
          </div>
        </header>

        {/* INVITATION MODAL */}

        {invitationOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setInvitationOpen(false)}
          >
            <div
              dir="rtl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="invitation-title"
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div>
                    <h2
                      id="invitation-title"
                      className="font-bold text-slate-800 dark:text-white"
                    >
                      دعوة أعضاء جدد
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {group.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInvitationOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {invitationError && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 p-3 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="break-words">
                    {invitationError}
                  </p>
                </div>
              )}

              {invitationLoading && (
                <div className="py-8 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    جارٍ إنشاء رمز الدعوة...
                  </p>
                </div>
              )}

              {invitation && (
                <>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-7 mb-4">
                    شارك هذا الرمز مع الشخص الذي تريد
                    دعوته إلى المجموعة. يمكنه استخدامه
                    للانضمام وفق صلاحية الدعوة.
                  </p>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      رمز الدعوة
                    </p>

                    <div
                      dir="ltr"
                      className="break-all text-center font-mono text-sm sm:text-base font-bold tracking-wider text-slate-800 dark:text-slate-100 select-all"
                    >
                      {invitation.token}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleCopyInvitation()}
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm font-semibold transition"
                  >
                    {invitationCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        تم نسخ الرمز
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        نسخ رمز الدعوة
                      </>
                    )}
                  </button>
                </>
              )}

              {!invitation && !invitationLoading && invitationError && (
                <button
                  type="button"
                  onClick={() => void handleCreateInvitation()}
                  disabled={invitationLoading}
                  className="w-full mt-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm font-semibold transition disabled:opacity-60"
                >
                  إعادة المحاولة
                </button>
              )}

              <p className="text-[11px] text-slate-400 text-center mt-4 leading-5">
                احتفظ بالرمز وشاركه فقط مع الأشخاص الذين
                تريد إضافتهم إلى المجموعة.
              </p>
            </div>
          </div>
        )}

        {/* NON MEMBER NOTICE */}

        {!isMember && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 px-4 py-3">
            <Lock className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />

            <p className="text-xs sm:text-sm leading-6 text-blue-800 dark:text-blue-300">
              يمكنك قراءة رسائل هذه المجموعة، لكن المشاركة
              والإرسال والتفاعل متاحة لأعضاء المجموعة فقط.
            </p>
          </div>
        )}

        {/* GROUP CHAT - VISIBLE TO ALL AUTHENTICATED USERS */}

        <section className="flex-1 min-h-[65vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {/* CHAT TOP BAR */}

          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                المحادثة الجماعية
              </span>
            </div>

            <span className="text-[11px] text-slate-400">
              {messages.length} رسالة محملة
            </span>
          </div>

          {/* MESSAGES */}

          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className="flex-1 min-h-[400px] max-h-[calc(100vh-330px)] overflow-y-auto px-3 sm:px-6 py-5 space-y-4 bg-slate-50/70 dark:bg-slate-950/40"
          >
            {messages.length === 0 && (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                </div>

                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">
                  بداية المحادثة
                </h3>

                <p className="text-sm text-slate-400">
                  لا توجد رسائل بعد.
                  {isMember
                    ? " كن أول من يشارك!"
                    : ""}
                </p>
              </div>
            )}

            {messages.map((message, index) => {
              const ownMessage =
                message.sender_id === currentProfileId;

              const sender =
                getMemberProfile(message.sender_id);

              const senderColor =
                getStableColor(message.sender_id);

              const previousMessage =
                messages[index - 1];

              const nextMessage =
                messages[index + 1];

              const showDate =
                !previousMessage ||
                !isSameDay(
                  previousMessage.created_at,
                  message.created_at
                );

              const showSender =
                !ownMessage &&
                (!previousMessage ||
                  previousMessage.sender_id !==
                    message.sender_id ||
                  showDate);

              const showAvatar =
                !ownMessage &&
                (!nextMessage ||
                  nextMessage.sender_id !==
                    message.sender_id);

              const FileIcon =
                getFileIcon(message.attachment_type);

              const messageReactions =
                reactions.filter(
                  (item) =>
                    item.message_id === message.id
                );

              const groupedReactions = Array.from(
                messageReactions.reduce((map, item) => {
                  const existing = map.get(item.reaction);

                  if (existing) {
                    existing.count += 1;
                    existing.profileIds.push(item.profile_id);
                  } else {
                    map.set(item.reaction, {
                      reaction: item.reaction,
                      count: 1,
                      profileIds: [item.profile_id],
                    });
                  }

                  return map;
                }, new Map<string, {
                  reaction: string;
                  count: number;
                  profileIds: string[];
                }>())
              ).map(([, value]) => value);

              const repliedMessage =
                message.reply_to
                  ? messages.find(
                      (item) =>
                        item.id === message.reply_to
                    )
                  : null;

              const repliedSender =
                repliedMessage
                  ? getMemberProfile(
                      repliedMessage.sender_id
                    )
                  : null;

              const canDeleteThisMessage =
                isMember &&
                !message.deleted_at &&
                (
                  ownMessage ||
                  currentMember?.member_role === "owner" ||
                  currentMember?.member_role === "moderator"
                );

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-6">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-full shadow-sm">
                        {formatMessageDate(
                          message.created_at
                        )}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-end gap-2 ${
                      ownMessage
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {!ownMessage && (
                      <div className="w-8 shrink-0">
                        {showAvatar && (
                          <div
                            className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ${senderColor.avatar}`}
                          >
                            {sender?.avatar_url ? (
                              <img
                                src={sender.avatar_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserRound className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] sm:max-w-[72%] min-w-0 flex flex-col ${
                        ownMessage
                          ? "items-start"
                          : "items-end"
                      }`}
                    >
                      {showSender && (
                        <span
                          className={`text-[11px] font-bold mb-1 px-2 ${senderColor.text}`}
                        >
                          {sender?.full_name ||
                            sender?.username ||
                            "عضو"}
                        </span>
                      )}

                      <div
                        className={`relative min-w-0 px-4 py-3 shadow-sm border break-words ${
                          ownMessage
                            ? "bg-blue-600 text-white border-blue-600 rounded-2xl rounded-bl-md"
                            : `${senderColor.bubble} ${senderColor.text} border-transparent rounded-2xl rounded-br-md`
                        }`}
                      >
                        {message.is_pinned && (
                          <div
                            className={`flex items-center gap-1 text-[10px] mb-2 ${
                              ownMessage
                                ? "text-blue-100"
                                : "opacity-70"
                            }`}
                          >
                            <Pin className="w-3 h-3" />
                            <span>رسالة مثبتة</span>
                          </div>
                        )}

                        {repliedMessage && (
                          <div
                            className={`mb-3 rounded-xl px-3 py-2 border-r-2 ${
                              ownMessage
                                ? "bg-blue-700/50 border-blue-200"
                                : "bg-black/5 border-current"
                            }`}
                          >
                            <div className="flex items-center gap-1 text-[10px] font-bold mb-1">
                              <Reply className="w-3 h-3" />
                              <span>
                                {repliedSender?.full_name ||
                                  repliedSender?.username ||
                                  "عضو"}
                              </span>
                            </div>

                            <p className="text-xs opacity-80 line-clamp-2">
                              {repliedMessage.deleted_at
                                ? "تم حذف هذه الرسالة"
                                : repliedMessage.content || "مرفق"}
                            </p>
                          </div>
                        )}

                        {message.deleted_at ? (
                          <p className="text-sm italic opacity-70">
                            تم حذف هذه الرسالة
                          </p>
                        ) : (
                          <>
                            {message.content && (
                              <p className="text-sm leading-7 whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            )}

                            {message.attachment_url && (
                              <a
                                href={message.attachment_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-2 flex items-center gap-3 p-3 rounded-xl border ${
                                  ownMessage
                                    ? "bg-blue-700/40 border-blue-400/40"
                                    : "bg-white/70 dark:bg-slate-900/40 border-current/10"
                                }`}
                              >
                                {message.attachment_type?.startsWith(
                                  "image/"
                                ) ? (
                                  <ImageIcon className="w-5 h-5 shrink-0" />
                                ) : (
                                  <FileIcon className="w-5 h-5 shrink-0" />
                                )}

                                <span className="text-xs font-medium truncate flex-1">
                                  {getFileName(message)}
                                </span>

                                <Download className="w-4 h-4 shrink-0" />
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 px-2">
                        <span className="text-[10px] text-slate-400">
                          {formatMessageTime(
                            message.created_at
                          )}
                        </span>

                        {message.edited_at && (
                          <span className="text-[10px] text-slate-400">
                            · معدلة
                          </span>
                        )}

                        {ownMessage && (
                          <Check className="w-3 h-3 text-blue-500" />
                        )}

                        {/* REPLY - MEMBERS ONLY */}

                        {isMember && !message.deleted_at && (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(message);
                              textareaRef.current?.focus();
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                            title="الرد على الرسالة"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* DELETE - AUTHORIZED MEMBERS ONLY */}

                        {canDeleteThisMessage && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleDeleteMessage(message)
                            }
                            disabled={
                              deletingMessageId !== null
                            }
                            className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                            title="حذف الرسالة"
                          >
                            {deletingMessageId === message.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* MESSAGE REACTIONS */}

                      {!message.deleted_at && groupedReactions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mt-1 px-2">
                          {groupedReactions.map((item) => {
                            const isSelected =
                              !!currentProfileId &&
                              item.profileIds.includes(
                                currentProfileId
                              );

                            const isPending =
                              reactionLoading ===
                              `${message.id}:${item.reaction}`;

                            return (
                              <button
                                key={item.reaction}
                                type="button"
                                disabled={!isMember || !!reactionLoading}
                                onClick={() => {
                                  if (isMember) {
                                    void handleToggleReaction(
                                      message.id,
                                      item.reaction
                                    );
                                  }
                                }}
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition ${
                                  isSelected
                                    ? "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700"
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                } disabled:opacity-100 ${
                                  isMember
                                    ? "cursor-pointer"
                                    : "cursor-default"
                                }`}
                                title={
                                  isMember
                                    ? isSelected
                                      ? "إزالة تفاعلك"
                                      : "إضافة تفاعل"
                                    : "التفاعل للقراءة فقط"
                                }
                              >
                                <span>
                                  {item.reaction}
                                </span>

                                <span className="text-slate-600 dark:text-slate-300">
                                  {isPending
                                    ? "..."
                                    : item.count}
                                </span>
                              </button>
                            );
                          })}

                          {/* QUICK REACTIONS - MEMBERS ONLY */}

                          {isMember && (
                            <div className="flex items-center gap-0.5">
                              {QUICK_REACTIONS.map(
                                (reaction) => (
                                  <button
                                    key={reaction}
                                    type="button"
                                    disabled={!!reactionLoading}
                                    onClick={() =>
                                      void handleToggleReaction(
                                        message.id,
                                        reaction
                                      )
                                    }
                                    className="w-7 h-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm disabled:opacity-40"
                                    title={`تفاعل ${reaction}`}
                                  >
                                    {reaction}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* QUICK REACTIONS WHEN THERE ARE NO EXISTING REACTIONS */}

                      {!message.deleted_at &&
                        groupedReactions.length === 0 &&
                        isMember && (
                          <div className="flex items-center gap-0.5 mt-1 px-2">
                            {QUICK_REACTIONS.map(
                              (reaction) => (
                                <button
                                  key={reaction}
                                  type="button"
                                  disabled={!!reactionLoading}
                                  onClick={() =>
                                    void handleToggleReaction(
                                      message.id,
                                      reaction
                                    )
                                  }
                                  className="w-7 h-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm disabled:opacity-40"
                                  title={`تفاعل ${reaction}`}
                                >
                                  {reaction}
                                </button>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    {ownMessage && (
                      <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        {sender?.avatar_url ? (
                          <img
                            src={sender.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserRound className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* COMPOSER - MEMBERS ONLY */}

          {isMember ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSendMessage();
              }}
              className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4"
            >
              {error && (
                <div className="mb-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="mr-auto text-red-500 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              {replyingTo && (
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 px-3 py-2">
                  <Reply className="w-4 h-4 text-blue-600 shrink-0" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                      الرد على{" "}
                      {getMemberProfile(
                        replyingTo.sender_id
                      )?.full_name ||
                        getMemberProfile(
                          replyingTo.sender_id
                        )?.username ||
                        "عضو"}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {replyingTo.deleted_at
                        ? "تم حذف هذه الرسالة"
                        : replyingTo.content || "مرفق"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="w-7 h-7 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center justify-center text-blue-600"
                    title="إلغاء الرد"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={textareaRef}
                    value={messageContent}
                    onChange={(event) =>
                      handleMessageChange(
                        event.target.value
                      )
                    }
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="اكتب رسالتك..."
                    disabled={sending}
                    className="w-full resize-none min-h-[46px] max-h-[120px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !messageContent.trim()
                  }
                  className="w-12 h-12 shrink-0 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition shadow-sm"
                  title="إرسال الرسالة"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-[10px] text-slate-400">
                  Enter للإرسال · Shift + Enter لسطر جديد
                </p>

                <span className="text-[10px] text-slate-400">
                  UniShare Groups
                </span>
              </div>
            </form>
          ) : (
            <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                <Lock className="w-4 h-4" />
                <p className="text-sm">
                  القراءة متاحة للجميع، والمشاركة متاحة لأعضاء المجموعة فقط.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
