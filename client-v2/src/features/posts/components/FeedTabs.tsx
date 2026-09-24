import type { FeedFilter } from "../types/feed";

interface Props {
  activeTab: FeedFilter;
  onChange: (value: FeedFilter) => void;
}

const tabs: {
  label: string;
  value: FeedFilter;
}[] = [
  {
    label: "الكل",
    value: "all",
  },
  {
    label: "الكلية",
    value: "faculty",
  },
  {
    label: "التخصص",
    value: "specialty",
  },
];

export default function FeedTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div
      dir="rtl"
      className="flex flex-wrap gap-2"
    >
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`
              rounded-xl
              border
              px-4
              py-2
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}