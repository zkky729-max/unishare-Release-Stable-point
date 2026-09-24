import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  BookOpen,
  CalendarDays,
  Check,
  FileText,
  FlaskConical,
  GraduationCap,
  Image as ImageIcon,
  Paperclip,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { supabase } from "../../../lib/supabaseClient";

import { useFeed } from "../context/FeedContext";

import type {
  AcademicPostType,
} from "../types/post";

// =====================================================
// Props
// =====================================================

interface AcademicComposerProps {
  semesterId: string;
}

// =====================================================
// Semester Info
// =====================================================

interface SemesterInfo {
  id: string;
  name: string;
  semester_number: number | null;
  level_id: string;
  specialty_id: string;
}

// =====================================================
// Module / Subject
// =====================================================

interface AcademicModule {
  id: string;
  name: string;
}

interface AcademicSubject {
  id: string;
  name: string;
  module_id: string;
}

// =====================================================
// Post Types
// =====================================================

const postTypes: {
  value: AcademicPostType;
  label: string;
  icon: typeof BookOpen;
  description: string;
}[] = [
  {
    value: "lesson",
    label: "درس",
    icon: BookOpen,
    description: "شارك درسًا أو محاضرة",
  },
  {
    value: "summary",
    label: "ملخص",
    icon: FileText,
    description: "شارك ملخصًا مفيدًا",
  },
  {
    value: "exam",
    label: "امتحان",
    icon: CalendarDays,
    description: "شارك امتحانًا أو نموذجًا",
  },
  {
    value: "research_discussion",
    label: "بحث / مناقشة أكاديمية",
    icon: FlaskConical,
    description: "شارك بحثًا أو موضوعًا أكاديميًا للمناقشة",
  },
];

// =====================================================
// Academic Years
// =====================================================

const academicYears = [
  "2025/2026",
  "2026/2027",
  "2027/2028",
];

// =====================================================
// Component
// =====================================================

