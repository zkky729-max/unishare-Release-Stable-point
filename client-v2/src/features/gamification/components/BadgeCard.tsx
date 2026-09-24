import type { GamificationBadge } from "../types/gamification";

interface BadgeCardProps {
  badge: GamificationBadge;
  unlocked: boolean;
}

const rarityStyles = {
  common: {
    label: "شائع",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  rare: {
    label: "نادر",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  epic: {
    label: "ملحمي",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  legendary: {
    label: "أسطوري",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};

export default function BadgeCard({
  badge,
  unlocked,
}: BadgeCardProps) {
  const rarity = rarityStyles[badge.rarity];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-200",
        unlocked
          ? "border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          : "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-950",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl",
            unlocked
              ? "bg-blue-50 dark:bg-blue-950"
              : "bg-gray-100 grayscale dark:bg-gray-800",
          ].join(" ")}
        >
          {badge.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">
              {badge.name}
            </h3>

            {unlocked && (
              <span className="shrink-0 text-sm text-emerald-600">
                ✓
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {badge.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-medium",
                rarity.className,
              ].join(" ")}
            >
              {rarity.label}
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              💎 {badge.gem_reward ?? 0}
            </span>
          </div>
        </div>
      </div>

      {!unlocked && (
        <div className="mt-4 border-t pt-3 text-xs text-gray-400 dark:border-gray-800">
          لم تُفتح بعد
        </div>
      )}
    </div>
  );
}