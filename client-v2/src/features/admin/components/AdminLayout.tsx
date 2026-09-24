import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  GraduationCap,
  Building2,
  Settings,
  FileText,
  ChevronLeft,
  Menu,
  X,
  History,
  BookOpen,
  Layers,
  Layers3,
  ClipboardList,
  MessageSquare,
  Flag,
} from "lucide-react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import { useState } from "react";

// =====================================================
// Navigation Type
// =====================================================

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ElementType;
  end?: boolean;
}

// =====================================================
// Admin Navigation
// =====================================================

const navigation: NavigationItem[] = [
  {
    label: "الرئيسية",
    icon: LayoutDashboard,
    path: "/admin",
    end: true,
  },

  {
    label: "المستخدمون",
    icon: Users,
    path: "/admin/users",
  },

  {
    label: "الأدوار والصلاحيات",
    icon: ShieldCheck,
    path: "/admin/roles",
  },

  {
    label: "سجل الأدوار",
    icon: History,
    path: "/admin/role-history",
  },

  // =====================================================
  // POSTS
  // =====================================================

  {
    label: "المنشورات",
    icon: MessageSquare,
    path: "/admin/posts",
  },

  // =====================================================
  // ACADEMIC STRUCTURE
  // =====================================================

  {
    label: "الجامعات",
    icon: Building2,
    path: "/admin/universities",
  },

  {
    label: "الكليات",
    icon: GraduationCap,
    path: "/admin/faculties",
  },

  {
    label: "الأقسام",
    icon: Layers3,
    path: "/admin/departments",
  },

  {
    label: "السنوات",
    icon: Layers,
    path: "/admin/levels",
  },

  {
    label: "التخصصات",
    icon: BookOpen,
    path: "/admin/specialties",
  },

  {
    label: "السداسيات",
    icon: ClipboardList,
    path: "/admin/semesters",
  },

  {
    label: "الوحدات",
    icon: BookOpen,
    path: "/admin/modules",
  },

  {
    label: "المقاييس",
    icon: GraduationCap,
    path: "/admin/subjects",
  },

  {
    label: "الدروس",
    icon: FileText,
    path: "/admin/lessons",
  },

  // =====================================================
  // OTHER ADMIN SECTIONS
  // =====================================================

  {
    label: "المراجعات",
    icon: MessageSquare,
    path: "/admin/reviews",
  },

  {
    label: "التقارير",
    icon: Flag,
    path: "/admin/reports",
  },

  {
    label: "الإعدادات",
    icon: Settings,
    path: "/admin/settings",
  },
];

// =====================================================
// Admin Layout
// =====================================================

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      {/* =================================================
          Mobile Overlay
      ================================================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =================================================
          Sidebar
      ================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          right-0
          z-50
          flex
          w-72
          flex-col
          border-l
          border-slate-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* =================================================
            Sidebar Header
        ================================================= */}

        <div
          className="
            flex
            h-20
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
          "
        >
          <div className="flex items-center gap-3">
            {/* Logo */}

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-green-700
                text-white
                shadow-lg
                shadow-green-700/20
              "
            >
              <ShieldCheck size={23} />
            </div>

            {/* Brand */}

            <div>
              <h1
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                UniShare
              </h1>

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                لوحة الإدارة
              </p>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            Navigation
        ================================================= */}

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            p-4
          "
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  font-bold
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-green-700
                        text-white
                        shadow-lg
                        shadow-green-700/20
                      `
                      : `
                        text-slate-600
                        hover:bg-green-50
                        hover:text-green-700
                      `
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={19} />

                    <span className="flex-1">
                      {item.label}
                    </span>

                    <ChevronLeft
                      size={16}
                      className={
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =================================================
            Sidebar Footer
        ================================================= */}

        <div
          className="
            shrink-0
            border-t
            border-slate-100
            p-4
          "
        >
          <div
            className="
              rounded-2xl
              bg-slate-50
              p-4
            "
          >
            <p
              className="
                text-xs
                font-bold
                text-slate-400
              "
            >
              UniShare Admin
            </p>

            <p
              className="
                mt-1
                text-sm
                font-black
                text-slate-800
              "
            >
              نظام التحكم المركزي
            </p>
          </div>
        </div>
      </aside>

      {/* =================================================
          Main Application
      ================================================= */}

      <div className="min-h-screen lg:pr-72">
        {/* =================================================
            Topbar
        ================================================= */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-20
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white/90
            px-5
            backdrop-blur-xl
            lg:px-8
          "
        >
          {/* Mobile Menu */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="فتح القائمة"
            className="
              rounded-xl
              border
              border-slate-200
              p-2.5
              text-slate-600
              transition
              hover:bg-slate-50
              lg:hidden
            "
          >
            <Menu size={21} />
          </button>

          {/* Desktop Page Identity */}

          <div className="hidden lg:block">
            <p
              className="
                text-xs
                font-semibold
                text-slate-400
              "
            >
              UniShare / Administration
            </p>

            <h2
              className="
                mt-1
                text-lg
                font-black
                text-slate-900
              "
            >
              مركز التحكم
            </h2>
          </div>

          {/* Administrator */}

          <div className="flex items-center gap-3">
            <div className="hidden text-left sm:block">
              <p
                className="
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                Administrator
              </p>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                مدير المنصة
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-green-100
                font-black
                text-green-700
              "
            >
              A
            </div>
          </div>
        </header>

        {/* =================================================
            Page Content
        ================================================= */}

        <main
          className="
            p-5
            lg:p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}