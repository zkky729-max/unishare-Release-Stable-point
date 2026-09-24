import {
  LayoutDashboard,
  Users,
  History,
  Building2,
  GraduationCap,
  Layers3,
  BookOpen,
  Library,
  FileText,
  MessageSquare,
  Flag,
  Settings,
  ShieldCheck,
  X,
  ChevronLeft,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  {
    label: "لوحة التحكم",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "المستخدمون",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "سجل الأدوار",
    path: "/admin/role-history",
    icon: History,
  },
  {
    label: "الكليات",
    path: "/admin/faculties",
    icon: Building2,
  },
  {
    label: "الأقسام",
    path: "/admin/departments",
    icon: Layers3,
  },
  {
    label: "التخصصات",
    path: "/admin/specialties",
    icon: GraduationCap,
  },
  {
    label: "المستويات",
    path: "/admin/levels",
    icon: Layers3,
  },
  {
    label: "السداسيات",
    path: "/admin/semesters",
    icon: BookOpen,
  },
  {
    label: "الوحدات",
    path: "/admin/modules",
    icon: Library,
  },
  {
    label: "المقاييس",
    path: "/admin/subjects",
    icon: FileText,
  },
  {
    label: "المقررات",
    path: "/admin/courses",
    icon: BookOpen,
  },
  {
    label: "المراجعات",
    path: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    label: "البلاغات",
    path: "/admin/reports",
    icon: Flag,
  },
  {
    label: "الإعدادات",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  isOpen = true,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        dir="rtl"
        className={`fixed right-0 top-0 z-50 flex h-screen w-72 flex-col border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                UniShare
              </h2>
              <p className="text-xs text-slate-500">
                لوحة الإدارة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-blue-500"
                        }
                      />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      <ChevronLeft
                        size={16}
                        className={
                          isActive
                            ? "text-white/80"
                            : "text-slate-300 opacity-0 transition group-hover:opacity-100"
                        }
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <ShieldCheck size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  حساب المسؤول
                </p>
                <p className="text-xs text-slate-500">
                  صلاحيات الإدارة
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}