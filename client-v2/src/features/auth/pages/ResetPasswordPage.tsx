import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: {
          session,
        },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (session) {
        setReady(true);
        return;
      }

      setError(
        "رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية."
      );
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError(
        "يرجى إدخال كلمة المرور الجديدة وتأكيدها."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "كلمتا المرور غير متطابقتين."
      );
      return;
    }

    setLoading(true);

    const {
      error: updateError,
    } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      navigate("/login", {
        replace: true,
      });
    }, 2000);
  }

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-50
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          p-8
          shadow-xl
          border
          border-slate-100
        "
      >
        <div className="text-center mb-8">
          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            إعادة تعيين كلمة المرور
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            أدخل كلمة المرور الجديدة لحسابك
          </p>
        </div>

        {success ? (
          <div
            className="
              rounded-xl
              bg-green-50
              border
              border-green-200
              p-4
              text-center
              text-green-700
              text-sm
              font-medium
            "
          >
            تم تغيير كلمة المرور بنجاح.
            <br />
            سيتم تحويلك إلى صفحة تسجيل الدخول...
          </div>
        ) : !ready ? (
          <div className="text-center">
            {error ? (
              <>
                <div
                  className="
                    rounded-xl
                    bg-red-50
                    border
                    border-red-200
                    p-4
                    text-sm
                    text-red-700
                  "
                >
                  {error}
                </div>

                <Link
                  to="/forgot-password"
                  className="
                    mt-5
                    inline-block
                    text-sm
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  طلب رابط جديد
                </Link>
              </>
            ) : (
              <p className="text-slate-500">
                جاري التحقق من الرابط...
              </p>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                كلمة المرور الجديدة
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="أدخل كلمة المرور الجديدة"
                autoComplete="new-password"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                تأكيد كلمة المرور
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="أعد إدخال كلمة المرور"
                autoComplete="new-password"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {error && (
              <div
                className="
                  rounded-xl
                  bg-red-50
                  border
                  border-red-200
                  p-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-blue-600
                px-4
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? "جاري تغيير كلمة المرور..."
                : "تغيير كلمة المرور"}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}