
import { useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";

import { supabase } from "../../../lib/supabaseClient";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setError("تعذر تسجيل الدخول باستخدام Google. حاول مرة أخرى.");
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الاتصال بحساب Google.");
      setGoogleLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0B1224]/80 py-4 pr-11 pl-4 text-sm text-white placeholder:text-slate-500 outline-none transition duration-300 focus:border-cyan-400/60 focus:bg-[#111B32] focus:ring-4 focus:ring-cyan-400/10";

  const iconClass =
    "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500";

  return (
    <AuthLayout
      title="مرحباً بعودتك"
      subtitle="واصل رحلتك في اكتشاف المعرفة ومشاركتها مع مجتمع UniShare"
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-200">
            البريد الإلكتروني
          </label>

          <div className="relative">
            <Mail size={19} className={iconClass} />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-slate-200">
              كلمة المرور
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-cyan-300 transition hover:text-white"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole size={19} className={iconClass} />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              required
              className={`${inputClass} pl-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-300"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3.5 text-sm leading-6 text-red-300">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="absolute inset-0 translate-x-full bg-gradient-to-l from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-[-100%]" />

          {loading ? (
            <>
              <Loader2 size={19} className="animate-spin" />
              جاري تسجيل الدخول...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              تسجيل الدخول إلى UniShare
              <ArrowLeft size={17} />
            </>
          )}
        </button>
      </form>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />

        <span className="text-xs text-slate-500">أو تابع باستخدام</span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] py-3.5 font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10 disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <span className="text-xl font-bold text-cyan-300">G</span>
        )}

        المتابعة باستخدام Google
      </button>

      <p className="mt-8 text-center text-sm text-slate-400">
        ليس لديك حساب بعد؟

        <Link
          to="/register"
          className="mr-2 font-bold text-cyan-300 transition hover:text-white"
        >
          انضم إلى UniShare
        </Link>
      </p>
    </AuthLayout>
  );
}
