
import { useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";

import {
  supabase,
} from "../../../lib/supabaseClient";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        if (
          error.message.includes("rate limit")
        ) {
          setError(
            "تم تجاوز عدد محاولات التسجيل. انتظر قليلاً ثم حاول مرة أخرى."
          );
        } else {
          setError(error.message);
        }

        return;
      }

      if (data.user && data.session) {
        localStorage.setItem(
          "new_user_id",
          data.user.id
        );

        navigate("/complete-profile");
      } else if (data.user) {
        setError(
          "تم إنشاء الحساب. يرجى تأكيد البريد الإلكتروني ثم تسجيل الدخول."
        );
      } else {
        setError("تعذر إنشاء الحساب");
      }

    } catch (err) {
      console.error(err);

      setError("حدث خطأ غير متوقع");

    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
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
        setError(
          "تعذر إنشاء الحساب باستخدام Google. حاول مرة أخرى."
        );

        setGoogleLoading(false);
      }

    } catch (err) {
      console.error(err);

      setError(
        "حدث خطأ أثناء الاتصال بحساب Google"
      );

      setGoogleLoading(false);
    }
  }

  return (
    <AuthLayout
      title="إنشاء حساب"
      subtitle="أنشئ حسابك في UniShare"
    >
      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >
        {/* Full name */}

        <div>
          <label className="block mb-2">
            الاسم الكامل
          </label>

          <div className="relative">
            <User
              size={20}
              className="
                absolute
                left-3
                top-3
                text-gray-400
              "
            />

            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="
                w-full
                border
                rounded-xl
                p-3
                pl-10
              "
            />
          </div>
        </div>

        {/* Email */}

        <div>
          <label className="block mb-2">
            البريد الإلكتروني
          </label>

          <div className="relative">
            <Mail
              size={20}
              className="
                absolute
                left-3
                top-3
                text-gray-400
              "
            />

            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="
                w-full
                border
                rounded-xl
                p-3
                pl-10
              "
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="block mb-2">
            كلمة المرور
          </label>

          <div className="relative">
            <Lock
              size={20}
              className="
                absolute
                left-3
                top-3
                text-gray-400
              "
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="
                w-full
                border
                rounded-xl
                p-3
                pl-10
                pr-12
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="
                absolute
                right-3
                top-3
              "
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm password */}

        <div>
          <label className="block mb-2">
            تأكيد كلمة المرور
          </label>

          <div className="relative">
            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              required
              value={confirmPassword}
              onChange={e =>
                setConfirmPassword(e.target.value)
              }
              className="
                w-full
                border
                rounded-xl
                p-3
                pr-12
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
              className="
                absolute
                right-3
                top-3
              "
            >
              {showConfirm ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div
            className="
              bg-red-50
              text-red-600
              rounded-xl
              p-3
              text-sm
            "
          >
            {error}
          </div>
        )}

        {/* Register Button */}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-xl
            font-bold
            flex
            justify-center
            items-center
            gap-2
            disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              جاري إنشاء الحساب...
            </>
          ) : (
            "إنشاء حساب"
          )}
        </button>
      </form>

      {/* Separator */}

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 border-t border-gray-200" />

        <span className="text-sm text-gray-400">
          أو
        </span>

        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Google Register */}

      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={loading || googleLoading}
        className="
          w-full
          flex
          justify-center
          items-center
          gap-3
          rounded-xl
          border
          border-gray-300
          bg-white
          hover:bg-gray-50
          text-gray-700
          py-3
          font-semibold
          transition
          disabled:opacity-50
        "
      >
        {googleLoading ? (
          <Loader2
            size={20}
            className="animate-spin"
          />
        ) : (
          <span className="text-xl font-bold text-blue-500">
            G
          </span>
        )}

        إنشاء حساب باستخدام Google
      </button>

      <p className="text-center mt-6">
        لديك حساب؟

        <Link
          to="/login"
          className="
            text-blue-600
            font-bold
            ml-2
          "
        >
          تسجيل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
}
