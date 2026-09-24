import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import type {
  AdminUser,
  UserRole,
} from "../types/admin";

import { updateUserRole } from "../api/updateUserRole";


interface Props {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}


const roles: {
  value: UserRole;
  label: string;
}[] = [
  {
    value: "student",
    label: "طالب",
  },
  {
    value: "elite_student",
    label: "طالب متميز",
  },
  {
    value: "professor",
    label: "أستاذ",
  },
  {
    value: "admin",
    label: "مدير",
  },
];


export default function ChangeRoleDialog({
  open,
  user,
  onClose,
  onSuccess,
}: Props) {

  const [role, setRole] =
    useState<UserRole>("student");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  /*
   * عند فتح الحوار:
   * نضع الدور الحالي للمستخدم
   * داخل select
   */
  useEffect(() => {

    if (open && user) {
      setRole(user.role);
      setError(null);
    }

  }, [open, user]);


  if (!open || !user) {
    return null;
  }


  const handleUpdate = async () => {

    /*
     * لا حاجة لإرسال الطلب
     * إذا لم يتغير الدور
     */
    if (role === user.role) {
      return;
    }


    try {

      setLoading(true);
      setError(null);


      /*
       * updateUserRole تستقبل object واحد:
       *
       * {
       *   userId,
       *   newRole
       * }
       */
      await updateUserRole({
        userId: user.user_id,
        newRole: role,
      });


      await onSuccess();

    } catch (err: any) {

      console.error(
        "UPDATE USER ROLE ERROR:",
        err
      );


      setError(
        err?.message ||
          "تعذر تحديث دور المستخدم."
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
                bg-green-50
                text-green-700
              "
            >
              <ShieldCheck size={21} />
            </div>


            <div>

              <h2
                className="
                  text-lg
                  font-black
                  text-slate-950
                "
              >
                تغيير دور المستخدم
              </h2>


              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                إدارة صلاحيات المستخدم
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

          {/* User Information */}
          <div
            className="
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
              الدور الحالي:{" "}
              {roles.find(
                (item) =>
                  item.value === user.role
              )?.label ?? user.role}
            </p>

          </div>


          {/* Role Select */}
          <div className="mt-5">

            <label
              htmlFor="user-role"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-slate-700
              "
            >
              الدور الجديد
            </label>


            <select
              id="user-role"
              value={role}
              onChange={(event) => {

                setRole(
                  event.target.value as UserRole
                );

                setError(null);

              }}
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                font-medium
                text-slate-800
                outline-none
                transition
                focus:border-green-500
                focus:ring-4
                focus:ring-green-500/10
                disabled:cursor-not-allowed
                disabled:bg-slate-100
              "
            >

              {roles.map((item) => (

                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>

              ))}

            </select>

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
              onClick={handleUpdate}
              disabled={
                loading ||
                role === user.role
              }
              className="
                inline-flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-green-700
                px-4
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-green-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  جاري التحديث...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />

                  حفظ الدور
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}