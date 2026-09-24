import { useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import type { AdminUser } from "../types/admin";
import { deleteUser } from "../api/deleteUser";


interface Props {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}


export default function DeleteUserDialog({
  open,
  user,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  if (!open || !user) {
    return null;
  }


  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteUser(user.user_id);

      await onSuccess();
    } catch (err: any) {
      console.error(
        "DELETE USER DIALOG ERROR:",
        err
      );

      setError(
        err?.message ||
          "تعذر حذف المستخدم. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      dir="rtl"
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >

      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >

        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-6
            py-5
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-red-50
                text-red-600
              "
            >
              <Trash2 size={21} />
            </div>


            <div>

              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                حذف المستخدم
              </h2>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                إجراء إداري
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>

        </div>


        {/* Content */}

        <div className="p-6">

          {/* Warning */}

          <div
            className="
              rounded-2xl
              border
              border-red-100
              bg-red-50
              p-4
            "
          >

            <div className="flex gap-3">

              <AlertTriangle
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-red-600
                "
              />

              <div>

                <p
                  className="
                    font-bold
                    text-red-800
                  "
                >
                  هل أنت متأكد من حذف هذا المستخدم؟
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-red-700
                  "
                >
                  سيتم حذف سجل المستخدم من المنصة.
                  هذا الإجراء لا يمكن التراجع عنه.
                </p>

              </div>

            </div>

          </div>


          {/* User */}

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
            "
          >

            <p
              className="
                font-black
                text-slate-900
              "
            >
              {user.full_name || "بدون اسم"}
            </p>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {user.email ||
                user.username ||
                "بدون معلومات اتصال"}
            </p>


            <p
              className="
                mt-2
                text-xs
                font-bold
                text-slate-400
              "
            >
              الدور: {user.role}
            </p>

          </div>


          {/* Error */}

          {error && (
            <div
              className="
                mt-4
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                font-medium
                leading-6
                text-red-700
              "
            >
              {error}
            </div>
          )}


          {/* Actions */}

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-slate-700
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              إلغاء
            </button>


            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="
                inline-flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-600
                px-4
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 size={18} />

                  حذف المستخدم
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}