export default function AcademicComposer({
  semesterId,
}: AcademicComposerProps) {
  const { createPost } = useFeed();

  // ===================================================
  // Form State
  // ===================================================

  const [academicType, setAcademicType] =
    useState<AcademicPostType>("lesson");

  const [subjectId, setSubjectId] =
    useState("");

  const [subjectName, setSubjectName] =
    useState("");

  const [lessonTitle, setLessonTitle] =
    useState("");

  const [teacherName, setTeacherName] =
    useState("");

  const [academicYear, setAcademicYear] =
    useState("2025/2026");

  const [content, setContent] =
    useState("");

  const [images, setImages] =
    useState<File[]>([]);

  const [pdf, setPdf] =
    useState<File | null>(null);

  // ===================================================
  // Academic Data State
  // ===================================================

  const [modules, setModules] =
    useState<AcademicModule[]>([]);

  const [subjects, setSubjects] =
    useState<AcademicSubject[]>([]);

  const [loadingAcademicData, setLoadingAcademicData] =
    useState(false);

  // ===================================================
  // UI State
  // ===================================================

  const [loading, setLoading] =
    useState(false);

  const [checkingSemester, setCheckingSemester] =
    useState(true);

  const [semesterValid, setSemesterValid] =
    useState(false);

  const [semester, setSemester] =
    useState<SemesterInfo | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const [messageType, setMessageType] =
    useState<"success" | "error" | null>(null);

  // ===================================================
  // Refs
  // ===================================================

  const imageInputRef =
    useRef<HTMLInputElement | null>(null);

  const pdfInputRef =
    useRef<HTMLInputElement | null>(null);

  // ===================================================
  // Validate Semester
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function validateSemester() {
      setCheckingSemester(true);
      setSemesterValid(false);
      setSemester(null);
      setModules([]);
      setSubjects([]);
      setSubjectId("");
      setSubjectName("");
      setMessage(null);
      setMessageType(null);

      if (!semesterId) {
        setCheckingSemester(false);

        setMessage(
          "تعذر تحديد السداسي الحالي."
        );

        setMessageType("error");

        return;
      }

      try {
        // ---------------------------------------------
        // Current User
        // ---------------------------------------------

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error(
            "يجب تسجيل الدخول أولًا."
          );
        }

        // ---------------------------------------------
        // Profile
        // ---------------------------------------------

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("specialty_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          throw new Error(
            "لم يتم العثور على الملف الشخصي."
          );
        }

        if (!profile.specialty_id) {
          throw new Error(
            "لم يتم تحديد تخصصك في الملف الشخصي."
          );
        }

        // ---------------------------------------------
        // Semester
        // ---------------------------------------------

        const {
          data: semesterData,
          error: semesterError,
        } = await supabase
          .from("semesters")
          .select(`
            id,
            name,
            semester_number,
            level_id,
            levels!inner (
              specialty_id
            )
          `)
          .eq("id", semesterId)
          .maybeSingle();

        if (semesterError) {
          throw semesterError;
        }

        if (!semesterData) {
          throw new Error(
            "السداسي المطلوب غير موجود."
          );
        }

        const levelData =
          Array.isArray(semesterData.levels)
            ? semesterData.levels[0]
            : semesterData.levels;

        const semesterSpecialtyId =
          levelData?.specialty_id ?? null;

        if (!semesterSpecialtyId) {
          throw new Error(
            "تعذر تحديد تخصص هذا السداسي."
          );
        }

        const semesterInfo: SemesterInfo = {
          id: semesterData.id,
          name: semesterData.name,
          semester_number:
            semesterData.semester_number,
          level_id: semesterData.level_id,
          specialty_id:
            semesterSpecialtyId,
        };

        if (cancelled) {
          return;
        }

        setSemester(semesterInfo);

        // ---------------------------------------------
        // Validate Specialty
        // ---------------------------------------------

        if (
          profile.specialty_id !==
          semesterSpecialtyId
        ) {
          setSemesterValid(false);

          setMessage(
            "هذا السداسي لا ينتمي إلى تخصصك."
          );

          setMessageType("error");

          return;
        }

        setSemesterValid(true);
        setMessage(null);
        setMessageType(null);
      } catch (error) {
        console.error(
          "VALIDATE SEMESTER ERROR:",
          error
        );

        if (cancelled) {
          return;
        }

        setSemesterValid(false);

        setMessage(
          error instanceof Error
            ? error.message
            : "تعذر التحقق من السداسي."
        );

        setMessageType("error");
      } finally {
        if (!cancelled) {
          setCheckingSemester(false);
        }
      }
    }

    void validateSemester();

    return () => {
      cancelled = true;
    };
  }, [semesterId]);

  // ===================================================
  // Load Modules + Subjects
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function loadAcademicData() {
      if (!semesterId || !semesterValid) {
        setModules([]);
        setSubjects([]);
        return;
      }

      setLoadingAcademicData(true);

      try {
        // ---------------------------------------------
        // Modules of Semester
        // ---------------------------------------------

        const {
          data: modulesData,
          error: modulesError,
        } = await supabase
          .from("modules")
          .select(`
            id,
            name
          `)
          .eq("semester_id", semesterId)
          .order("name", {
            ascending: true,
          });

        if (modulesError) {
          throw modulesError;
        }

        const loadedModules =
          (modulesData ?? []) as AcademicModule[];

        if (cancelled) {
          return;
        }

        setModules(loadedModules);

        // ---------------------------------------------
        // Subjects of Modules
        // ---------------------------------------------

        if (!loadedModules.length) {
          setSubjects([]);
          return;
        }

        const moduleIds =
          loadedModules.map(
            (module) => module.id
          );

        const {
          data: subjectsData,
          error: subjectsError,
        } = await supabase
          .from("subjects")
          .select(`
            id,
            name,
            module_id
          `)
          .in("module_id", moduleIds)
          .order("name", {
            ascending: true,
          });

        if (subjectsError) {
          throw subjectsError;
        }

        if (cancelled) {
          return;
        }

        const loadedSubjects =
          (subjectsData ?? []) as AcademicSubject[];

        setSubjects(loadedSubjects);
      } catch (error) {
        console.error(
          "LOAD ACADEMIC DATA ERROR:",
          error
        );

        if (cancelled) {
          return;
        }

        setModules([]);
        setSubjects([]);

        setMessage(
          error instanceof Error
            ? error.message
            : "تعذر تحميل الوحدات والمقاييس."
        );

        setMessageType("error");
      } finally {
        if (!cancelled) {
          setLoadingAcademicData(false);
        }
      }
    }

    void loadAcademicData();

    return () => {
      cancelled = true;
    };
  }, [semesterId, semesterValid]);

  // ===================================================
  // Subject Selection
  // ===================================================

  function handleSubjectChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const selectedId =
      event.target.value;

    setSubjectId(selectedId);

    const selectedSubject =
      subjects.find(
        (subject) =>
          subject.id === selectedId
      );

    setSubjectName(
      selectedSubject?.name ?? ""
    );
  }

  // ===================================================
  // Images
  // ===================================================

  function handleImagesChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    if (!files.length) {
      return;
    }

    const validImages = files.filter(
      (file) =>
        file.type.startsWith("image/")
    );

    setImages((current) => [
      ...current,
      ...validImages,
    ]);

    event.target.value = "";
  }

  function removeImage(index: number) {
    setImages((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  }

  // ===================================================
  // PDF
  // ===================================================

  function handlePdfChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      setMessage(
        "يرجى اختيار ملف PDF فقط."
      );

      setMessageType("error");

      return;
    }

    setPdf(file);

    event.target.value = "";
  }

  function removePdf() {
    setPdf(null);
  }

  // ===================================================
  // Reset
  // ===================================================

  function resetForm() {
    setSubjectId("");
    setSubjectName("");
    setLessonTitle("");
    setTeacherName("");
    setAcademicYear("2025/2026");
    setContent("");
    setImages([]);
    setPdf(null);
    setAcademicType("lesson");
  }

  // ===================================================
  // Submit
  // ===================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage(null);
    setMessageType(null);

    // -----------------------------------------------
    // Semester
    // -----------------------------------------------

    if (!semesterId) {
      setMessage(
        "تعذر تحديد السداسي الحالي."
      );

      setMessageType("error");

      return;
    }

    if (checkingSemester) {
      setMessage(
        "جارٍ التحقق من السداسي، يرجى الانتظار."
      );

      setMessageType("error");

      return;
    }

    if (!semesterValid) {
      setMessage(
        "لا يمكنك النشر في هذا السداسي."
      );

      setMessageType("error");

      return;
    }

    // -----------------------------------------------
    // Clean Fields
    // -----------------------------------------------

    const cleanSubjectName =
      subjectName.trim();

    const cleanLessonTitle =
      lessonTitle.trim();

    const cleanTeacherName =
      teacherName.trim();

    const cleanContent =
      content.trim();

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (!subjectId) {
      setMessage(
        "اختر المقياس أولًا."
      );

      setMessageType("error");

      return;
    }

    if (!cleanSubjectName) {
      setMessage(
        "تعذر تحديد اسم المقياس."
      );

      setMessageType("error");

      return;
    }

    if (
      academicType === "lesson" &&
      !cleanLessonTitle
    ) {
      setMessage(
        "أدخل عنوان الدرس أولًا."
      );

      setMessageType("error");

      return;
    }

    if (!cleanTeacherName) {
      setMessage(
        "أدخل اسم الأستاذ أولًا."
      );

      setMessageType("error");

      return;
    }

    if (!academicYear) {
      setMessage(
        "اختر السنة الدراسية."
      );

      setMessageType("error");

      return;
    }

    if (!cleanContent) {
      setMessage(
        "اكتب محتوى المنشور أولًا."
      );

      setMessageType("error");

      return;
    }

    // -----------------------------------------------
    // Submit
    // -----------------------------------------------

    try {
      setLoading(true);

      await createPost({
        content: cleanContent,

        images,

        pdf,

        audienceType: "semester",

        academicType,

        subjectId,

        lessonTitle:
          academicType === "lesson"
            ? cleanLessonTitle
            : null,

        subjectName:
          cleanSubjectName,

        teacherName:
          cleanTeacherName,

        academicYear,

        semesterId,
      });

      resetForm();

      setMessage(
        "تم نشر المحتوى بنجاح 🎉"
      );

      setMessageType("success");
    } catch (error) {
      console.error(
        "ACADEMIC POST ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء نشر المنشور."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // Disabled
  // ===================================================

  const formDisabled =
    loading ||
    checkingSemester ||
    !semesterValid ||
    loadingAcademicData;

  // ===================================================
  // Render
  // ===================================================

  return (
    <section
      dir="rtl"
      className="
        overflow-hidden
        rounded-[28px]
        border border-slate-200
        bg-white
        shadow-[0_12px_40px_rgba(15,23,42,0.06)]
      "
    >
      {/* =================================================
          Header
      ================================================= */}

      <div
        className="
          relative
          overflow-hidden
          border-b border-slate-100
          bg-gradient-to-br
          from-indigo-50
          via-white
          to-violet-50
          px-5 py-6
          sm:px-7
        "
      >
        <div
          className="
            absolute
            -left-12
            -top-12
            h-32
            w-32
            rounded-full
            bg-indigo-200/30
            blur-2xl
          "
        />

        <div className="relative flex items-start gap-4">
          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-indigo-600
              text-white
              shadow-lg
              shadow-indigo-200
            "
          >
            <Sparkles size={25} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900">
              شارك شيئًا مفيدًا ✨
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              أضف المعلومات الأكاديمية ليظهر
              المحتوى بشكل منظم للطلاب.
            </p>

            {semester && (
              <div
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-indigo-100
                  bg-white/90
                  px-3.5
                  py-2
                  text-xs
                  font-bold
                  text-indigo-700
                  shadow-sm
                "
              >
                <GraduationCap size={15} />

                <span>
                  {semester.name}
                </span>

                {semester.semester_number !==
                  null && (
                  <>
                    <span className="text-slate-300">
                      •
                    </span>

                    <span>
                      السداسي{" "}
                      {semester.semester_number}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          Validation
      ================================================= */}

      {checkingSemester && (
        <div
          className="
            border-b
            border-blue-100
            bg-blue-50
            px-5
            py-3
            text-sm
            text-blue-700
            sm:px-7
          "
        >
          جارٍ التحقق من السداسي...
        </div>
      )}

      {!checkingSemester &&
        semester &&
        !semesterValid && (
          <div
            className="
              border-b
              border-red-100
              bg-red-50
              px-5
              py-4
              text-sm
              font-medium
              leading-6
              text-red-700
              sm:px-7
            "
          >
            <div className="flex gap-2">
              <span>⚠️</span>

              <span>
                {message ??
                  "هذا السداسي لا ينتمي إلى تخصصك."}
              </span>
            </div>
          </div>
        )}

      {/* =================================================
          Form
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-7 p-5 sm:p-7"
      >
        {/* =================================================
            Academic Information
        ================================================= */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-slate-50/60
            p-4
            sm:p-5
          "
        >
          <div className="mb-5 flex items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-100
                text-indigo-600
              "
            >
              <GraduationCap size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                المعلومات الأكاديمية
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                اختر المقياس من المقاييس الموجودة في
                هذا السداسي ثم أكمل معلومات المحتوى.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Subject */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                المقياس
              </label>

              <div className="relative">
                <BookOpen
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <select
                  value={subjectId}
                  onChange={handleSubjectChange}
                  disabled={
                    formDisabled ||
                    loadingAcademicData
                  }
                  className="
                    h-12
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-10
                    pr-11
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    transition
                    focus:border-indigo-400
                    focus:ring-4
                    focus:ring-indigo-100
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <option value="">
                    {loadingAcademicData
                      ? "جارٍ تحميل المقاييس..."
                      : subjects.length
                      ? "اختر المقياس"
                      : "لا توجد مقاييس لهذا السداسي"}
                  </option>

                  {modules.map((module) => {
                    const moduleSubjects =
                      subjects.filter(
                        (subject) =>
                          subject.module_id ===
                          module.id
                      );

                    if (!moduleSubjects.length) {
                      return null;
                    }

                    return (
                      <optgroup
                        key={module.id}
                        label={module.name}
                      >
                        {moduleSubjects.map(
                          (subject) => (
                            <option
                              key={subject.id}
                              value={subject.id}
                            >
                              {subject.name}
                            </option>
                          )
                        )}
                      </optgroup>
                    );
                  })}
                </select>

                <span
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  ▾
                </span>
              </div>
            </div>

            {/* Lesson Title */}

            {academicType === "lesson" && (
              <AcademicInput
                label="عنوان الدرس"
                icon={<FileText size={17} />}
                placeholder="مثال: مدخل إلى علم الأصوات"
                value={lessonTitle}
                onChange={setLessonTitle}
                disabled={formDisabled}
              />
            )}

            {/* Teacher */}

            <AcademicInput
              label="اسم الأستاذ"
              icon={<UserRound size={17} />}
              placeholder="مثال: د. أحمد محمد"
              value={teacherName}
              onChange={setTeacherName}
              disabled={formDisabled}
            />

            {/* Academic Year */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                السنة الدراسية
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <select
                  value={academicYear}
                  onChange={(event) =>
                    setAcademicYear(
                      event.target.value
                    )
                  }
                  disabled={formDisabled}
                  className="
                    h-12
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-10
                    pr-11
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    transition
                    focus:border-indigo-400
                    focus:ring-4
                    focus:ring-indigo-100
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {academicYears.map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>

                <span
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  ▾
                </span>
              </div>
            </div>

            {/* Semester */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                السداسي
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-indigo-100
                  bg-indigo-50/70
                  px-4
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-indigo-600
                    text-white
                  "
                >
                  <GraduationCap size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-indigo-800">
                    {semester?.name ??
                      "جارٍ التحقق..."}
                  </p>

                  {semester &&
                    semester.semester_number !==
                      null && (
                      <p className="text-[11px] text-indigo-500">
                        السداسي{" "}
                        {semester.semester_number}
                      </p>
                    )}
                </div>

                <Check
                  size={17}
                  className="mr-auto text-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            Post Type
        ================================================= */}

        <div>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              ماذا تريد أن تشارك؟
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              اختر نوع المحتوى الأكاديمي المناسب
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {postTypes.map((type) => {
              const selected =
                academicType === type.value;

              const Icon = type.icon;

              return (
                <button
                  key={type.value}
                  type="button"
                  disabled={formDisabled}
                  onClick={() =>
                    setAcademicType(
                      type.value
                    )
                  }
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-4
                    text-right
                    transition-all
                    duration-200
                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-500"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm"
                    }
                  `}
                >
                  {selected && (
                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-600
                        text-white
                      "
                    >
                      <Check size={12} />
                    </div>
                  )}

                  <div
                    className={`
                      mb-3
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        selected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    <Icon size={19} />
                  </div>

                  <div
                    className={`
                      text-sm
                      font-bold
                      ${
                        selected
                          ? "text-indigo-700"
                          : "text-slate-800"
                      }
                    `}
                  >
                    {type.label}
                  </div>

                  <div className="mt-1 text-[11px] leading-5 text-slate-400">
                    {type.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================
            Content
        ================================================= */}

        <div>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <label className="text-sm font-bold text-slate-900">
                ماذا تريد أن تشارك؟
              </label>

              <p className="mt-1 text-xs text-slate-400">
                اكتب المحتوى الذي تريد مشاركته
                مع زملائك.
              </p>
            </div>

            <span className="shrink-0 text-xs text-slate-400">
              {content.length} / 10000
            </span>
          </div>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
            disabled={formDisabled}
            rows={6}
            maxLength={10000}
            placeholder={
              academicType === "lesson"
                ? "اكتب الدرس أو المحاضرة أو أهم المعلومات التي تريد مشاركتها..."
                : academicType === "summary"
                ? "شارك ملخصك وأهم النقاط التي يمكن أن تساعد زملاءك..."
                : academicType === "exam"
                ? "اكتب وصفًا للامتحان أو المعلومات المهمة حوله..."
                : "اكتب موضوع البحث أو المناقشة الأكاديمية والأفكار التي تريد طرحها..."
            }
            className="
              min-h-[150px]
              w-full
              resize-y
              rounded-2xl
              border
              border-slate-200
              bg-slate-50/70
              px-4
              py-4
              text-sm
              leading-7
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-400
              focus:bg-white
              focus:ring-4
              focus:ring-indigo-100
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* =================================================
            Attachments
        ================================================= */}

        <div>
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-900">
              المرفقات
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              يمكنك إضافة صور أو ملف PDF.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={formDisabled}
              onClick={() =>
                imageInputRef.current?.click()
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:border-indigo-300
                hover:bg-indigo-50
                hover:text-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ImageIcon size={17} />
              إضافة صور
            </button>

            <button
              type="button"
              disabled={formDisabled}
              onClick={() =>
                pdfInputRef.current?.click()
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:border-red-300
                hover:bg-red-50
                hover:text-red-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Paperclip size={17} />
              إرفاق PDF
            </button>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImagesChange}
            />

            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={handlePdfChange}
            />
          </div>
        </div>

        {/* =================================================
            Image Preview
        ================================================= */}

        {images.length > 0 && (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                الصور المرفقة
              </span>

              <span className="text-xs text-slate-400">
                {images.length} صورة
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {images.map((image, index) => (
                <ImagePreview
                  key={`${image.name}-${image.size}-${index}`}
                  image={image}
                  index={index}
                  onRemove={removeImage}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            PDF
        ================================================= */}

        {pdf && (
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              rounded-2xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-100
                  text-red-600
                "
              >
                <FileText size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {pdf.name}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {(pdf.size / 1024 / 1024).toFixed(
                    2
                  )}{" "}
                  MB
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={removePdf}
              className="
                rounded-lg
                p-2
                text-red-500
                transition
                hover:bg-red-100
                disabled:opacity-50
              "
              aria-label="إزالة الملف"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* =================================================
            Footer
        ================================================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-slate-100
            pt-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
              "
            >
              <GraduationCap size={18} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">
                منشور أكاديمي
              </p>

              <p className="text-[11px] text-slate-400">
                سيظهر لطلاب هذا السداسي
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              formDisabled ||
              !content.trim() ||
              !subjectId ||
              !teacherName.trim() ||
              (academicType === "lesson" &&
                !lessonTitle.trim())
            }
            className="
              inline-flex
              min-w-[170px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-6
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              shadow-indigo-200
              transition
              hover:bg-indigo-700
              hover:shadow-md
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                />

                جارٍ النشر...
              </>
            ) : (
              <>
                نشر المحتوى
                <Send size={16} />
              </>
            )}
          </button>
        </div>

        {/* =================================================
            Message
        ================================================= */}

        {message && (
          <div
            className={`
              flex
              items-start
              gap-2
              rounded-xl
              px-4
              py-3
              text-sm
              leading-6

              ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }
            `}
          >
            {messageType === "success" ? (
              <Check
                size={18}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <span>⚠️</span>
            )}

            <span>{message}</span>
          </div>
        )}
      </form>
    </section>
  );
}

// =====================================================
// Academic Input
// =====================================================

function AcademicInput({
  label,
  icon,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>

      <div className="relative">
        <span
          className="
            pointer-events-none
            absolute
            right-3.5
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        >
          {icon}
        </span>

        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          placeholder={placeholder}
          className="
            h-12
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            pr-11
            text-sm
            text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-indigo-400
            focus:ring-4
            focus:ring-indigo-100
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>
    </div>
  );
}

// =====================================================
// Image Preview
// =====================================================

function ImagePreview({
  image,
  index,
  onRemove,
  disabled,
}: {
  image: File;
  index: number;
  onRemove: (index: number) => void;
  disabled?: boolean;
}) {
  const [previewUrl, setPreviewUrl] =
    useState("");

  useEffect(() => {
    const url =
      URL.createObjectURL(image);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
      "
    >
      {previewUrl && (
        <img
          src={previewUrl}
          alt={image.name}
          className="
            aspect-square
            w-full
            object-cover
          "
        />
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onRemove(index)
        }
        className="
          absolute
          left-1.5
          top-1.5
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          bg-slate-900/75
          text-white
          transition
          hover:bg-red-600
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        aria-label="إزالة الصورة"
      >
        <X size={14} />
      </button>
    </div>
  );
}