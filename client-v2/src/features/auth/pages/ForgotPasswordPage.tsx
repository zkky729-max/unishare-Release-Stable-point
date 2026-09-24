import { useState } from "react";
import {
  Mail,
  Loader2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import { supabase } from "../../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  async function handleResetPassword(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    const {
      error,
    } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      setError(
        "تعذر إرسال رابط استرجاع كلمة المرور. تأكد من البريد الإلكتروني وحاول مرة أخرى."
      );

      setLoading(false);

      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <AuthLayout
      title="استرجاع كلمة المرور"
      subtitle="أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور"
    >
      {
        success ? (
          <div className="space-y-6">
            <div
              className="
                flex
                flex-col
                items-center
                text-center
                gap-4
                rounded-2xl
                bg-green-50
                p-6
              "
            >
              <CheckCircle
                size={48}
                className="text-green-600"
              />

              <div>
                <h3
                  className="
                    text-lg
                    font-bold
                    text-green-700
                  "
                >
                  تم إرسال الرابط
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-green-700
                  "
                >
                  إذا كان البريد الإلكتروني مسجلًا
                  في UniShare، ستصلك رسالة تحتوي
                  على رابط لإعادة تعيين كلمة المرور.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-3
                font-semibold
                transition
              "
            >
              <ArrowRight size={20} />

              العودة إلى تسجيل الدخول
            </button>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-2
                  "
                >
                  البريد الإلكتروني
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="
                      absolute
                      left-3
                      top-3.5
                      text-gray-400
                    "
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="example@email.com"
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      py-3
                      pl-10
                      pr-4
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />
                </div>
              </div>

              {/* Error */}

              {
                error && (
                  <div
                    className="
                      rounded-lg
                      bg-red-50
                      text-red-600
                      p-3
                      text-sm
                    "
                  >
                    {error}
                  </div>
                )
              }

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex
                  justify-center
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  py-3
                  font-semibold
                  transition
                  disabled:opacity-50
                "
              >
                {
                  loading
                    ?
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      جاري إرسال الرابط...
                    </>
                    :
                    "إرسال رابط الاسترجاع"
                }
              </button>
            </form>

            <p
              className="
                text-center
                text-sm
                text-gray-500
                mt-6
              "
            >
              تذكرت كلمة المرور؟

              <Link
                to="/login"
                className="
                  text-blue-600
                  font-semibold
                  ml-2
                "
              >
                تسجيل الدخول
              </Link>
            </p>
          </>
        )
      }
    </AuthLayout>
  );
}