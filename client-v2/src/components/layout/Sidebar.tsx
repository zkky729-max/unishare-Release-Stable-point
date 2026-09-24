import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  User,
  LogOut,
  ChevronLeft,
  MessageCircle,
  Users,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import {
  useAuth,
} from "../../features/auth/context/AuthContext";

import UniShareLogo from "../brand/UniShareLogo";

export default function Sidebar() {
  const navigate = useNavigate();

  const {
    profile,
    signOut,
  } = useAuth();

  // =====================================================
  // User
  // =====================================================

  const displayName =
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    "مستخدم";

  const avatar =
    profile?.avatar_url?.trim() ||
    "/avatars/default.png";

  // =====================================================
  // Role Label
  // =====================================================

  const roleLabel =
    profile?.role === "elite_student"
      ? "طالب متميز ⭐"
      : profile?.role === "professor"
        ? "أستاذ 🎓"
        : profile?.role === "admin"
          ? "مدير النظام 🛡️"
          : "طالب";

  // =====================================================
  // Logout
  // =====================================================

  async function handleSignOut() {
    try {
      await signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Sidebar logout error:",
        error
      );
    }
  }

  // =====================================================
  // Navigation
  // =====================================================

  const links: {
    name: string;
    path: string;
    icon: LucideIcon;
  }[] = [
    {
      name: "الرئيسية",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "الجامعات",
      path: "/universities",
      icon: Building2,
    },
    {
      name: "الرسائل",
      path: "/messages",
      icon: MessageCircle,
    },
    {
      name: "الأصدقاء",
      path: "/friends",
      icon: Users,
    },
    {
      name: "البحث عن أشخاص",
      path: "/people",
      icon: UserPlus,
    },
    {
      name: "الملف الشخصي",
      path: "/profile",
      icon: User,
    },
  ];

  // =====================================================
  // Shared navigation item
  // =====================================================

  function renderNavItem(
    path: string,
    name: string,
    Icon: LucideIcon
  ) {
    return (
      <NavLink
        key={path}
        to={path}
        className={({ isActive }) =>
          [
            "group",
            "flex",
            "items-center",
            "gap-3",
            "rounded-xl",
            "px-4",
            "py-3",
            "text-sm",
            "font-medium",
            "transition-all",
            "duration-200",

            // إزالة تأثيرات المتصفح عند الضغط
            "outline-none",
            "focus:outline-none",
            "focus-visible:outline-none",
            "[-webkit-tap-highlight-color:transparent]",

            // =================================================
            // Active state
            // =================================================

            isActive
              ? [
                  "text-white",
                  "bg-[linear-gradient(135deg,#3b82f6_0%,#6366f1_55%,#06b6d4_100%)]",
                  "shadow-md",
                  "shadow-blue-500/20",
                ].join(" ")

              // =================================================
              // Normal state
              // =================================================

              : [
                  "text-slate-600",
                  "hover:bg-blue-50/70",
                  "hover:text-[var(--unishare-blue)]",

                  "dark:text-slate-300",
                  "dark:hover:bg-slate-900",
                  "dark:hover:text-blue-400",
                ].join(" "),
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            {/* =================================================
                Icon
            ================================================= */}

            <div
              className={[
                "flex",
                "h-9",
                "w-9",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-lg",
                "transition-colors",
                "duration-200",

                isActive
                  ? "bg-white/15"
                  : [
                      "bg-slate-100",
                      "group-hover:bg-blue-50",
                      "dark:bg-slate-800",
                      "dark:group-hover:bg-blue-950/40",
                    ].join(" "),
              ].join(" ")}
            >
              <Icon
                size={19}
                strokeWidth={
                  isActive ? 2.3 : 2
                }
              />
            </div>

            {/* =================================================
                Label
            ================================================= */}

            <span className="flex-1">
              {name}
            </span>

            {/* =================================================
                Arrow
            ================================================= */}

            <ChevronLeft
              size={16}
              className={[
                "transition-all",
                "duration-200",

                isActive
                  ? "opacity-100"
                  : [
                      "opacity-0",
                      "group-hover:-translate-x-1",
                      "group-hover:opacity-50",
                    ].join(" "),
              ].join(" ")}
            />
          </>
        )}
      </NavLink>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <aside
      dir="rtl"
      className="
        sticky
        top-0
        flex
        h-screen
        w-72
        shrink-0
        flex-col
        border-l
        border-[var(--unishare-border)]
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      {/* =====================================================
          Brand
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          border-b
          border-[var(--unishare-border)]
          px-6
          py-5
          dark:border-slate-800
        "
      >
        {/* Decorative glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-10
            -top-10
            h-24
            w-24
            rounded-full
            bg-blue-400/10
            blur-2xl
          "
        />

        <div className="relative flex items-center">
          <UniShareLogo />
        </div>
      </div>

      {/* =====================================================
          Navigation
      ===================================================== */}

      <nav
        aria-label="التنقل الرئيسي"
        className="
          flex-1
          overflow-y-auto
          px-4
          py-6
        "
      >
        {/* Section title */}

        <p
          className="
            mb-3
            px-3
            text-[11px]
            font-bold
            uppercase
            tracking-wider
            text-[var(--unishare-muted)]
          "
        >
          التنقل
        </p>

        <div className="space-y-1.5">

          {/* =================================================
              Dashboard
          ================================================= */}

          {renderNavItem(
            links[0].path,
            links[0].name,
            links[0].icon
          )}

          {/* =================================================
              Universities
          ================================================= */}

          {renderNavItem(
            links[1].path,
            links[1].name,
            links[1].icon
          )}

          {/* =================================================
              My Faculty
          ================================================= */}

          {profile?.faculty_id ? (
            <NavLink
              to={`/faculties/${profile.faculty_id}/specialties`}
              className={({ isActive }) =>
                [
                  "group",
                  "flex",
                  "items-center",
                  "gap-3",
                  "rounded-xl",
                  "px-4",
                  "py-3",
                  "text-sm",
                  "font-medium",
                  "transition-all",
                  "duration-200",

                  // منع تأثير الضغط الافتراضي
                  "outline-none",
                  "focus:outline-none",
                  "focus-visible:outline-none",
                  "[-webkit-tap-highlight-color:transparent]",

                  isActive
                    ? [
                        "text-white",
                        "bg-[linear-gradient(135deg,#3b82f6_0%,#6366f1_55%,#06b6d4_100%)]",
                        "shadow-md",
                        "shadow-blue-500/20",
                      ].join(" ")

                    : [
                        "text-slate-600",
                        "hover:bg-blue-50/70",
                        "hover:text-[var(--unishare-blue)]",

                        "dark:text-slate-300",
                        "dark:hover:bg-slate-900",
                        "dark:hover:text-blue-400",
                      ].join(" "),
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {/* Faculty icon */}

                  <div
                    className={[
                      "flex",
                      "h-9",
                      "w-9",
                      "shrink-0",
                      "items-center",
                      "justify-center",
                      "rounded-lg",
                      "transition-colors",
                      "duration-200",

                      isActive
                        ? "bg-white/15"
                        : [
                            "bg-slate-100",
                            "group-hover:bg-blue-50",
                            "dark:bg-slate-800",
                            "dark:group-hover:bg-blue-950/40",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <GraduationCap
                      size={19}
                      strokeWidth={
                        isActive ? 2.3 : 2
                      }
                    />
                  </div>

                  {/* Faculty label */}

                  <span className="flex-1">
                    كليتي
                  </span>

                  {/* Arrow */}

                  <ChevronLeft
                    size={16}
                    className={[
                      "transition-all",
                      "duration-200",

                      isActive
                        ? "opacity-100"
                        : [
                            "opacity-0",
                            "group-hover:-translate-x-1",
                            "group-hover:opacity-50",
                          ].join(" "),
                    ].join(" ")}
                  />
                </>
              )}
            </NavLink>
          ) : (
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-slate-200
                px-4
                py-3
                text-sm
                text-slate-400
                dark:border-slate-700
                dark:text-slate-500
              "
            >
              لم يتم تحديد الكلية
            </div>
          )}

          {/* =================================================
              Social
          ================================================= */}

          <div className="space-y-1.5 pt-2">

            {renderNavItem(
              links[2].path,
              links[2].name,
              links[2].icon
            )}

            {renderNavItem(
              links[3].path,
              links[3].name,
              links[3].icon
            )}

            {renderNavItem(
              links[4].path,
              links[4].name,
              links[4].icon
            )}

          </div>

          {/* =================================================
              Profile
          ================================================= */}

          <div className="pt-2">

            {renderNavItem(
              links[5].path,
              links[5].name,
              links[5].icon
            )}

          </div>

        </div>
      </nav>

      {/* =====================================================
          User Card
      ===================================================== */}

      <div
        className="
          border-t
          border-[var(--unishare-border)]
          p-4
          dark:border-slate-800
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-slate-100
            bg-[var(--unishare-background)]
            p-3
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          {/* User */}

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              p-2
              text-right
              outline-none
              transition-all
              duration-200
              hover:bg-blue-50
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500/20
              dark:hover:bg-slate-800
            "
          >
            {/* Avatar */}

            <div className="relative shrink-0">

              <img
                src={avatar}
                alt={displayName}
                onError={(event) => {
                  event.currentTarget.src =
                    "/avatars/default.png";
                }}
                className="
                  h-10
                  w-10
                  rounded-xl
                  object-cover
                  ring-2
                  ring-white
                  dark:ring-slate-800
                "
              />

              {/* Online indicator */}

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-emerald-400
                  ring-2
                  ring-[var(--unishare-background)]
                "
              />

            </div>

            {/* User info */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {displayName}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                  text-[var(--unishare-muted)]
                "
              >
                {roleLabel}
              </p>
            </div>
          </button>

          {/* =================================================
              Logout
          ================================================= */}

          <button
            type="button"
            onClick={handleSignOut}
            className="
              mt-3
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              font-medium
              text-slate-600
              outline-none
              transition-all
              duration-200
              focus:outline-none
              focus-visible:outline-none
              active:outline-none
              [-webkit-tap-highlight-color:transparent]

              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600

              dark:border-slate-700
              dark:bg-slate-950
              dark:text-slate-300
              dark:hover:border-red-900
              dark:hover:bg-red-950/30
              dark:hover:text-red-400
            "
          >
            <LogOut size={17} />

            تسجيل الخروج
          </button>
        </div>
      </div>
    </aside>
  );
}