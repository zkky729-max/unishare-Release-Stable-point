import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  Plus,
  GraduationCap,
  Sparkles,
  CalendarDays,
  Layers3,
  ChevronDown,
  BookMarked,
  Loader2,
  Users,
  Lock,
  Globe,
  Orbit,
  Zap,
  Atom,
  X,
  Radio,
  Megaphone,
  BadgePercent,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/features/auth/context/AuthContext";

import { FeedProvider } from "../../posts/context/FeedContext";

import SemesterPostsSection from "../components/SemesterPostsSection";

import { getModulesBySemester } from "../../modules/api/modules";
import { getSubjectsByModule } from "../../subjects/api/subjects";

import {
  getSemesterGroupChats,
  type SemesterGroupChat,
} from "@/features/groupChats/api/getSemesterGroupChats";

import {
  createSemesterGroupChat,
  joinGroupChatByToken,
} from "@/features/groupChats/api/manageSemesterGroupChats";

// ======================================================
// Types
// ======================================================

type SemesterInfo = {
  id: string;
  name: string;
  semester_number: number;
  level_id: string;
  specialty_id: string | null;
};

type AcademicModule = {
  id: string;
  name: string;
};

type AcademicSubject = {
  id: string;
  name: string;
  description?: string | null;
  module_id?: string | null;
  specialty_id?: string | null;
};

type ModuleWithSubjects = AcademicModule & {
  subjects: AcademicSubject[];
};

// ======================================================
// Page Content
// ======================================================

