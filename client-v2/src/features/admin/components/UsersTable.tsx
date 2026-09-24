import type { AdminUser } from "../types/admin";

import UserRoleBadge from "./UserRoleBadge";

interface Props {
  users: AdminUser[];

  onChangeRole: (
    user: AdminUser
  ) => void;

  onDelete: (
    user: AdminUser
  ) => void;
}

export default function UsersTable({
  users,
  onChangeRole,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="w-full text-right">

        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">

            <th className="px-4 py-4 text-sm font-bold text-slate-700">
              المستخدم
            </th>

            <th className="px-4 py-4 text-sm font-bold text-slate-700">
              الدور
            </th>

            <th className="px-4 py-4 text-sm font-bold text-slate-700">
              الكلية
            </th>

            <th className="px-4 py-4 text-sm font-bold text-slate-700">
              التخصص
            </th>

            <th className="px-4 py-4 text-sm font-bold text-slate-700">
              الإجراءات
            </th>

          </tr>
        </thead>

        <tbody>

          {users.length === 0 ? (

            <tr>
              <td
                colSpan={5}
                className="px-4 py-10 text-center text-sm text-slate-500"
              >
                لا يوجد مستخدمون مطابقون للبحث.
              </td>
            </tr>

          ) : (

            users.map((user) => (

              <tr
                key={user.user_id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >

                {/* User */}
                <td className="px-4 py-4">

                  <div>

                    <p className="font-bold text-slate-900">
                      {user.full_name || "بدون اسم"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {user.email ||
                        user.username ||
                        "-"}
                    </p>

                  </div>

                </td>


                {/* Role */}
                <td className="px-4 py-4">

                  <UserRoleBadge
                    role={user.role}
                  />

                </td>


                {/* Faculty */}
                <td className="px-4 py-4 text-sm text-slate-600">
                  {user.faculty?.name || "-"}
                </td>


                {/* Specialty */}
                <td className="px-4 py-4 text-sm text-slate-600">
                  {user.specialty?.name || "-"}
                </td>


                {/* Actions */}
                <td className="px-4 py-4">

                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        onChangeRole(user)
                      }
                      className="
                        rounded-lg
                        bg-blue-600
                        px-3
                        py-2
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      تغيير الدور
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        onDelete(user)
                      }
                      className="
                        rounded-lg
                        bg-red-600
                        px-3
                        py-2
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-red-700
                      "
                    >
                      حذف
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}