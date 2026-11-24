
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  UserRound,
  CalendarDays,
  BookOpen,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight,
  UserPlus,
} from "lucide-react";

import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../auth/context/AuthContext";

interface University {
  id: string;
  name: string;
}

interface Faculty {
  id: string;
  name: string;
}

interface Specialty {
  id: string;
  name: string;
}

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { reloadProfile } = useAuth();

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");

  const [universities, setUniversities] = useState<University[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const [universityId, setUniversityId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        setUserId(user.id);
        setFullName(user.user_metadata?.full_name ?? "");

        const { data, error } = await supabase
          .from("universities")
          .select("id,name")
          .order("name");

        if (error) throw error;

        setUniversities(data ?? []);
      } catch (error) {
        console.error("UNIVERSITIES ERROR:", error);
        alert("تعذر تحميل قائمة الجامعات");
      } finally {
        setLoadingUniversities(false);
      }
    }

    void init();
  }, [navigate]);

  async function loadFaculties(id: string) {
    setUniversityId(id);
    setFacultyId("");
    setSpecialtyId("");
    setFaculties([]);
    setSpecialties([]);

    if (!id) return;

    try {
      setLoadingFaculties(true);

      const { data, error } = await supabase
        .from("faculties")
        .select("id,name")
        .eq("university_id", id)
        .order("name");

      if (error) throw error;

      setFaculties(data ?? []);

      if (!data?.length) {
        alert("لا توجد كليات مسجلة لهذه الجامعة حالياً");
      }
    } catch (error) {
      console.error("FACULTIES ERROR:", error);
      alert("تعذر تحميل كليات الجامعة");
    } finally {
      setLoadingFaculties(false);
    }
  }

  async function loadSpecialties(id: string) {
    setFacultyId(id);
    setSpecialtyId("");
    setSpecialties([]);

    if (!id) return;

    try {
      setLoadingSpecialties(true);

      const { data, error } = await supabase
        .from("specialties")
        .select("id,name")
        .eq("faculty_id", id)
        .order("name");

      if (error) throw error;

      setSpecialties(data ?? []);

      if (!data?.length) {
        alert("لا توجد تخصصات مسجلة لهذه الكلية حالياً");
      }
    } catch (error) {
      console.error("SPECIALTIES ERROR:", error);
      alert("تعذر تحميل التخصصات");
    } finally {
      setLoadingSpecialties(false);
    }
  }

  async function saveProfile() {
    const cleanUsername = username.trim();
    const numericAge = Number(age);

    if (
      !cleanUsername ||
      !age ||
      !universityId ||
      !facultyId ||
      !specialtyId ||
      !Number.isFinite(numericAge) ||
      numericAge <= 0 ||
      numericAge > 120
    ) {
      alert("يرجى إكمال جميع المعلومات بشكل صحيح");
      return;
    }

    if (!userId) {
      alert("لم يتم التعرف على المستخدم، يرجى تسجيل الدخول مجدداً");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            full_name: fullName,
            username: cleanUsername,
            age: numericAge,
            university_id: universityId,
            faculty_id: facultyId,
            specialty_id: specialtyId,
            role: "student",
          },
          {
            onConflict: "user_id",
          }
        );

      if (error) throw error;

      await reloadProfile();

      const {
        data: savedProfile,
        error: verifyError,
      } = await supabase
        .from("profiles")
        .select(
          "username,age,university_id,faculty_id,specialty_id"
        )
        .eq("user_id", userId)
        .single();

      if (verifyError) throw verifyError;

      const profileComplete =
        !!savedProfile?.username?.trim() &&
        !!savedProfile?.age &&
        !!savedProfile?.university_id &&
        !!savedProfile?.faculty_id &&
        !!savedProfile?.specialty_id;

      if (!profileComplete) {
        throw new Error(
          "تم الحفظ لكن بعض المعلومات المطلوبة ما زالت ناقصة"
        );
      }

      alert("تم حفظ الملف الشخصي بنجاح ✅");

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      console.error("PROFILE ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "فشل حفظ الملف الشخصي"
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `
    w-full rounded-xl border border-slate-200
    bg-slate-50 px-4 py-3.5 text-sm
    text-slate-800 outline-none transition-all
    placeholder:text-slate-400
    focus:border-blue-500 focus:bg-white
    focus:ring-4 focus:ring-blue-500/10
    disabled:cursor-not-allowed disabled:opacity-60
    dark:border-slate-700 dark:bg-slate-800
    dark:text-white dark:focus:bg-slate-800
  `;

  const labelClass = `
    mb-2.5 block text-sm font-semibold
    text-slate-700 dark:text-slate-200
  `;

  const cardClass = `
    rounded-3xl border border-slate-200
    bg-white p-5 shadow-sm
    dark:border-slate-800 dark:bg-slate-900
    sm:p-7
  `;

  return (
    <div
      dir="rtl"
      className="
        min-h-screen bg-slate-50 px-4 py-8
        dark:bg-slate-950 sm:px-6 sm:py-12
      "
    >
      <div className="mx-auto max-w-3xl space-y-7">

        {/* Welcome Header */}

        <section className="
          relative overflow-hidden rounded-3xl
          bg-gradient-to-l from-blue-700
          via-indigo-600 to-violet-600
          p-7 text-white shadow-xl
          shadow-blue-900/10 sm:p-10
        ">
          <div className="
            absolute -left-16 -top-16
            h-56 w-56 rounded-full
            bg-white/10 blur-2xl
          " />

          <div className="
            absolute -bottom-20 right-1/3
            h-56 w-56 rounded-full
            bg-cyan-300/10 blur-3xl
          " />

          <div className="relative z-10">
            <div className="
              mb-6 flex h-14 w-14 items-center
              justify-center rounded-2xl
              border border-white/20 bg-white/15
              shadow-lg backdrop-blur
            ">
              <GraduationCap size={30} />
            </div>

            <div className="
              mb-3 inline-flex items-center gap-2
              rounded-full border border-white/20
              bg-white/10 px-3 py-1.5 text-xs
              font-semibold text-blue-50
            ">
              <Sparkles size={14} />
              مرحباً بك في UniShare
            </div>

            <h1 className="
              text-3xl font-extrabold leading-tight
              sm:text-4xl
            ">
              لنبدأ رحلتك الجامعية!
            </h1>

            <p className="
              mt-3 max-w-xl text-sm leading-7
              text-blue-100 sm:text-base
            ">
              أكمل معلوماتك الشخصية والأكاديمية
              لتصبح جزءاً من مجتمع UniShare،
              وتواصل مع الطلبة الذين يشاركونك
              نفس الجامعة والتخصص.
            </p>

            <div className="
              mt-7 flex flex-wrap items-center gap-4
              text-xs font-medium text-blue-100
            ">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                ملفك الشخصي
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                مجتمعك الجامعي
              </span>
            </div>
          </div>
        </section>

        {/* Progress Steps */}

        <div className="
          grid grid-cols-3 gap-2
          rounded-2xl border border-slate-200
          bg-white p-4 shadow-sm
          dark:border-slate-800 dark:bg-slate-900
        ">
          {[
            { number: "01", label: "المعلومات الشخصية" },
            { number: "02", label: "الجامعة والكلية" },
            { number: "03", label: "التخصص" },
          ].map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="
                flex h-9 w-9 items-center justify-center
                rounded-full bg-blue-50 text-xs
                font-extrabold text-blue-700
                dark:bg-blue-950/50 dark:text-blue-400
              ">
                {step.number}
              </div>
              <span className="
                text-[10px] font-semibold text-slate-500
                dark:text-slate-400 sm:text-xs
              ">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Personal Information */}

        <section className={cardClass}>
          <div className="
            mb-7 flex items-center gap-3
            border-b border-slate-100 pb-5
            dark:border-slate-800
          ">
            <div className="
              flex h-12 w-12 shrink-0 items-center
              justify-center rounded-2xl
              bg-blue-50 text-blue-600
              dark:bg-blue-950/50 dark:text-blue-400
            ">
              <UserRound size={23} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                المعلومات الشخصية
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                كيف سيتعرف عليك الآخرون؟
              </p>
            </div>
          </div>

          {fullName && (
            <div className="
              mb-5 rounded-xl border border-blue-100
              bg-blue-50/70 px-4 py-3
              dark:border-blue-900/50 dark:bg-blue-950/20
            ">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                الاسم المرتبط بحسابك
              </p>
              <p className="mt-1 font-bold text-slate-800 dark:text-white">
                {fullName}
              </p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                اسم المستخدم
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثلاً: ahmed_student"
                className={inputClass}
                autoComplete="username"
                dir="auto"
              />
              <p className="mt-2 text-xs text-slate-400">
                الاسم الذي سيظهر للآخرين على المنصة
              </p>
            </div>

            <div>
              <label className={labelClass}>
                العمر
              </label>
              <div className="relative">
                <CalendarDays
                  size={18}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2 text-slate-400
                  "
                />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="أدخل عمرك"
                  className={`${inputClass} pr-11`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Academic Information */}

        <section className={cardClass}>
          <div className="
            mb-7 flex items-center gap-3
            border-b border-slate-100 pb-5
            dark:border-slate-800
          ">
            <div className="
              flex h-12 w-12 shrink-0 items-center
              justify-center rounded-2xl
              bg-indigo-50 text-indigo-600
              dark:bg-indigo-950/50 dark:text-indigo-400
            ">
              <GraduationCap size={25} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                معلوماتك الأكاديمية
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                حدد موقعك داخل المجتمع الجامعي
              </p>
            </div>
          </div>

          <div className="
            mb-6 flex items-start gap-3
            rounded-2xl border border-indigo-100
            bg-indigo-50/60 p-4
            dark:border-indigo-900/40
            dark:bg-indigo-950/20
          ">
            <BookOpen
              size={20}
              className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
            />
            <p className="
              text-xs leading-6 text-slate-600
              dark:text-slate-300 sm:text-sm
            ">
              اختر جامعتك أولاً، ثم الكلية التابعة لها،
              وبعد ذلك تخصصك. ستُعرض لك الخيارات
              المرتبطة بكل اختيار.
            </p>
          </div>

          <div className="space-y-5">

            {/* University */}

            <div>
              <label className={labelClass}>
                الجامعة
              </label>

              <div className="relative">
                <Building2
                  size={19}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2 text-blue-500
                  "
                />

                <select
                  value={universityId}
                  onChange={(e) => loadFaculties(e.target.value)}
                  disabled={loadingUniversities || loading}
                  className={`${inputClass} pr-12`}
                >
                  <option value="">
                    {loadingUniversities
                      ? "جارٍ تحميل الجامعات..."
                      : "اختر جامعتك"}
                  </option>

                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>

                {loadingUniversities && (
                  <Loader2
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2 animate-spin
                      text-blue-500
                    "
                  />
                )}
              </div>

              <p className="mt-2 text-xs text-slate-400">
                الجامعة التي تدرس فيها حالياً
              </p>
            </div>

            {/* Faculty */}

            <div>
              <label className={labelClass}>
                الكلية
              </label>

              <div className="relative">
                <GraduationCap
                  size={19}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2 text-indigo-500
                  "
                />

                <select
                  value={facultyId}
                  onChange={(e) => loadSpecialties(e.target.value)}
                  disabled={!universityId || loadingFaculties || loading}
                  className={`${inputClass} pr-12`}
                >
                  <option value="">
                    {!universityId
                      ? "اختر الجامعة أولاً"
                      : loadingFaculties
                        ? "جارٍ تحميل الكليات..."
                        : "اختر كليتك"}
                  </option>

                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>

                {loadingFaculties && (
                  <Loader2
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2 animate-spin
                      text-blue-500
                    "
                  />
                )}
              </div>
            </div>

            {/* Specialty */}

            <div>
              <label className={labelClass}>
                التخصص
              </label>

              <div className="relative">
                <BookOpen
                  size={19}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2 text-violet-500
                  "
                />

                <select
                  value={specialtyId}
                  onChange={(e) => setSpecialtyId(e.target.value)}
                  disabled={!facultyId || loadingSpecialties || loading}
                  className={`${inputClass} pr-12`}
                >
                  <option value="">
                    {!facultyId
                      ? "اختر الكلية أولاً"
                      : loadingSpecialties
                        ? "جارٍ تحميل التخصصات..."
                        : "اختر تخصصك"}
                  </option>

                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>

                {loadingSpecialties && (
                  <Loader2
                    size={17}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2 animate-spin
                      text-blue-500
                    "
                  />
                )}
              </div>
            </div>
          </div>

          {/* Selection Summary */}

          {universityId && facultyId && specialtyId && (
            <div className="
              mt-6 rounded-2xl border border-emerald-200
              bg-emerald-50 p-4
              dark:border-emerald-900/50
              dark:bg-emerald-950/20
            ">
              <div className="
                mb-3 flex items-center gap-2
                text-sm font-bold text-emerald-700
                dark:text-emerald-400
              ">
                <CheckCircle2 size={19} />
                اكتملت معلوماتك الأكاديمية
              </div>

              <div className="
                space-y-2 text-xs text-slate-600
                dark:text-slate-300
              ">
                <p>
                  الجامعة:{" "}
                  {universities.find((item) => item.id === universityId)?.name}
                </p>
                <p>
                  الكلية:{" "}
                  {faculties.find((item) => item.id === facultyId)?.name}
                </p>
                <p>
                  التخصص:{" "}
                  {specialties.find((item) => item.id === specialtyId)?.name}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Submit */}

        <section className="
          rounded-3xl border border-slate-200
          bg-white p-5 shadow-sm
          dark:border-slate-800 dark:bg-slate-900
          sm:p-7
        ">
          <div className="
            mb-5 flex items-start gap-3
          ">
            <div className="
              flex h-11 w-11 shrink-0 items-center
              justify-center rounded-xl
              bg-emerald-50 text-emerald-600
              dark:bg-emerald-950/40 dark:text-emerald-400
            ">
              <UserPlus size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                أنت على بُعد خطوة واحدة!
              </h2>
              <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                احفظ معلوماتك للانضمام إلى مجتمعك الجامعي
                والبدء في استكشاف UniShare.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={saveProfile}
            disabled={
              loading ||
              loadingUniversities ||
              loadingFaculties ||
              loadingSpecialties
            }
            className="
              flex w-full items-center justify-center
              gap-3 rounded-2xl
              bg-gradient-to-l from-blue-600
              to-indigo-600 px-6 py-4
              text-sm font-bold text-white
              shadow-lg shadow-blue-600/20
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-xl hover:shadow-blue-600/25
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
            "
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                جارٍ حفظ معلوماتك...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                حفظ الملف الشخصي والمتابعة
                <ArrowRight size={18} className="rotate-180" />
              </>
            )}
          </button>

          <p className="
            mt-4 text-center text-xs
            text-slate-400
          ">
            معلوماتك الأكاديمية تساعدنا على ربطك
            بالمجتمع الجامعي المناسب.
          </p>
        </section>

        {/* Footer */}

        <div className="
          pb-4 text-center text-xs
          text-slate-400
        ">
          UniShare — مجتمع جامعي يجمعنا
        </div>
      </div>
    </div>
  );
}