function SemesterSpacePageContent() {
  const { semesterId } = useParams<{ semesterId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [semester, setSemester] = useState<SemesterInfo | null>(null);
  const [semesterPostsCount, setSemesterPostsCount] = useState(0);
  const [modules, setModules] = useState<ModuleWithSubjects[]>([]);
  const [groupChats, setGroupChats] = useState<SemesterGroupChat[]>([]);

  const [groupDialog, setGroupDialog] = useState<"create" | "join" | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [invitationToken, setInvitationToken] = useState("");
  const [groupActionLoading, setGroupActionLoading] = useState(false);
  const [groupActionError, setGroupActionError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [groupChatsLoading, setGroupChatsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [groupChatsError, setGroupChatsError] = useState<string | null>(null);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // ====================================================
  // Load Semester
  // ====================================================

  useEffect(() => {
    if (!semesterId) {
      setError("معرف السداسي غير موجود.");
      setLoading(false);
      return;
    }

    async function loadSemester() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: semesterError } = await supabase
          .from("semesters")
          .select(`
            id,
            name,
            semester_number,
            level_id,
            levels (
              specialty_id
            )
          `)
          .eq("id", semesterId)
          .maybeSingle();

        if (semesterError) {
          console.error("LOAD SEMESTER ERROR:", semesterError);
          throw semesterError;
        }

        if (!data) {
          throw new Error("لم يتم العثور على هذا السداسي.");
        }

        const levelData = Array.isArray(data.levels)
          ? data.levels[0]
          : data.levels;

        setSemester({
          id: data.id,
          name: data.name,
          semester_number: data.semester_number,
          level_id: data.level_id,
          specialty_id: levelData?.specialty_id ?? null,
        });
      } catch (err) {
        console.error("LOAD SEMESTER ERROR:", err);
        setError(
          err instanceof Error ? err.message : "تعذر تحميل السداسي."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSemester();
  }, [semesterId]);

  // ====================================================
  // Load Modules + Subjects
  // ====================================================

  useEffect(() => {
    if (!semesterId) return;

    async function loadAcademicStructure() {
      if (!semesterId) return;

      try {
        setModulesLoading(true);
        setModulesError(null);

        const moduleData = await getModulesBySemester(semesterId);

        const modulesWithSubjects = await Promise.all(
          moduleData.map(async (module) => {
            try {
              const subjects = await getSubjectsByModule(module.id);

              return {
                id: module.id,
                name: module.name,
                subjects: (subjects ?? []) as AcademicSubject[],
              };
            } catch (subjectError) {
              console.error(
                `LOAD SUBJECTS ERROR FOR MODULE ${module.id}:`,
                subjectError
              );

              return {
                id: module.id,
                name: module.name,
                subjects: [],
              };
            }
          })
        );

        setModules(modulesWithSubjects);

        setExpandedModules(
          modulesWithSubjects.reduce<Record<string, boolean>>((result, module) => {
            result[module.id] = true;
            return result;
          }, {})
        );
      } catch (err) {
        console.error("LOAD ACADEMIC STRUCTURE ERROR:", err);
        setModulesError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل الوحدات والمقاييس."
        );
      } finally {
        setModulesLoading(false);
      }
    }

    loadAcademicStructure();
  }, [semesterId]);

  // ====================================================
  // Load Semester Group Chats
  // ====================================================

  useEffect(() => {
    if (!semesterId || authLoading) {
      return;
    }

    let cancelled = false;

    async function loadSemesterGroupChats() {
      if (!user) {
        setGroupChats([]);
        setGroupChatsError(null);
        setGroupChatsLoading(false);
        return;
      }

      try {
        setGroupChatsLoading(true);
        setGroupChatsError(null);

        const data = await getSemesterGroupChats(semesterId!);

        if (!cancelled) setGroupChats(data);
      } catch (err) {
        console.error("LOAD SEMESTER GROUP CHATS ERROR:", err);

        if (!cancelled) {
          setGroupChatsError(
            err instanceof Error
              ? err.message
              : "تعذر تحميل المجموعات الدراسية."
          );
        }
      } finally {
        if (!cancelled) setGroupChatsLoading(false);
      }
    }

    loadSemesterGroupChats();

    return () => {
      cancelled = true;
    };
  }, [semesterId, user?.id, authLoading]);

  // ====================================================
  // Group Actions
  // ====================================================

  function openGroupChat(groupId: string) {
    navigate(`/group-chats/${encodeURIComponent(groupId)}`);
  }

  async function handleCreateSemesterGroup() {
    if (!semester || groupActionLoading) return;

    const name = newGroupName.trim();

    if (name.length < 2 || name.length > 100) {
      setGroupActionError("اسم المجموعة يجب أن يكون بين حرفين و100 حرف.");
      return;
    }

    try {
      setGroupActionLoading(true);
      setGroupActionError(null);

      const groupId = await createSemesterGroupChat({
        name,
        description: newGroupDescription.trim(),
        semesterId: semester.id,
      });

      try {
        const updatedGroups = await getSemesterGroupChats(semester.id);
        setGroupChats(updatedGroups);
      } catch (refreshError) {
        console.error("REFRESH SEMESTER GROUP CHATS ERROR:", refreshError);
      }

      setGroupDialog(null);
      openGroupChat(groupId);
    } catch (err) {
      console.error("CREATE SEMESTER GROUP ERROR:", err);
      setGroupActionError(
        err instanceof Error ? err.message : "تعذر إنشاء المجموعة الدراسية."
      );
    } finally {
      setGroupActionLoading(false);
    }
  }

  async function handleJoinSemesterGroup() {
    if (groupActionLoading) return;

    const token = invitationToken.trim();

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      setGroupActionError(
        "رمز الدعوة غير صالح. تأكد من نسخ الرمز المكوّن من 64 خانة."
      );
      return;
    }

    try {
      setGroupActionLoading(true);
      setGroupActionError(null);

      const groupId = await joinGroupChatByToken(token);

      if (semester) {
        try {
          const updatedGroups = await getSemesterGroupChats(semester.id);
          setGroupChats(updatedGroups);
        } catch (refreshError) {
          console.error("REFRESH SEMESTER GROUP CHATS ERROR:", refreshError);
        }
      }

      setGroupDialog(null);
      openGroupChat(groupId);
    } catch (err) {
      console.error("JOIN SEMESTER GROUP ERROR:", err);
      setGroupActionError(
        err instanceof Error ? err.message : "تعذر الانضمام إلى المجموعة."
      );
    } finally {
      setGroupActionLoading(false);
    }
  }

  function closeGroupDialog() {
    if (groupActionLoading) return;

    setGroupDialog(null);
    setGroupActionError(null);
  }

  // ====================================================
  // Academic Navigation
  // ====================================================

  function toggleModule(moduleId: string) {
    setExpandedModules((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }));
  }

  function openSubjectLessons(subjectId: string) {
    navigate(`/subjects/${subjectId}/lessons`);
  }

  // ====================================================
  // Loading
  // ====================================================

  if (loading) {
    return (
      <div dir="rtl" className="future-space min-h-screen bg-[#050816] px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-8 w-28 animate-pulse rounded-xl bg-white/10" />
          <div className="h-64 animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-72 animate-pulse rounded-[2rem] bg-white/[0.04]" />
            <div className="h-72 animate-pulse rounded-[2rem] bg-white/[0.04]" />
          </div>
        </div>
        <style>{futureStyles}</style>
      </div>
    );
  }

  // ====================================================
  // Error
  // ====================================================

  if (error || !semester) {
    return (
      <div dir="rtl" className="future-space flex min-h-screen items-center justify-center bg-[#050816] px-4 py-10">
        <div className="glass-panel w-full max-w-xl rounded-[2rem] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
            <Zap size={28} />
          </div>

          <h1 className="mt-5 text-xl font-black text-white">
            تعذر تحميل السداسي
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            {error ?? "تعذر العثور على السداسي."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="neon-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft size={18} />
            العودة
          </button>
        </div>
        <style>{futureStyles}</style>
      </div>
    );
  }

  // ====================================================
  // Render
  // ====================================================

  return (
    <div dir="rtl" className="future-space min-h-screen overflow-hidden bg-[#050816] text-slate-100">
      <style>{futureStyles}</style>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="space-orb orb-one" />
        <div className="space-orb orb-two" />
        <div className="space-orb orb-three" />
        <div className="space-grid" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Back */}

        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-400 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-200"
        >
          <ArrowLeft size={17} />
          العودة
        </button>

        {/* Hero */}

        <section className="hero-panel relative overflow-hidden rounded-[2rem] border border-cyan-300/15 p-6 shadow-[0_25px_100px_-45px_rgba(34,211,238,0.25)] sm:p-9 lg:p-11">
          <div className="hero-grid absolute inset-0 opacity-40" />
          <div className="hero-glow absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-400/15 blur-[90px]" />
          <div className="hero-glow absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-violet-500/20 blur-[100px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_35px_-10px_rgba(34,211,238,0.5)]">
                  <GraduationCap size={29} />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">
                    <Orbit size={14} className="animate-spin-slow" />
                    UNISHARE · ACADEMIC CORE
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-400">
                    الجيل القادم من التعلم الجامعي
                  </p>
                </div>

                <div className="mr-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  النظام الأكاديمي نشط
                </div>
              </div>

              <p className="mb-2 text-xs font-bold tracking-wide text-cyan-200/90">
                المساحة الأكاديمية
              </p>

              <h1 className="semester-title max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {semester.name}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                مركزك الأكاديمي المتكامل. اكتشف الوحدات والمقاييس،
                وتبادل المعرفة، وتواصل مع زملائك في فضاء رقمي
                مصمم لمستقبل التعليم.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <div className="hero-chip">
                  <CalendarDays size={14} />
                  السداسي {semester.semester_number}
                </div>
                <div className="hero-chip">
                  <FileText size={14} />
                  {semesterPostsCount} منشور
                </div>
                <div className="hero-chip">
                  <Layers3 size={14} />
                  {modules.length} وحدة أكاديمية
                </div>
              </div>
            </div>

            <div className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52 lg:mx-0">
              <div className="absolute inset-0 rounded-full border border-cyan-300/15" />
              <div className="absolute inset-4 rounded-full border border-dashed border-violet-300/25 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full border border-cyan-300/20" />
              <div className="absolute h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-gradient-to-br from-cyan-400/15 to-violet-500/20 text-cyan-200 shadow-[0_0_55px_-15px_rgba(34,211,238,0.5)]">
                <Atom size={48} strokeWidth={1.2} />
              </div>
              <span className="absolute right-5 top-7 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
              <span className="absolute bottom-8 left-5 h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_#c4b5fd]" />
              <span className="absolute left-7 top-12 h-1 w-1 rounded-full bg-blue-300" />
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {[
              { label: "المحتوى الأكاديمي", value: semesterPostsCount, icon: FileText },
              { label: "الوحدات التعليمية", value: modules.length, icon: Layers3 },
              { label: "المجموعات الدراسية", value: groupChats.length, icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="hero-stat">
                  <div className="mb-2 flex items-center gap-2 text-cyan-200">
                    <Icon size={15} />
                    <span className="text-[10px] font-bold sm:text-xs">{item.label}</span>
                  </div>
                  <p className="text-2xl font-black tabular-nums text-white sm:text-3xl">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Advertisement Space */}

        <section className="advertisement-section mt-8" aria-label="المساحة الإعلانية">
          <div className="advertisement-card">
            <div className="advertisement-orbit advertisement-orbit-one" />
            <div className="advertisement-orbit advertisement-orbit-two" />
            <div className="advertisement-glow" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 p-6 text-center sm:flex-row sm:p-8 sm:text-right">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="advertisement-icon">
                  <Megaphone size={27} />
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="advertisement-label">
                      <Radio size={11} />
                      ADVERTISEMENT SPACE
                    </span>
                    <span className="advertisement-status">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      مساحة إعلانية
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    مساحة مخصصة للإعلانات
                  </h2>

                  <p className="mt-2 max-w-xl text-xs leading-7 text-slate-300 sm:text-sm">
                    هنا ستظهر الإعلانات والعروض التي تهم طلبة هذا السداسي،
                    في مساحة مستقلة لا تؤثر على تجربتك الأكاديمية.
                  </p>
                </div>
              </div>

              <div className="relative flex shrink-0 flex-col items-center gap-2">
                <div className="advertisement-badge">
                  <BadgePercent size={24} />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-cyan-200/80">
                  UNISHARE ADS
                </span>
              </div>
            </div>

            <div className="advertisement-footer">
              <span className="flex items-center gap-2">
                <Sparkles size={13} />
                مساحة إعلانية مستقلة
              </span>
              <span className="hidden sm:inline">ACADEMIC NETWORK · 2050</span>
            </div>
          </div>
        </section>

        {/* Academic Structure + Groups */}

        <div className="mt-9 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">

          {/* Modules */}

          <section className="min-w-0">
            <div className="section-heading mb-5">
              <div className="section-icon cyan-icon">
                <Layers3 size={21} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    البنية الأكاديمية
                  </h2>
                  <span className="section-tag">ACADEMIC STRUCTURE</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  الوحدات والمقاييس المرتبطة بهذا السداسي
                </p>
              </div>
              {!modulesLoading && modules.length > 0 && (
                <span className="mr-auto rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-black text-cyan-300">
                  {modules.length} وحدة
                </span>
              )}
            </div>

            {modulesLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-56 animate-pulse rounded-3xl bg-white/[0.04]" />
                <div className="h-56 animate-pulse rounded-3xl bg-white/[0.04]" />
              </div>
            ) : modulesError ? (
              <div className="status-panel border-rose-400/20">
                <Zap className="mx-auto text-rose-300" size={28} />
                <h3 className="mt-3 font-black text-rose-200">
                  تعذر تحميل الوحدات والمقاييس
                </h3>
                <p className="mt-2 text-sm leading-7 text-rose-200">
                  {modulesError}
                </p>
              </div>
            ) : modules.length === 0 ? (
              <div className="empty-future">
                <div className="empty-icon">
                  <Layers3 size={30} />
                </div>
                <h3 className="mt-5 text-lg font-black text-white">
                  لا توجد وحدات لهذا السداسي
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  لم تتم إضافة أي وحدات أكاديمية مرتبطة بهذا السداسي بعد.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, moduleIndex) => {
                  const isExpanded = expandedModules[module.id] ?? true;

                  return (
                    <article key={module.id} className="module-panel group">
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        aria-expanded={isExpanded}
                        className="relative flex w-full items-center gap-4 overflow-hidden p-4 text-right sm:p-5"
                      >
                        <div className="module-number">
                          {String(moduleIndex + 1).padStart(2, "0")}
                        </div>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-200 transition-all group-hover:border-cyan-300/35 group-hover:shadow-[0_0_25px_-10px_rgba(34,211,238,0.5)]">
                          <Layers3 size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black tracking-wider text-cyan-200">
                              MODULE {String(moduleIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-500" />
                            <span className="text-[10px] font-bold text-slate-300">
                              {module.subjects.length} مقياس
                            </span>
                          </div>
                          <h3 className="truncate text-base font-black text-white sm:text-lg">
                            {module.name}
                          </h3>
                        </div>

                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 ${isExpanded ? "rotate-180 border-cyan-300/30 text-cyan-200" : ""}`}>
                          <ChevronDown size={19} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="module-content border-t border-white/[0.07] p-3 sm:p-4">
                          {module.subjects.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
                              <BookMarked size={25} className="mx-auto text-slate-400" />
                              <p className="mt-3 text-sm font-bold text-slate-200">
                                لا توجد مقاييس لهذه الوحدة
                              </p>
                            </div>
                          ) : (
                            <div className="grid gap-2.5">
                              {module.subjects.map((subject, subjectIndex) => (
                                <div
                                  key={subject.id}
                                  className="subject-row group/subject"
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.07] text-violet-200 transition group-hover/subject:border-cyan-300/30 group-hover/subject:text-cyan-200">
                                    <BookOpen size={18} />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-white/[0.09] px-1.5 text-[9px] font-black text-slate-200">
                                        {subjectIndex + 1}
                                      </span>
                                      <h4 className="subject-title truncate text-sm font-black">
                                        {subject.name}
                                      </h4>
                                    </div>
                                    {subject.description && (
                                      <p className="subject-description mt-1 line-clamp-2 text-xs leading-5">
                                        {subject.description}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => openSubjectLessons(subject.id)}
                                    className="lesson-button"
                                  >
                                    <BookOpen size={15} />
                                    <span>الدروس</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Group Chats */}

          <section className="min-w-0">
            <div className="section-heading mb-5">
              <div className="section-icon violet-icon">
                <Users size={21} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    مجتمع السداسي
                  </h2>
                  <span className="section-tag violet-tag">STUDY NETWORK</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  تواصل وتعاون مع زملائك
                </p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setGroupActionError(null);
                  setGroupDialog("create");
                }}
                className="group-button"
              >
                <Plus size={16} />
                إنشاء مجموعة
              </button>

              <button
                type="button"
                onClick={() => {
                  setGroupActionError(null);
                  setGroupDialog("join");
                }}
                className="group-button group-button-secondary"
              >
                <Users size={16} />
                الانضمام برمز
              </button>
            </div>

            {groupChatsLoading ? (
              <div className="space-y-3">
                <div className="h-32 animate-pulse rounded-3xl bg-white/[0.04]" />
                <div className="h-32 animate-pulse rounded-3xl bg-white/[0.04]" />
              </div>
            ) : groupChatsError ? (
              <div className="status-panel border-rose-400/20">
                <Zap className="mx-auto text-rose-300" size={26} />
                <h3 className="mt-3 text-sm font-black text-rose-200">
                  تعذر تحميل المجموعات الدراسية
                </h3>
                <p className="mt-2 text-xs leading-6 text-rose-200">
                  {groupChatsError}
                </p>
              </div>
            ) : groupChats.length === 0 ? (
              <div className="empty-future px-5 py-10">
                <div className="empty-icon violet-empty">
                  <Users size={27} />
                </div>
                <h3 className="mt-4 text-base font-black text-white">
                  لا توجد مجموعات بعد
                </h3>
                <p className="mt-2 text-xs leading-7 text-slate-300">
                  أنشئ أول مجموعة دراسية وابدأ التعاون مع زملائك.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupChats.map((group) => (
                  <article
                    key={group.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openGroupChat(group.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openGroupChat(group.id);
                      }
                    }}
                    aria-label={`فتح مجموعة ${group.name}`}
                    className="group-card"
                  >
                    <div className="flex items-start gap-3">
                      {group.avatar_url ? (
                        <img
                          src={group.avatar_url}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-2xl border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
                          <Users size={21} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-black text-white transition-colors group-hover:text-cyan-200">
                          {group.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-6 text-slate-300">
                          {group.description ||
                            "مجموعة دراسية للتواصل وتبادل المعلومات بين الطلبة."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        group.is_private
                          ? "border-amber-300/20 bg-amber-300/[0.07] text-amber-200"
                          : "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200"
                      }`}>
                        {group.is_private ? <Lock size={11} /> : <Globe size={11} />}
                        {group.is_private ? "مجموعة خاصة" : "مجموعة عامة"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-200 transition group-hover:text-cyan-100">
                        فتح الدردشة
                        <ArrowLeft size={12} />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Create / Join Dialog */}

        {groupDialog && (
          <div
            className="future-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeGroupDialog();
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="group-dialog-title"
              className="future-modal"
              dir="rtl"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
                    <Users size={23} />
                  </div>
                  <h2 id="group-dialog-title" className="text-xl font-black text-white">
                    {groupDialog === "create"
                      ? "إنشاء مجموعة دراسية"
                      : "الانضمام إلى مجموعة"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {groupDialog === "create"
                      ? `سيتم ربط المجموعة تلقائياً بـ ${semester.name}.`
                      : "أدخل رمز الدعوة الذي وصلك للانضمام إلى المجموعة."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeGroupDialog}
                  disabled={groupActionLoading}
                  aria-label="إغلاق"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (groupDialog === "create") {
                    void handleCreateSemesterGroup();
                  } else {
                    void handleJoinSemesterGroup();
                  }
                }}
                className="space-y-4"
              >
                {groupDialog === "create" ? (
                  <>
                    <div>
                      <label htmlFor="semester-group-name" className="mb-2 block text-sm font-bold text-slate-200">
                        اسم المجموعة
                      </label>
                      <input
                        id="semester-group-name"
                        type="text"
                        value={newGroupName}
                        onChange={(event) => setNewGroupName(event.target.value)}
                        minLength={2}
                        maxLength={100}
                        required
                        autoFocus
                        placeholder="مثلاً: مجموعة مراجعة السداسي"
                        className="future-input"
                      />
                      <p className="mt-1.5 text-xs text-slate-400">من حرفين إلى 100 حرف.</p>
                    </div>

                    <div>
                      <label htmlFor="semester-group-description" className="mb-2 block text-sm font-bold text-slate-200">
                        وصف المجموعة (اختياري)
                      </label>
                      <textarea
                        id="semester-group-description"
                        value={newGroupDescription}
                        onChange={(event) => setNewGroupDescription(event.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="ما الهدف من هذه المجموعة؟"
                        className="future-input resize-y"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor="semester-group-invitation" className="mb-2 block text-sm font-bold text-slate-200">
                      رمز الدعوة
                    </label>
                    <input
                      id="semester-group-invitation"
                      type="text"
                      dir="ltr"
                      value={invitationToken}
                      onChange={(event) => setInvitationToken(event.target.value)}
                      minLength={64}
                      maxLength={64}
                      required
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                      placeholder="ألصق رمز الدعوة هنا"
                      className="future-input text-left font-mono"
                    />
                    <p className="mt-1.5 text-xs text-slate-400">الرمز يتكون من 64 خانة.</p>
                  </div>
                )}

                {groupActionError && (
                  <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-sm leading-6 text-rose-200">
                    {groupActionError}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeGroupDialog}
                    disabled={groupActionLoading}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    disabled={groupActionLoading}
                    className="neon-button flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {groupActionLoading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        جارٍ التنفيذ...
                      </>
                    ) : groupDialog === "create" ? (
                      "إنشاء المجموعة"
                    ) : (
                      "الانضمام إلى المجموعة"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Semester Posts */}

        <SemesterPostsSection
          semesterId={semester.id}
          onError={setError}
          onCountChange={setSemesterPostsCount}
        />

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400">
            <Orbit size={13} />
            UNISHARE ACADEMIC NETWORK · 2050
          </div>
        </footer>
      </div>
    </div>
  );
}

// ======================================================
// Future UI Styles
// ======================================================

const futureStyles = `
  .future-space {
    isolation: isolate;
    position: relative;
    font-family: inherit;
  }

  /* Semester title: force white color */

  .future-space .semester-title {
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    font-weight: 900;
  }

  /* Improve academic text contrast */

  .future-space .subject-title {
    color: #f8fafc !important;
    font-weight: 900;
    line-height: 1.8;
    text-shadow: 0 1px 12px rgba(34,211,238,.08);
  }

  .future-space .subject-description {
    color: #cbd5e1 !important;
    line-height: 1.8;
  }

  .future-space .module-panel h3 {
    color: #ffffff;
  }

  .future-space .module-panel .text-slate-500 {
    color: #cbd5e1;
  }

  .future-space .module-panel .text-slate-400 {
    color: #e2e8f0;
  }

  .future-space .section-heading p {
    color: #cbd5e1;
  }

  .space-grid,
  .hero-grid {
    background-image:
      linear-gradient(rgba(103,232,249,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(103,232,249,.035) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, black, transparent 90%);
  }

  .space-orb {
    position: absolute;
    border-radius: 9999px;
    filter: blur(75px);
    opacity: .12;
    animation: orbFloat 14s ease-in-out infinite alternate;
  }

  .orb-one {
    width: 320px;
    height: 320px;
    background: #06b6d4;
    top: 8%;
    right: -180px;
  }

  .orb-two {
    width: 360px;
    height: 360px;
    background: #7c3aed;
    top: 48%;
    left: -200px;
    animation-delay: -5s;
  }

  .orb-three {
    width: 250px;
    height: 250px;
    background: #2563eb;
    bottom: 2%;
    right: 30%;
    animation-delay: -8s;
  }

  .hero-panel {
    background:
      radial-gradient(ellipse at 80% 0%, rgba(34,211,238,.12), transparent 45%),
      radial-gradient(ellipse at 10% 100%, rgba(139,92,246,.16), transparent 45%),
      linear-gradient(125deg, #0c1930 0%, #0a1024 48%, #11102b 100%);
  }

  .hero-stat {
    min-width: 0;
    border-left: 1px solid rgba(255,255,255,.08);
    padding-inline: 12px;
  }

  .hero-stat:last-child {
    border-left: 0;
  }

  .hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(103,232,249,.18);
    border-radius: 999px;
    background: rgba(34,211,238,.055);
    padding: 9px 14px;
    color: #a5f3fc;
    font-size: 11px;
    font-weight: 800;
    backdrop-filter: blur(12px);
  }

  .glass-panel {
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(13,22,43,.78);
    box-shadow: 0 25px 80px -40px rgba(34,211,238,.2);
    backdrop-filter: blur(20px);
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
  }

  .section-icon {
    display: flex;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,.1);
  }

  .cyan-icon {
    color: #67e8f9;
    background: rgba(34,211,238,.09);
    border-color: rgba(34,211,238,.2);
  }

  .violet-icon {
    color: #c4b5fd;
    background: rgba(139,92,246,.1);
    border-color: rgba(167,139,250,.2);
  }

  .section-tag {
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(103,232,249,.15);
    border-radius: 999px;
    padding: 4px 8px;
    color: rgba(103,232,249,.85);
    background: rgba(34,211,238,.04);
    font-size: 8px;
    font-weight: 900;
    letter-spacing: .12em;
  }

  .violet-tag {
    color: rgba(196,181,253,.9);
    border-color: rgba(167,139,250,.18);
    background: rgba(139,92,246,.06);
  }

  .module-panel {
    overflow: hidden;
    border: 1px solid rgba(148,163,184,.18);
    border-radius: 23px;
    background:
      linear-gradient(120deg, rgba(15,30,54,.96), rgba(12,17,38,.96));
    box-shadow: 0 15px 45px -35px rgba(34,211,238,.35);
    transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
  }

  .module-panel:hover {
    border-color: rgba(103,232,249,.3);
    box-shadow: 0 20px 55px -35px rgba(34,211,238,.4);
    transform: translateY(-2px);
  }

  .module-number {
    display: flex;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    border: 1px solid rgba(103,232,249,.15);
    background: rgba(34,211,238,.05);
    color: #a5f3fc;
    font-size: 9px;
    font-weight: 900;
  }

  .module-content {
    animation: revealContent .3s ease both;
    background: rgba(3,8,22,.35);
  }

  .subject-row {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 12px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 17px;
    background: rgba(255,255,255,.035);
    padding: 13px;
    transition: border-color .25s ease, background .25s ease;
  }

  .subject-row:hover {
    border-color: rgba(103,232,249,.3);
    background: rgba(34,211,238,.055);
  }

  .lesson-button {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid rgba(103,232,249,.25);
    border-radius: 11px;
    background: linear-gradient(110deg, rgba(8,145,178,.22), rgba(79,70,229,.2));
    padding: 9px 13px;
    color: #a5f3fc;
    font-size: 11px;
    font-weight: 900;
    transition: all .2s ease;
  }

  .lesson-button:hover {
    border-color: rgba(103,232,249,.5);
    background: rgba(8,145,178,.25);
    box-shadow: 0 0 22px -10px rgba(34,211,238,.6);
    transform: translateY(-1px);
  }

  /* Advertisement Space */

  .advertisement-card {
    position: relative;
    overflow: hidden;
    min-height: 180px;
    border: 1px solid rgba(103,232,249,.22);
    border-radius: 25px;
    background:
      radial-gradient(ellipse at 85% 0%, rgba(34,211,238,.15), transparent 42%),
      radial-gradient(ellipse at 5% 100%, rgba(139,92,246,.18), transparent 45%),
      linear-gradient(120deg, #101d37, #11132d 55%, #171333);
    box-shadow: 0 20px 65px -45px rgba(34,211,238,.4);
    transition: border-color .3s ease, box-shadow .3s ease;
  }

  .advertisement-card:hover {
    border-color: rgba(103,232,249,.4);
    box-shadow: 0 25px 75px -42px rgba(34,211,238,.35);
  }

  .advertisement-card::before {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(103,232,249,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(103,232,249,.035) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(to left, black, transparent 85%);
    content: "";
    pointer-events: none;
  }

  .advertisement-glow {
    position: absolute;
    width: 180px;
    height: 180px;
    right: 35%;
    top: -120px;
    border-radius: 50%;
    background: rgba(34,211,238,.15);
    filter: blur(55px);
    pointer-events: none;
  }

  .advertisement-orbit {
    position: absolute;
    width: 210px;
    height: 210px;
    border: 1px solid rgba(103,232,249,.12);
    border-radius: 50%;
    pointer-events: none;
  }

  .advertisement-orbit-one {
    left: -100px;
    bottom: -150px;
  }

  .advertisement-orbit-two {
    left: -65px;
    bottom: -115px;
    border-color: rgba(167,139,250,.16);
  }

  .advertisement-icon {
    display: flex;
    width: 62px;
    height: 62px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(103,232,249,.3);
    border-radius: 20px;
    background: linear-gradient(145deg, rgba(34,211,238,.16), rgba(139,92,246,.16));
    color: #a5f3fc;
    box-shadow: 0 0 35px -12px rgba(34,211,238,.5);
  }

  .advertisement-label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 1px solid rgba(103,232,249,.2);
    border-radius: 999px;
    background: rgba(34,211,238,.07);
    padding: 5px 9px;
    color: #67e8f9;
    font-size: 8px;
    font-weight: 900;
    letter-spacing: .12em;
  }

  .advertisement-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #cbd5e1;
    font-size: 9px;
    font-weight: 700;
  }

  .advertisement-badge {
    display: flex;
    width: 58px;
    height: 58px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(167,139,250,.25);
    border-radius: 19px;
    background: rgba(139,92,246,.12);
    color: #c4b5fd;
    box-shadow: 0 0 30px -12px rgba(139,92,246,.55);
  }

  .advertisement-footer {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px solid rgba(255,255,255,.08);
    background: rgba(3,8,22,.22);
    padding: 11px 22px;
    color: #a5f3fc;
    font-size: 9px;
    font-weight: 800;
  }

  .group-button {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid rgba(167,139,250,.25);
    border-radius: 13px;
    background: linear-gradient(110deg, rgba(124,58,237,.25), rgba(79,70,229,.2));
    padding: 12px 9px;
    color: #ddd6fe;
    font-size: 11px;
    font-weight: 900;
    transition: all .25s ease;
  }

  .group-button:hover {
    border-color: rgba(196,181,253,.5);
    background: rgba(124,58,237,.3);
    box-shadow: 0 0 25px -12px rgba(167,139,250,.6);
    transform: translateY(-2px);
  }

  .group-button-secondary {
    border-color: rgba(103,232,249,.2);
    background: rgba(34,211,238,.045);
    color: #a5f3fc;
  }

  .group-button-secondary:hover {
    border-color: rgba(103,232,249,.45);
    background: rgba(34,211,238,.1);
  }

  .group-card {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(167,139,250,.2);
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(31,25,60,.85), rgba(13,21,43,.95));
    padding: 17px;
    transition: all .25s ease;
  }

  .group-card::before {
    position: absolute;
    top: 0;
    right: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, #a78bfa, #22d3ee);
    content: "";
    opacity: .7;
  }

  .group-card:hover {
    border-color: rgba(167,139,250,.4);
    box-shadow: 0 15px 40px -25px rgba(139,92,246,.5);
    transform: translateY(-3px);
  }

  .group-card:focus-visible,
  .filter-card:focus-visible,
  .lesson-button:focus-visible,
  .group-button:focus-visible {
    outline: 2px solid #67e8f9;
    outline-offset: 3px;
  }

  .status-panel,
  .empty-future {
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 24px;
    background: rgba(15,23,42,.65);
    padding: 38px 22px;
    text-align: center;
  }

  .empty-future {
    border-style: dashed;
    border-color: rgba(103,232,249,.18);
    background:
      radial-gradient(ellipse at 50% 0%, rgba(34,211,238,.06), transparent 65%),
      rgba(15,23,42,.55);
  }

  .empty-icon {
    display: flex;
    width: 62px;
    height: 62px;
    align-items: center;
    justify-content: center;
    margin-inline: auto;
    border: 1px solid rgba(103,232,249,.2);
    border-radius: 20px;
    background: rgba(34,211,238,.08);
    color: #67e8f9;
    box-shadow: 0 0 35px -15px rgba(34,211,238,.5);
  }

  .violet-empty {
    border-color: rgba(167,139,250,.2);
    background: rgba(139,92,246,.09);
    color: #c4b5fd;
  }

  .filter-card {
    min-height: 145px;
    border: 1px solid rgba(148,163,184,.18);
    border-radius: 19px;
    background: rgba(15,23,42,.68);
    padding: 15px;
    text-align: right;
    transition: all .25s ease;
  }

  .filter-card:hover {
    border-color: rgba(103,232,249,.25);
    background: rgba(15,30,54,.9);
    transform: translateY(-3px);
  }

  .composer-launch {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 15px;
    border: 1px solid rgba(103,232,249,.18);
    border-radius: 22px;
    background:
      radial-gradient(ellipse at 0% 50%, rgba(34,211,238,.09), transparent 55%),
      linear-gradient(110deg, rgba(15,30,54,.9), rgba(20,18,49,.9));
    padding: 17px;
    text-align: right;
    transition: all .25s ease;
  }

  .composer-launch:hover {
    border-color: rgba(103,232,249,.4);
    box-shadow: 0 15px 45px -30px rgba(34,211,238,.5);
    transform: translateY(-2px);
  }

  .composer-panel {
    border: 1px solid rgba(103,232,249,.2);
    border-radius: 24px;
    background: rgba(12,22,42,.88);
    padding: 15px;
    box-shadow: 0 20px 60px -40px rgba(34,211,238,.35);
  }

  .post-card {
    border: 1px solid rgba(148,163,184,.15);
    border-radius: 25px;
    background:
      radial-gradient(ellipse at 100% 0%, rgba(34,211,238,.045), transparent 42%),
      linear-gradient(145deg, rgba(15,25,47,.97), rgba(10,15,33,.97));
    box-shadow: 0 18px 55px -40px rgba(0,0,0,.8);
    transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
  }

  .post-card:hover {
    border-color: rgba(103,232,249,.23);
    box-shadow: 0 25px 65px -42px rgba(34,211,238,.2);
    transform: translateY(-3px);
  }

  .future-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    background: rgba(2,6,18,.82);
    padding: 24px 16px;
    backdrop-filter: blur(14px);
    animation: fadeIn .2s ease both;
  }

  .future-modal {
    width: 100%;
    max-width: 510px;
    border: 1px solid rgba(167,139,250,.25);
    border-radius: 25px;
    background:
      radial-gradient(ellipse at 100% 0%, rgba(139,92,246,.13), transparent 50%),
      linear-gradient(145deg, #111a33, #0a1022);
    padding: 25px;
    box-shadow: 0 30px 100px -30px rgba(0,0,0,.9), 0 0 50px -25px rgba(139,92,246,.35);
    animation: modalEnter .25s ease both;
  }

  .future-input {
    width: 100%;
    border: 1px solid rgba(148,163,184,.2);
    border-radius: 13px;
    background: rgba(3,8,22,.55);
    padding: 13px 15px;
    color: #f1f5f9;
    font-size: 13px;
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .future-input::placeholder {
    color: #94a3b8;
  }

  .future-input:focus {
    border-color: rgba(103,232,249,.55);
    background: rgba(3,8,22,.8);
    box-shadow: 0 0 0 3px rgba(34,211,238,.1);
  }

  .neon-button {
    border: 1px solid rgba(103,232,249,.35);
    background: linear-gradient(105deg, #0891b2, #4f46e5);
    box-shadow: 0 8px 25px -12px rgba(34,211,238,.65);
    transition: all .2s ease;
  }

  .neon-button:hover {
    box-shadow: 0 12px 35px -12px rgba(34,211,238,.75);
    filter: brightness(1.12);
    transform: translateY(-2px);
  }

  .animate-spin-slow {
    animation: slowSpin 12s linear infinite;
  }

  @keyframes slowSpin {
    to { transform: rotate(360deg); }
  }

  @keyframes orbFloat {
    from { transform: translate3d(0,0,0) scale(1); }
    to { transform: translate3d(25px,-35px,0) scale(1.12); }
  }

  @keyframes revealContent {
    from { opacity: 0; transform: translateY(-7px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalEnter {
    from { opacity: 0; transform: translateY(12px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (min-width: 640px) {
    .subject-row {
      flex-direction: row;
      align-items: center;
    }
  }

  @media (max-width: 480px) {
    .hero-stat {
      padding-inline: 7px;
    }

    .hero-stat span {
      line-height: 1.5;
    }

    .filter-card {
      min-height: 135px;
      padding: 12px;
    }

    .future-modal {
      padding: 19px;
    }

    .advertisement-footer {
      padding-inline: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .future-space *,
    .future-space *::before,
    .future-space *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: .01ms !important;
    }
  }
`;

// ======================================================
// Page Provider
// ======================================================

export default function SemesterSpacePage() {
  return (
    <FeedProvider>
      <SemesterSpacePageContent />
    </FeedProvider>
  );
}