import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createAdminSpecialty,
  deleteAdminSpecialty,
  getAdminSpecialtiesByFaculty,
  getAdminDepartmentsByFaculty,
  getAdminFaculties,
  type AdminSpecialty,
  type AdminDepartment,
  type AdminFaculty,
} from "../api/adminAcademic";

export default function SpecialtiesManagementPage() {
  const [faculties, setFaculties] = useState<AdminFaculty[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [specialties, setSpecialties] = useState<AdminSpecialty[]>([]);

  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     LOAD FACULTIES
  ===================================================== */

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
    void loadFaculties();
  }, []);

  /* =====================================================
     LOAD DEPARTMENTS
  ===================================================== */

  async function loadDepartments(
    facultyId: string
  ) {
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

      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  }

  /* =====================================================
     LOAD SPECIALTIES
  ===================================================== */

  async function loadSpecialties(
    facultyId: string
  ) {
    if (!facultyId) {
      setSpecialties([]);
      return;
    }

    try {
      setLoadingSpecialties(true);
      setError("");

      const data =
        await getAdminSpecialtiesByFaculty(
          facultyId
        );

      setSpecialties(data);
    } catch (err) {
      console.error(
        "ADMIN SPECIALTIES LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load specialties."
      );

      setSpecialties([]);
    } finally {
      setLoadingSpecialties(false);
    }
  }

  /* =====================================================
     FACULTY CHANGE
  ===================================================== */

  function handleFacultyChange(
    facultyId: string
  ) {
    setSelectedFacultyId(facultyId);

    setSelectedDepartmentId("");

    setDepartments([]);
    setSpecialties([]);

    setName("");
    setSlug("");

    setError("");
    setSuccess("");

    if (!facultyId) {
      return;
    }

    void loadDepartments(facultyId);
    void loadSpecialties(facultyId);
  }

  /* =====================================================
     DEPARTMENT CHANGE
  ===================================================== */

  function handleDepartmentChange(
    departmentId: string
  ) {
    setSelectedDepartmentId(departmentId);

    setName("");
    setSlug("");

    setError("");
    setSuccess("");
  }

  /* =====================================================
     CREATE SPECIALTY
  ===================================================== */

  async function handleCreateSpecialty(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanSlug = slug.trim();

    if (!selectedFacultyId) {
      setError("Please select a faculty.");
      return;
    }

    if (!selectedDepartmentId) {
      setError("Please select a department.");
      return;
    }

    if (!cleanName) {
      setError("Specialty name is required.");
      return;
    }

    if (!cleanSlug) {
      setError("Specialty slug is required.");
      return;
    }

    try {
      setCreating(true);

      const specialty =
        await createAdminSpecialty({
          name: cleanName,
          faculty_id: selectedFacultyId,
          department_id:
            selectedDepartmentId,
          slug: cleanSlug,
        });

      setSpecialties((current) => [
        specialty,
        ...current,
      ]);

      setName("");
      setSlug("");

      setSuccess(
        "Specialty created successfully."
      );
    } catch (err) {
      console.error(
        "ADMIN SPECIALTY CREATE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create specialty."
      );
    } finally {
      setCreating(false);
    }
  }

  /* =====================================================
     DELETE SPECIALTY
  ===================================================== */

  async function handleDeleteSpecialty(
    specialty: AdminSpecialty
  ) {
    const confirmed =
      window.confirm(
        `هل أنت متأكد من حذف التخصص "${specialty.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(specialty.id);
      setError("");
      setSuccess("");

      await deleteAdminSpecialty(
        specialty.id
      );

      setSpecialties((current) =>
        current.filter(
          (item) =>
            item.id !== specialty.id
        )
      );

      setSuccess(
        `تم حذف التخصص "${specialty.name}" بنجاح.`
      );
    } catch (err) {
      console.error(
        "ADMIN SPECIALTY DELETE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete specialty."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /* =====================================================
     SELECTED FACULTY
  ===================================================== */

  const selectedFaculty =
    faculties.find(
      (faculty) =>
        faculty.id === selectedFacultyId
    );

  /* =====================================================
     SELECTED DEPARTMENT
  ===================================================== */

  const selectedDepartment =
    departments.find(
      (department) =>
        department.id === selectedDepartmentId
    );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      dir="rtl"
      className="space-y-8 p-6"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          إدارة التخصصات
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          إدارة التخصصات الأكاديمية داخل الأقسام.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* =================================================
          FACULTY SELECTOR
      ================================================= */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            اختيار الكلية
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            اختر الكلية التي يوجد بها القسم والتخصص.
          </p>
        </div>

        <select
          value={selectedFacultyId}
          onChange={(event) =>
            handleFacultyChange(
              event.target.value
            )
          }
          disabled={loadingFaculties}
          className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">
            {loadingFaculties
              ? "جاري تحميل الكليات..."
              : "اختر الكلية"}
          </option>

          {faculties.map((faculty) => (
            <option
              key={faculty.id}
              value={faculty.id}
            >
              {faculty.name}
            </option>
          ))}
        </select>

        {selectedFaculty && (
          <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">
              الكلية المختارة
            </p>

            <p className="mt-1 font-medium">
              {selectedFaculty.name}
            </p>
          </div>
        )}
      </section>

      {/* =================================================
          DEPARTMENT SELECTOR
      ================================================= */}

      {selectedFacultyId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              اختيار القسم
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              اختر القسم الذي ينتمي إليه التخصص.
            </p>
          </div>

          <select
            value={selectedDepartmentId}
            onChange={(event) =>
              handleDepartmentChange(
                event.target.value
              )
            }
            disabled={
              loadingDepartments ||
              departments.length === 0
            }
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {loadingDepartments
                ? "جاري تحميل الأقسام..."
                : departments.length === 0
                  ? "لا توجد أقسام لهذه الكلية"
                  : "اختر القسم"}
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>

          {selectedDepartment && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">
                القسم المختار
              </p>

              <p className="mt-1 font-medium">
                {selectedDepartment.name}
              </p>
            </div>
          )}
        </section>
      )}

      {/* =================================================
          CREATE SPECIALTY
      ================================================= */}

      {selectedFacultyId &&
        selectedDepartmentId && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                إضافة تخصص
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                إضافة تخصص إلى قسم{" "}
                <span className="font-medium text-gray-700">
                  {selectedDepartment?.name}
                </span>
                .
              </p>
            </div>

            <form
              onSubmit={
                handleCreateSpecialty
              }
              className="space-y-5"
            >
              {/* Name */}

              <div className="space-y-2">
                <label
                  htmlFor="specialty-name"
                  className="text-sm font-medium"
                >
                  اسم التخصص
                </label>

                <input
                  id="specialty-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="مثال: لسانيات"
                  disabled={creating}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>

              {/* Slug */}

              <div className="space-y-2">
                <label
                  htmlFor="specialty-slug"
                  className="text-sm font-medium"
                >
                  Slug
                </label>

                <input
                  id="specialty-slug"
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      event.target.value
                    )
                  }
                  placeholder="مثال: linguistics"
                  disabled={creating}
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />

                <p className="text-xs text-gray-500">
                  يجب أن يكون الـ slug فريدًا بين
                  التخصصات.
                </p>
              </div>

              {/* Submit */}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={
                    creating ||
                    !name.trim() ||
                    !slug.trim() ||
                    !selectedDepartmentId
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "جاري الإضافة..."
                    : "إضافة التخصص"}
                </button>
              </div>
            </form>
          </section>
        )}

      {/* =================================================
          SPECIALTIES LIST
      ================================================= */}

      {selectedFacultyId && (
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                التخصصات
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {specialties.length}{" "}
                {specialties.length === 1
                  ? "تخصص"
                  : "تخصصات"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadSpecialties(
                  selectedFacultyId
                )
              }
              disabled={loadingSpecialties}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingSpecialties
                ? "جاري التحميل..."
                : "تحديث"}
            </button>
          </div>

          {/* Loading */}

          {loadingSpecialties ? (
            <div className="p-10 text-center text-sm text-gray-500">
              جاري تحميل التخصصات...
            </div>
          ) : specialties.length === 0 ? (
            /* Empty */

            <div className="p-10 text-center">
              <p className="text-sm text-gray-500">
                لا توجد تخصصات لهذه الكلية.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                اختر قسمًا ثم أضف أول تخصص.
              </p>
            </div>
          ) : (
            /* List */

            <div className="divide-y">
              {specialties.map((specialty) => {
                const department =
                  departments.find(
                    (item) =>
                      item.id ===
                      specialty.department_id
                  );

                const isDeleting =
                  deletingId ===
                  specialty.id;

                return (
                  <div
                    key={specialty.id}
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold">
                        {specialty.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {specialty.slug}
                      </p>

                      <div className="mt-3 inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                        القسم:{" "}
                        {department?.name ??
                          "غير محدد"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Specialty ID
                        </p>

                        <p className="mt-1 max-w-[280px] break-all font-mono text-xs text-gray-500">
                          {specialty.id}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSpecialty(
                            specialty
                          )
                        }
                        disabled={
                          deletingId !==
                            null ||
                          isDeleting
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting
                          ? "جاري الحذف..."
                          : "حذف"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =================================================
          NO FACULTY SELECTED
      ================================================= */}

      {!selectedFacultyId &&
        !loadingFaculties && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-sm text-gray-500">
              اختر كلية لإدارة تخصصاتها وأقسامها.
            </p>
          </div>
        )}
    </div>
  );
}