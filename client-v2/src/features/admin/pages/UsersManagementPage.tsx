import { useState } from "react";

import { useUsers } from "../hooks/useUsers";

import type { AdminUser } from "../types/admin";

import UsersTable from "../components/UsersTable";
import UserSearchInput from "../components/UserSearchInput";
import RoleFilter from "../components/RoleFilter";
import UserSort from "../components/UserSort";
import AdminStatsCards from "../components/AdminStatsCards";
import ChangeRoleDialog from "../components/ChangeRoleDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";


export default function UsersManagementPage() {
  const {
    users,
    loading,
    error,
    refresh,
    search,
    setSearch,
    role,
    setRole,
    sort,
    setSort,
  } = useUsers();


  // المستخدم الذي نريد تغيير دوره
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);


  // المستخدم الذي نريد حذفه
  const [deleteUserTarget, setDeleteUserTarget] =
    useState<AdminUser | null>(null);


  /*
   * حالة التحميل
   */
  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[400px] items-center justify-center p-10"
      >
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            جاري تحميل المستخدمين...
          </p>
        </div>
      </div>
    );
  }


  /*
   * حالة الخطأ
   */
  if (error) {
    return (
      <div
        dir="rtl"
        className="p-6"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <h2 className="text-lg font-black text-red-800">
            حدث خطأ أثناء تحميل المستخدمين
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={refresh}
            className="
              mt-4
              rounded-xl
              bg-red-600
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-red-700
            "
          >
            إعادة المحاولة
          </button>

        </div>
      </div>
    );
  }


  return (
    <div
      dir="rtl"
      className="min-h-full space-y-6 p-6"
    >

      {/* =========================================
          Header
      ========================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-black
              tracking-tight
              text-slate-950
            "
          >
            إدارة المستخدمين
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            إدارة المستخدمين والأدوار والصلاحيات
          </p>

        </div>


        <button
          type="button"
          onClick={refresh}
          className="
            rounded-xl
            bg-slate-950
            px-5
            py-2.5
            text-sm
            font-bold
            text-white
            transition
            hover:bg-slate-800
          "
        >
          تحديث البيانات
        </button>

      </div>


      {/* =========================================
          Statistics
      ========================================= */}

      <AdminStatsCards
        users={users}
      />


      {/* =========================================
          Filters
      ========================================= */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >

        <div className="mb-4">

          <h2
            className="
              text-base
              font-black
              text-slate-900
            "
          >
            البحث والتصفية
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            ابحث عن مستخدم أو قم بتصفية النتائج حسب الدور
          </p>

        </div>


        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
          "
        >

          {/* Search */}

          <div className="flex-1">
            <UserSearchInput
              value={search}
              onChange={setSearch}
            />
          </div>


          {/* Role Filter */}

          <div className="w-full lg:w-56">
            <RoleFilter
              value={role}
              onChange={setRole}
            />
          </div>


          {/* Sort */}

          <div className="w-full lg:w-56">
            <UserSort
              value={sort}
              onChange={setSort}
            />
          </div>

        </div>

      </div>


      {/* =========================================
          Users
      ========================================= */}

      <div className="space-y-3">

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-black
                text-slate-950
              "
            >
              المستخدمون
            </h2>

            <p className="text-sm text-slate-500">
              {users.length} مستخدم
            </p>

          </div>

        </div>


        <UsersTable
          users={users}
          onChangeRole={setSelectedUser}
          onDelete={setDeleteUserTarget}
        />

      </div>


      {/* =========================================
          Change Role Dialog
      ========================================= */}

      <ChangeRoleDialog
        open={!!selectedUser}
        user={selectedUser}
        onClose={() => {
          setSelectedUser(null);
        }}
        onSuccess={async () => {
          await refresh();
          setSelectedUser(null);
        }}
      />


      {/* =========================================
          Delete User Dialog
      ========================================= */}

      <DeleteUserDialog
        open={!!deleteUserTarget}
        user={deleteUserTarget}
        onClose={() => {
          setDeleteUserTarget(null);
        }}
        onSuccess={async () => {
          await refresh();
          setDeleteUserTarget(null);
        }}
      />

    </div>
  );
}