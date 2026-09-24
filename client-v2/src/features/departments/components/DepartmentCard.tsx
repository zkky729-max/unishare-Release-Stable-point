import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import type { Department } from "../types";

interface DepartmentCardProps {
  department: Department;
  specialtiesCount?: number;
  onClick?: () => void;
}

export default function DepartmentCard({
  department,
  specialtiesCount = 0,
  onClick,
}: DepartmentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-right"
    >
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-125" />

        <div className="relative">
          {/* Icon */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg">
              <GraduationCap size={28} strokeWidth={2} />
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
              <ArrowLeft size={20} />
            </div>
          </div>

          {/* Department name */}
          <h3 className="mb-3 text-xl font-bold text-slate-900">
            {department.name}
          </h3>

          {/* Description */}
          {department.description && (
            <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500">
              {department.description}
            </p>
          )}

          {/* Specialties count */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpen
              size={17}
              className="text-indigo-500"
            />

            <span>
              {specialtiesCount}{" "}
              {specialtiesCount === 1
                ? "تخصص"
                : "تخصصات"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}