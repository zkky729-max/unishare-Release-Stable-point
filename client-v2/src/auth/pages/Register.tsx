
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";

import RegisterForm from "../../auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="إنشاء حساب"
      subtitle="انضم إلى مجتمع UniShare وابدأ رحلتك في مشاركة المعرفة"
    >
      <RegisterForm />

      <div className="mt-8 text-center text-sm text-slate-400">
        لديك حساب بالفعل؟

        <Link
          to="/login"
          className="mr-2 font-bold text-cyan-300 transition hover:text-white"
        >
          تسجيل الدخول
        </Link>
      </div>
    </AuthLayout>
  );
}
