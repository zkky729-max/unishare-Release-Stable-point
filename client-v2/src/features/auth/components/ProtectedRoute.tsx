import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import type { UserRole } from "../../../types/roles";

import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  roles?: UserRole[];
}

export default function ProtectedRoute({
  roles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const {
    user,
    profile,
    loading,
  } = useAuth();

  // =====================================================
  // انتظار تحميل حالة المصادقة
  // =====================================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-50
          text-slate-600
        "
      >
        جاري التحميل...
      </div>
    );
  }

  // =====================================================
  // غير مسجل الدخول
  // =====================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // لا يوجد Profile
  // =====================================================

  if (!profile) {
    return (
      <Navigate
        to="/complete-profile"
        replace
      />
    );
  }

  // =====================================================
  // التحقق من الصلاحيات
  // =====================================================

  if (
    roles &&
    roles.length > 0 &&
    !roles.includes(profile.role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // =====================================================
  // السماح بالدخول
  // =====================================================

  return <Outlet />;
}