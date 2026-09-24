interface GemsCardProps {
  gems: number;
}

export default function GemsCard({
  gems,
}: GemsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            جواهرك
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {gems.toLocaleString("ar-DZ")}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gems
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl dark:bg-blue-950">
          💎
        </div>
      </div>
    </div>
  );
}