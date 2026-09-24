import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { AdminUser } from "../types/admin";

interface Props {
  user: AdminUser;
  onChangeRole: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export default function UserActions({
  user,
  onChangeRole,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onChangeRole(user)}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-green-200
          bg-green-50
          px-3
          py-2
          text-xs
          font-bold
          text-green-700
          transition
          hover:border-green-300
          hover:bg-green-100
        "
      >
        <Pencil size={15} />
        تغيير الدور
      </button>

      <button
        type="button"
        onClick={() => onDelete(user)}
        className="
          inline-flex
          items-center
          justify-center
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-2
          text-red-600
          transition
          hover:border-red-300
          hover:bg-red-100
        "
        title="حذف المستخدم"
        aria-label={`حذف ${user.full_name ?? "المستخدم"}`}
      >
        <Trash2 size={16} />
      </button>

      <button
        type="button"
        disabled
        className="
          inline-flex
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-2
          text-slate-300
          opacity-70
        "
        title="المزيد"
        aria-label="المزيد من الإجراءات"
      >
        <MoreHorizontal size={17} />
      </button>
    </div>
  );
}