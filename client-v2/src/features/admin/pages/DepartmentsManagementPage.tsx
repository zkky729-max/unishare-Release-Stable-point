import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Building2,
  Check,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  createAdminDepartment,
  deleteAdminDepartment,
  getAdminDepartmentsByFaculty,
  getAdminFaculties,
  updateAdminDepartment,
  type AdminDepartment,
  type AdminFaculty,
} from "../api/adminAcademic";

export default function DepartmentsManagementPage() {
  const [faculties, setFaculties] = useState<AdminFaculty[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);

  const [selectedFacultyId, setSelectedFacultyId] =
    useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [editingDepartmentId, setEditingDepartmentId] =
    useState<string | null>(null);

  const [loadingFaculties, setLoadingFaculties] =
    useState(true);

  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD FACULTIES
  // =====================================================

  async function loadFaculties() {
    try {
      setLoadingFaculties(true);
      setError("");

      const data = await getAdminFaculties();

      setFaculties(data);
    } catch (err) {
      console.error(
        "ADMIN FACULTIES LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load faculties."
      );
    } finally {
      setLoadingFaculties(false);
    }
  }

  useEffect(() => {
    loadFaculties();
  }, []);

  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  async function loadDepartments(facultyId: string) {
    if (!facultyId) {
      setDepartments([]);
      return;
    }

    try {
      setLoadingDepartments(true);
      setError("");

      const data =
        await getAdminDepartmentsByFaculty(
          facultyId
        );

      setDepartments(data);
    } catch (err) {
      console.error(
        "ADMIN DEPARTMENTS LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load departments."
      );
    } finally {
      setLoadingDepartments(false);
    }
  }

  // =====================================================
  // FACULTY CHANGE
  // =====================================================

  function handleFacultyChange(
    facultyId: string
  ) {
    setSelectedFacultyId(facultyId);

    setDepartments([]);

    setEditingDepartmentId(null);

    setName("");
    setSlug("");
    setDescription("");

    setError("");
    setSuccess("");

    if (!facultyId) {
      return;
    }

    loadDepartments(facultyId);
  }

  // =====================================================
  // RESET FORM
  // =====================================================

  function resetForm() {
    setEditingDepartmentId(null);
    setName("");
    setSlug("");
    setDescription("");
  }

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanSlug = slug.trim();
    const cleanDescription =
      description.trim();

    if (!selectedFacultyId) {
      setError("Please select a faculty.");
      return;
    }

    if (!cleanName) {
      setError(
        "Department name is required."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingDepartmentId) {
        const updated =
          await updateAdminDepartment(
            editingDepartmentId,
            {
              name: cleanName,
              faculty_id:
                selectedFacultyId,
              slug: cleanSlug || null,
              description:
                cleanDescription || null,
            }
          );

        setDepartments((current) =>
          current.map((department) =>
            department.id ===
            editingDepartmentId
              ? updated
              : department
          )
        );

        setSuccess(
          "Department updated successfully."
        );
      } else {
        const created =
          await createAdminDepartment({
            name: cleanName,
            faculty_id:
              selectedFacultyId,
            slug: cleanSlug || null,
            description:
              cleanDescription || null,
          });

        setDepartments((current) => [
          created,
          ...current,
        ]);

        setSuccess(
          "Department created successfully."
        );
      }

      resetForm();
    } catch (err) {
      console.error(
        "ADMIN DEPARTMENT SAVE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save department."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // EDIT
  // =====================================================

  function handleEdit(
    department: AdminDepartment
  ) {
    setEditingDepartmentId(
      department.id
    );

    setName(department.name);
    setSlug(department.slug ?? "");
    setDescription(
      department.description ?? ""
    );

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function handleDelete(
    department: AdminDepartment
  ) {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف "${department.name}"؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(department.id);
      setError("");
      setSuccess("");

      await deleteAdminDepartment(
        department.id
      );

      setDepartments((current) =>
        current.filter(
          (item) =>
            item.id !== department.id
        )
      );

      if (
        editingDepartmentId ===
        department.id
      ) {
        resetForm();
      }

      setSuccess(
        "تم حذف القسم بنجاح."
      );
    } catch (err) {
      console.error(
        "ADMIN DEPARTMENT DELETE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete department."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const selectedFaculty =
    faculties.find(
      (faculty) =>
        faculty.id ===
        selectedFacultyId
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      dir="rtl"
      className="min-h-full space-y-8 p-6"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          إدارة الأقسام
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          إدارة الأقسام الأكاديمية داخل كل كلية.
        </p>
      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* =================================================
          FACULTY SELECTION
      ================================================= */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 size={21} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                اختيار الكلية
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                اختر الكلية التي تريد إدارة أقسامها.
              </p>
            </div>
          </div>
        </div>

        {loadingFaculties ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              جاري تحميل الكليات...
            </p>
          </div>
        ) : faculties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              لا توجد كليات متاحة.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {faculties.map((faculty) => {
              const isSelected =
                faculty.id ===
                selectedFacultyId;

              return (
                <button
                  key={faculty.id}
                  type="button"
                  onClick={() =>
                    handleFacultyChange(
                      faculty.id
                    )
                  }
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-5
                    text-right
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        transition
                        ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                        }
                      `}
                    >
                      <Building2 size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`
                          text-sm
                          font-black
                          leading-6
                          ${
                            isSelected
                              ? "text-blue-700"
                              : "text-slate-800"
                          }
                        `}
                      >
                        {faculty.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        إدارة أقسام الكلية
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={15} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedFaculty && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-4">
            <Check
              size={18}
              className="text-green-600"
            />

            <div>
              <p className="text-xs font-medium text-slate-400">
                الكلية المحددة
              </p>

              <p className="mt-1 font-black text-slate-800">
                {selectedFaculty.name}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* =================================================
          CREATE / EDIT FORM
      ================================================= */}

      {selectedFacultyId && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                {editingDepartmentId ? (
                  <Pencil size={20} />
                ) : (
                  <Plus size={21} />
                )}
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {editingDepartmentId
                    ? "تعديل القسم"
                    : "إضافة قسم"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingDepartmentId
                    ? "تعديل بيانات القسم المحدد."
                    : "إضافة قسم جديد إلى الكلية المحددة."}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* NAME */}

            <div className="space-y-2">
              <label
                htmlFor="department-name"
                className="text-sm font-bold text-slate-700"
              >
                اسم القسم
              </label>

              <input
                id="department-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="مثال: قسم اللغة العربية وآدابها"
                disabled={saving}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* SLUG */}

            <div className="space-y-2">
              <label
                htmlFor="department-slug"
                className="text-sm font-bold text-slate-700"
              >
                Slug
              </label>

              <input
                id="department-slug"
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                  )
                }
                placeholder="مثال: arabic-language-and-literature"
                disabled={saving}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="space-y-2">
              <label
                htmlFor="department-description"
                className="text-sm font-bold text-slate-700"
              >
                الوصف
              </label>

              <textarea
                id="department-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="وصف اختياري للقسم"
                rows={4}
                disabled={saving}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* BUTTONS */}

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              {editingDepartmentId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  إلغاء التعديل
                </button>
              )}

              <button
                type="submit"
                disabled={
                  saving ||
                  !name.trim()
                }
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />

                {saving
                  ? "جاري الحفظ..."
                  : editingDepartmentId
                    ? "حفظ التعديلات"
                    : "إضافة القسم"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          DEPARTMENTS LIST
      ================================================= */}

      {selectedFacultyId && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                أقسام {selectedFaculty?.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {departments.length} قسم
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadDepartments(
                  selectedFacultyId
                )
              }
              disabled={
                loadingDepartments
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loadingDepartments
                    ? "animate-spin"
                    : ""
                }
              />

              {loadingDepartments
                ? "جاري التحميل..."
                : "تحديث"}
            </button>
          </div>

          {loadingDepartments ? (
            <div className="p-10 text-center text-sm text-slate-500">
              جاري تحميل الأقسام...
            </div>
          ) : departments.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Building2 size={24} />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-600">
                لا توجد أقسام لهذه الكلية.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                أضف أول قسم باستخدام النموذج أعلاه.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {departments.map(
                (department) => (
                  <div
                    key={department.id}
                    className="flex flex-col gap-5 px-6 py-5 transition hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Building2 size={19} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-black text-slate-800">
                          {department.name}
                        </h3>

                        {department.slug && (
                          <p className="mt-1 text-xs text-slate-400">
                            {department.slug}
                          </p>
                        )}

                        {department.description && (
                          <p className="mt-2 text-sm text-slate-500">
                            {
                              department.description
                            }
                          </p>
                        )}

                        <p className="mt-2 break-all font-mono text-[10px] text-slate-300">
                          {department.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            department
                          )
                        }
                        disabled={
                          saving ||
                          deletingId !==
                            null
                        }
                        className="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Pencil size={16} />
                        تعديل
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            department
                          )
                        }
                        disabled={
                          deletingId !==
                            null ||
                          saving
                        }
                        className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />

                        {deletingId ===
                        department.id
                          ? "جاري الحذف..."
                          : "حذف"}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!selectedFacultyId &&
        !loadingFaculties && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
              <Building2 size={28} />
            </div>

            <h3 className="mt-4 font-black text-slate-700">
              اختر كلية للبدء
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              اختر إحدى الكليات أعلاه لإدارة أقسامها.
            </p>
          </div>
        )}
    </div>
  );
}