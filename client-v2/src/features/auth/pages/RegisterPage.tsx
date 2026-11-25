
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../../../auth/components/RegisterForm";
import { supabase } from "../../../lib/supabaseClient";

function GoogleLogo() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 48 48"
      aria-label="Google"
      role="img"
    >
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
      />
      <path
        fill="#EA4335"
        d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.5 18.7 11.9 24 11.9Z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  async function handleGoogleRegister() {
    setGoogleError("");
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
        setGoogleError(
          "تعذر إنشاء الحساب باستخدام Google. حاول مرة أخرى."
        );
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error(error);

      setGoogleError(
        "حدث خطأ أثناء الاتصال بحساب Google."
      );

      setGoogleLoading(false);
    }
  }

  return (
    <AuthLayout
      title="إنشاء حساب"
      subtitle="انضم إلى مجتمع UniShare وابدأ رحلتك في مشاركة المعرفة"
    >
      <RegisterForm />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-medium text-slate-500">
          أو
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {googleError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {googleError}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={googleLoading}
        className="
          flex w-full items-center justify-center gap-3
          rounded-xl border border-slate-200
          bg-white py-3.5
          font-semibold text-slate-700
          shadow-sm
          transition-all duration-200
          hover:border-slate-300 hover:bg-slate-50 hover:shadow-md
          active:scale-[0.99]
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {googleLoading ? (
          <Loader2
            size={20}
            className="animate-spin text-slate-500"
          />
        ) : (
          <GoogleLogo />
        )}

        <span>
          إنشاء حساب باستخدام Google
        </span>
      </button>

      <p className="mt-8 text-center text-sm text-slate-600">
        لديك حساب بالفعل؟

        <Link
          to="/login"
          className="mr-2 font-bold text-blue-600 transition hover:text-blue-700"
        >
          تسجيل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
}
