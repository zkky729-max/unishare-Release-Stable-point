import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Layers3,
  UserRound,
} from "lucide-react";

import type {
  AcademicPostType,
} from "../types/post";

// =====================================================
// Props
// =====================================================

interface AcademicPostInfoProps {
  subjectName?: string | null;
  teacherName?: string | null;
  academicYear?: string | null;
  semesterName?: string | null;
  moduleName?: string | null;
  academicType?: AcademicPostType | null;
}

// =====================================================
// Academic Type Configuration
// =====================================================

const academicTypeConfig: Record<
  AcademicPostType,
  {
    label: string;
    icon: string;
  }
> = {
  lesson: {
    label: "درس",
    icon: "📚",
  },

  summary: {
    label: "ملخص",
    icon: "📝",
  },

  exam: {
    label: "امتحان",
    icon: "📄",
  },

  research_discussion: {
    label: "بحوث ومناقشات",
    icon: "💬",
  },
};

// =====================================================
// Info Item
// =====================================================

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconClassName: string;
}

function InfoItem({
  icon,
  label,
  value,
  iconClassName,
}: InfoItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${iconClassName}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-medium
            text-gray-400
          "
        >
          {label}
        </p>

        <p
          title={value}
          className="
            mt-0.5
            truncate
            text-xs
            font-bold
            text-gray-800
            sm:text-[13px]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// Component
// =====================================================

export default function AcademicPostInfo({
  subjectName,
  teacherName,
  academicYear,
  semesterName,
  moduleName,
  academicType,
}: AcademicPostInfoProps) {
  const hasAcademicInfo = Boolean(
    subjectName ||
      teacherName ||
      academicYear ||
      semesterName ||
      moduleName ||
      academicType
  );

  if (!hasAcademicInfo) {
    return null;
  }

  const typeConfig = academicType
    ? academicTypeConfig[academicType]
    : null;

  return (
    <section
      dir="rtl"
      className="
        overflow-hidden
        rounded-2xl
        border
        border-indigo-100
        bg-gradient-to-br
        from-indigo-50/70
        via-white
        to-violet-50/50
      "
    >
      {/* ===========================================
          Header
      =========================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-indigo-100/70
          bg-white/50
          px-3.5
          py-2.5
        "
      >
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              bg-indigo-100
              text-indigo-600
            "
          >
            <GraduationCap size={17} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-800">
              معلومات أكاديمية
            </p>

            <p className="hidden text-[10px] text-gray-400 sm:block">
              تفاصيل المحتوى الدراسي
            </p>
          </div>
        </div>

        {typeConfig && (
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              bg-indigo-600
              px-2.5
              py-1.5
              text-[11px]
              font-bold
              text-white
              shadow-sm
            "
          >
            <span>
              {typeConfig.icon}
            </span>

            <span>
              {typeConfig.label}
            </span>
          </div>
        )}
      </div>

      {/* ===========================================
          Information
      =========================================== */}

      <div className="p-3.5">
        <div
          className="
            grid
            grid-cols-2
            gap-x-4
            gap-y-4
            sm:grid-cols-3
          "
        >
          {subjectName && (
            <InfoItem
              icon={<BookOpen size={15} />}
              label="المقياس"
              value={subjectName}
              iconClassName="
                bg-blue-50
                text-blue-600
              "
            />
          )}

          {teacherName && (
            <InfoItem
              icon={<UserRound size={15} />}
              label="الأستاذ"
              value={teacherName}
              iconClassName="
                bg-emerald-50
                text-emerald-600
              "
            />
          )}

          {academicYear && (
            <InfoItem
              icon={<CalendarDays size={15} />}
              label="السنة الدراسية"
              value={academicYear}
              iconClassName="
                bg-amber-50
                text-amber-600
              "
            />
          )}

          {semesterName && (
            <InfoItem
              icon={<GraduationCap size={15} />}
              label="السداسي"
              value={semesterName}
              iconClassName="
                bg-violet-50
                text-violet-600
              "
            />
          )}

          {moduleName && (
            <InfoItem
              icon={<Layers3 size={15} />}
              label="الوحدة"
              value={moduleName}
              iconClassName="
                bg-cyan-50
                text-cyan-600
              "
            />
          )}
        </div>
      </div>
    </section>
  );
}