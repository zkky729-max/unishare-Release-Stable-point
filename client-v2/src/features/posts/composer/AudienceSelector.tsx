import {
  Globe2,
  Building2,
  BookOpen,
  GraduationCap,
  BookMarked,
} from "lucide-react";

import type { AudienceType } from "../types/post";

interface AudienceSelectorProps {
  value: AudienceType;

  onChange: (
    value: AudienceType
  ) => void;
}

const audienceOptions: {
  value: AudienceType;
  label: string;
  icon: typeof Globe2;
}[] = [
  {
    value: "public",
    label: "الجميع",
    icon: Globe2,
  },
  {
    value: "faculty",
    label: "الكلية",
    icon: Building2,
  },
  {
    value: "specialty",
    label: "التخصص",
    icon: BookOpen,
  },
  {
    value: "level",
    label: "المستوى",
    icon: GraduationCap,
  },
  {
    value: "module",
    label: "المقياس",
    icon: BookMarked,
  },
];

export default function AudienceSelector({
  value,
  onChange,
}: AudienceSelectorProps) {
  return (
    <div className="space-y-3">
      {/* =================================================
          Label
      ================================================= */}

      <label className="block text-sm font-bold text-slate-800">
        من يستطيع رؤية المنشور؟
      </label>

      {/* =================================================
          Options
      ================================================= */}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {audienceOptions.map((option) => {
          const Icon = option.icon;

          const active =
            value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(option.value)
              }
              className={`
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-3
                py-3
                text-sm
                font-semibold
                transition-all
                duration-200
                ${
                  active
                    ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-100 hover:bg-slate-50 hover:text-blue-600"
                }
              `}
            >
              <Icon
                size={17}
                strokeWidth={2}
              />

              <span>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}