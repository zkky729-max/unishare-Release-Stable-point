
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
  X,
  type LucideIcon,
} from "lucide-react";

import {
  useAuth,
} from "../../features/auth/context/AuthContext";

import UniShareLogo from "../brand/UniShareLogo";

interface SidebarProps {
  onClose?: () => void;
}

interface NavigationLink {
  name: string;
  path: string;
  icon: LucideIcon;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();

  const {
    profile,
    signOut,
  } = useAuth();

  // =====================================================
  // USER INFORMATION
  // =====================================================

  const displayName =
    profile?.full_name?.trim() ||
    profile?.username?.trim() ||
    "مستخدم";

  const avatar =
    profile?.avatar_url?.trim() || null;

  const roleLabel =
    profile?.role === "elite_student"
      ? "طالب متميز"
      : "طالب";

  // =====================================================
  // LOGOUT
  // =====================================================

  async function handleSignOut() {
    try {
      await signOut();
      onClose?.();

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
  // NAVIGATION LINKS
  // =====================================================

  const links: NavigationLink[] = [
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
  // NAVIGATION ITEM
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
        onClick={onClose}
        className={({ isActive }) =>
          [
            "group relative",
            "flex items-center gap-3",
            "min-h-[54px]",
            "rounded-2xl px-3 py-2.5",
            "text-base font-semibold",
            "transition-all duration-200",
            "outline-none",
            "focus-visible:ring-4",
            "focus-visible:ring-blue-500/15",
            "[-webkit-tap-highlight-color:transparent]",
            isActive
              ? [
                  "text-white",
                  "bg-[var(--unishare-gradient)]",
                  "shadow-lg shadow-blue-500/20",
                ].join(" ")
              : [
                  "text-slate-600",
                  "hover:bg-blue-50",
                  "hover:text-blue-700",
                  "dark:text-slate-300",
                  "dark:hover:bg-slate-900",
                  "dark:hover:text-blue-400",
                ].join(" "),
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span
                className="
                  absolute right-0 top-3 bottom-3
                  w-1 rounded-l-full
                  bg-white/80
                "
              />
            )}

            <div
              className={[
                "flex h-10 w-10 shrink-0",
                "items-center justify-center",
                "rounded-xl",
                "transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white"
                  : [
                      "bg-slate-100 text-slate-600",
                      "group-hover:bg-blue-100",
                      "group-hover:text-blue-700",
                      "dark:bg-slate-800",
                      "dark:text-slate-300",
                      "dark:group-hover:bg-blue-950/50",
                    ].join(" "),
              ].join(" ")}
            >
              <Icon
                size={21}
                strokeWidth={isActive ? 2.4 : 2}
              />
            </div>

            <span className="min-w-0 flex-1">
              {name}
            </span>

            <ChevronLeft
              size={18}
              className={[
                "shrink-0 transition-all duration-200",
                isActive
                  ? "translate-x-0 opacity-100"
                  : [
                      "translate-x-1 opacity-0",
                      "group-hover:translate-x-0",
                      "group-hover:opacity-60",
                    ].join(" "),
              ].join(" ")}
            />
          </>
        )}
      </NavLink>
    );
  }

  // =====================================================
  // FACULTY NAVIGATION
  // =====================================================

  function renderFacultyLink() {
    if (!profile?.faculty_id) {
      return (
        <div
          className="
            rounded-2xl
            border border-dashed border-slate-200
            px-4 py-3
            text-sm font-medium
            text-slate-400
            dark:border-slate-700
            dark:text-slate-500
          "
        >
          لم يتم تحديد الكلية
        </div>
      );
    }

    return (
      <NavLink
        to={`/faculties/${profile.faculty_id}/specialties`}
        onClick={onClose}
        className={({ isActive }) =>
          [
            "group relative flex items-center gap-3",
            "min-h-[54px] rounded-2xl px-3 py-2.5",
            "text-base font-semibold",
            "transition-all duration-200",
            "focus-visible:ring-4 focus-visible:ring-blue-500/15",
            "[-webkit-tap-highlight-color:transparent]",
            isActive
              ? [
                  "text-white",
                  "bg-[var(--unishare-gradient)]",
                  "shadow-lg shadow-blue-500/20",
                ].join(" ")
              : [
                  "text-slate-600",
                  "hover:bg-blue-50",
                  "hover:text-blue-700",
                  "dark:text-slate-300",
                  "dark:hover:bg-slate-900",
                  "dark:hover:text-blue-400",
                ].join(" "),
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute right-0 top-3 bottom-3 w-1 rounded-l-full bg-white/80" />
            )}

            <div
              className={[
                "flex h-10 w-10 shrink-0",
                "items-center justify-center rounded-xl",
                isActive
                  ? "bg-white/15 text-white"
                  : [
                      "bg-slate-100 text-slate-600",
                      "group-hover:bg-blue-100",
                      "group-hover:text-blue-700",
                      "dark:bg-slate-800",
                      "dark:text-slate-300",
                    ].join(" "),
              ].join(" ")}
            >
              <GraduationCap
                size={21}
                strokeWidth={isActive ? 2.4 : 2}
              />
            </div>

            <span className="min-w-0 flex-1">
              كليتي
            </span>

            <ChevronLeft
              size={18}
              className={[
                "transition-all duration-200",
                isActive
                  ? "opacity-100"
                  : "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
              ].join(" ")}
            />
          </>
        )}
      </NavLink>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside
      dir="rtl"
      className="
        sticky top-0
        flex h-screen w-72 shrink-0
        flex-col
        border-l border-[var(--unishare-border)]
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      {/* BRAND */}

      <div
        className="
          relative overflow-hidden
          border-b border-[var(--unishare-border)]
          px-5 py-5
          dark:border-slate-800
        "
      >
        <div
          className="
            pointer-events-none absolute
            -left-10 -top-10
            h-28 w-28 rounded-full
            bg-blue-400/10 blur-2xl
          "
        />

        <div className="relative flex items-center justify-between gap-3">
          <UniShareLogo />

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
              lg:hidden
            "
          >
            <X size={21} />
          </button>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav
        aria-label="التنقل الرئيسي"
        className="
          flex-1 overflow-y-auto
          px-4 py-6
        "
      >
        <p
          className="
            mb-3 px-3
            text-sm font-bold
            tracking-wide
            text-[var(--unishare-muted)]
          "
        >
          القائمة الرئيسية
        </p>

        <div className="space-y-2">
          {renderNavItem(
            links[0].path,
            links[0].name,
            links[0].icon
          )}

          {renderNavItem(
            links[1].path,
            links[1].name,
            links[1].icon
          )}

          {renderFacultyLink()}
        </div>

        <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

        <p
          className="
            mb-3 px-3
            text-sm font-bold
            tracking-wide
            text-[var(--unishare-muted)]
          "
        >
          التواصل والمجتمع
        </p>

        <div className="space-y-2">
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

        <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

        <p
          className="
            mb-3 px-3
            text-sm font-bold
            tracking-wide
            text-[var(--unishare-muted)]
          "
        >
          حسابي
        </p>

        {renderNavItem(
          links[5].path,
          links[5].name,
          links[5].icon
        )}
      </nav>

      {/* USER CARD */}

      <div
        className="
          border-t border-[var(--unishare-border)]
          p-4
          dark:border-slate-800
        "
      >
        <div
          className="
            rounded-2xl
            border border-slate-100
            bg-[var(--unishare-background)]
            p-3
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <button
            type="button"
            onClick={() => {
              navigate("/profile");
              onClose?.();
            }}
            className="
              flex w-full items-center gap-3
              rounded-xl p-2
              text-right
              transition-all duration-200
              hover:bg-blue-50
              focus-visible:ring-2
              focus-visible:ring-blue-500/30
              dark:hover:bg-slate-800
            "
          >
            {/* AVATAR */}

            <div className="relative shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="
                    h-12 w-12 rounded-xl
                    border border-slate-100
                    object-cover
                    ring-2 ring-white
                    dark:border-slate-700
                    dark:ring-slate-800
                  "
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-xl
                    bg-blue-600
                    text-2xl font-bold
                    text-white
                    ring-2 ring-white
                    dark:ring-slate-800
                  "
                  aria-label="الصورة الشخصية الافتراضية"
                >
                  ?
                </div>
              )}

              <span
                className="
                  absolute bottom-0 left-0
                  h-3 w-3 rounded-full
                  bg-emerald-400
                  ring-2 ring-[var(--unishare-background)]
                "
              />
            </div>

            {/* USER INFO */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate text-base font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                {displayName}
              </p>

              <p
                className="
                  mt-1 truncate text-sm
                  text-[var(--unishare-muted)]
                "
              >
                {roleLabel}
              </p>
            </div>
          </button>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleSignOut}
            className="
              mt-3 flex w-full
              min-h-11 items-center justify-center gap-2
              rounded-xl
              border border-slate-200
              bg-white px-3 py-2.5
              text-base font-semibold
              text-slate-600
              transition-all duration-200
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              focus-visible:ring-4
              focus-visible:ring-red-500/10
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-slate-300
              dark:hover:border-red-900
              dark:hover:bg-red-950/30
              dark:hover:text-red-400
            "
          >
            <LogOut size={19} />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </aside>
  );
}
