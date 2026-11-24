
import { useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  UserRound,
  Mail,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }, [password]);

  const strengthText = [
    "غير محددة",
    "ضعيفة",
    "متوسطة",
    "جيدة",
    "قوية",
  ];

  const strengthColor = [
    "bg-slate-600",
    "bg-red-500",
    "bg-amber-400",
    "bg-blue-400",
    "bg-emerald-400",
  ];

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0B1224]/80 py-3.5 pr-11 pl-4 text-sm text-white placeholder:text-slate-500 outline-none transition duration-300 focus:border-cyan-400/60 focus:bg-[#111B32] focus:ring-4 focus:ring-cyan-400/10";

  const iconClass =
    "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("يرجى إدخال الاسم الكامل.");
      return;
    }

    if (password.length < 8) {
      setError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    if (!acceptTerms) {
      setError("يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error("تعذر إنشاء الحساب. يرجى المحاولة مجدداً.");
      }

      setRegisteredEmail(cleanEmail);
      setSuccess(true);

      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "";

      if (
        message.toLowerCase().includes("already registered") ||
        message.toLowerCase().includes("already been registered") ||
        message.toLowerCase().includes("user already exists")
      ) {
        setError("هذا البريد الإلكتروني مسجل بالفعل. حاول تسجيل الدخول.");
      } else if (message.toLowerCase().includes("password")) {
        setError("كلمة المرور غير مقبولة. تحقق من شروطها.");
      } else if (message.toLowerCase().includes("email")) {
        setError("البريد الإلكتروني غير صالح أو لا يمكن استخدامه.");
      } else {
        setError(message || "حدث خطأ أثناء إنشاء الحساب.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="py-5 text-center">
        <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/10 blur-xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 size={42} />
          </div>
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-semibold text-emerald-300">
          <Sparkles size={14} />
          تم إرسال طلب التسجيل
        </div>

        <h3 className="mt-4 text-2xl font-black text-white">
          خطوة واحدة تفصلك عن UniShare
        </h3>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-8 text-slate-400">
          أرسلنا إليك رسالة تأكيد. افتح بريدك الإلكتروني واضغط
          على رابط التأكيد لتفعيل حسابك.
        </p>

        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-400/[0.07] p-4 text-right">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-cyan-300">
            <Mail size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-400">
              رسالة التأكيد مرسلة إلى
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-white">
              {registeredEmail}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-right">
          <p className="text-sm font-semibold text-slate-200">
            ماذا بعد؟
          </p>
          <ol className="mt-3 space-y-3 text-xs leading-6 text-slate-400">
            <li>01 — افتح صندوق الوارد في بريدك.</li>
            <li>02 — اضغط رابط تأكيد البريد الإلكتروني.</li>
            <li>03 — ارجع إلى UniShare وسجل الدخول.</li>
          </ol>
        </div>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] py-3.5 text-sm font-bold text-white transition hover:border-cyan-400/30 hover:bg-white/10"
        >
          العودة إلى نموذج التسجيل
          <ArrowRight size={17} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* الاسم الكامل */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          الاسم الكامل
        </label>

        <div className="relative">
          <UserRound size={19} className={iconClass} />

          <input
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className={inputClass}
          />
        </div>
      </div>

      {/* البريد الإلكتروني */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          البريد الإلكتروني
        </label>

        <div className="relative">
          <Mail size={19} className={iconClass} />

          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* كلمة المرور */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          كلمة المرور
        </label>

        <div className="relative">
          <LockKeyhole size={19} className={iconClass} />

          <input
            required
            minLength={8}
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أنشئ كلمة مرور قوية"
            className={`${inputClass} pl-12`}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-300"
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        {/* مؤشر القوة */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              قوة كلمة المرور
            </span>

            <span className="font-semibold text-slate-300">
              {password ? strengthText[passwordStrength] : "أدخل كلمة المرور"}
            </span>
          </div>

          <div className="flex gap-1.5" dir="ltr">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  passwordStrength >= level
                    ? strengthColor[passwordStrength]
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            استخدم 8 أحرف على الأقل مع أرقام وأحرف ورموز لزيادة الحماية.
          </p>
        </div>
      </div>

      {/* تأكيد كلمة المرور */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200">
          تأكيد كلمة المرور
        </label>

        <div className="relative">
          <LockKeyhole size={19} className={iconClass} />

          <input
            required
            autoComplete="new-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أعد إدخال كلمة المرور"
            className={`${inputClass} pl-12 ${
              confirmPassword && password !== confirmPassword
                ? "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/10"
                : ""
            }`}
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={
              showConfirm
                ? "إخفاء تأكيد كلمة المرور"
                : "إظهار تأكيد كلمة المرور"
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-300"
          >
            {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        {confirmPassword && password !== confirmPassword && (
          <p className="mt-2 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle size={14} />
            كلمتا المرور غير متطابقتين.
          </p>
        )}

        {confirmPassword && password === confirmPassword && (
          <p className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 size={14} />
            كلمتا المرور متطابقتان.
          </p>
        )}
      </div>

      {/* الشروط */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:border-blue-400/20">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-500"
        />

        <span className="text-xs leading-6 text-slate-400">
          أوافق على شروط الاستخدام وسياسة الخصوصية الخاصة بمنصة UniShare.
        </span>
      </label>

      {/* رسالة الخطأ */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3.5 text-sm leading-6 text-red-300">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* زر التسجيل */}
      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 translate-x-full bg-gradient-to-l from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-[-100%]" />

        {loading ? (
          <>
            <Loader2 size={19} className="animate-spin" />
            جارٍ إنشاء حسابك...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            إنشاء حساب والانضمام إلى UniShare
          </>
        )}
      </button>

      <p className="text-center text-[11px] leading-6 text-slate-500">
        بانضمامك إلى UniShare، تصبح جزءاً من مجتمع جامعي يتشارك المعرفة.
      </p>
    </form>
  );
}
