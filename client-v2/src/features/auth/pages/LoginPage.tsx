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

function GoogleLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="21"
      height="21"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8l6.8-5.2Z"
      />
      <path
        fill="#EA4335"
        d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.2c1.6-4.8 6.1-8.2 11.4-8.2Z"
      />
    </svg>
  );
}

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
    "w-full rounded-xl border border-slate-200 bg-white py-4 pr-11 pl-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const iconClass =
    "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <AuthLayout
      title="مرحباً بعودتك"
      subtitle="واصل رحلتك في اكتشاف المعرفة ومشاركتها مع مجتمع UniShare"
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
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
            <label className="text-sm font-semibold text-slate-700">
              كلمة المرور
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-blue-600 transition hover:text-blue-800"
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
              aria-label={
                showPassword
                  ? "إخفاء كلمة المرور"
                  : "إظهار كلمة المرور"
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-600"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm leading-6 text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs text-slate-400">
          أو تابع باستخدام
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 size={20} className="animate-spin text-slate-500" />
        ) : (
          <GoogleLogo />
        )}

        المتابعة باستخدام Google
      </button>

      <p className="mt-8 text-center text-sm text-slate-500">
        ليس لديك حساب بعد؟

        <Link
          to="/register"
          className="mr-2 font-bold text-blue-600 transition hover:text-blue-800"
        >
          انضم إلى UniShare
        </Link>
      </p>
    </AuthLayout>
  );
}