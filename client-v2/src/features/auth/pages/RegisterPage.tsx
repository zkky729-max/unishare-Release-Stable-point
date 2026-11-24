
import { useState } from "react";

import { Link } from "react-router-dom";

import { Loader2 } from "lucide-react";

import AuthLayout from "../components/AuthLayout";

import RegisterForm from "../../../auth/components/RegisterForm";

import { supabase } from "../../../lib/supabaseClient";

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
        <div className="h-px flex-1 bg-white/10" />

        <span className="text-xs text-slate-500">أو</span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      {googleError && (
        <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-3 text-sm text-red-300">
          {googleError}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={googleLoading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] py-3.5 font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10 disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <span className="text-xl font-bold text-cyan-300">G</span>
        )}

        إنشاء حساب باستخدام Google
      </button>

      <p className="mt-8 text-center text-sm text-slate-400">
        لديك حساب بالفعل؟

        <Link
          to="/login"
          className="mr-2 font-bold text-cyan-300 transition hover:text-white"
        >
          تسجيل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
}
