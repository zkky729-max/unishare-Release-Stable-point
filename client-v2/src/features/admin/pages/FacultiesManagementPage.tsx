import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createAdminFaculty,
  deleteAdminFaculty,
  getAdminFaculties,
  getAdminUniversities,
  type AdminFaculty,
  type AdminUniversity,
} from "../api/adminAcademic";

// =====================================================
// SLUG GENERATOR
// =====================================================

function generateFacultySlug(name: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const slug = normalized
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  if (slug) {
    return slug;
  }

  return `faculty-${Date.now()}`;
}

// =====================================================
// PAGE
// =====================================================

export default function FacultiesManagementPage() {
  // ===================================================
  // DATA
  // ===================================================

  const [faculties, setFaculties] = useState<AdminFaculty[]>(
    []
  );

  const [universities, setUniversities] = useState<
    AdminUniversity[]
  >([]);

  // ===================================================
  // FORM
  // ===================================================

  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // ===================================================
  // STATES
  // ===================================================

  const [loading, setLoading] = useState(true);
  const [loadingUniversities, setLoadingUniversities] =
    useState(true);

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===================================================
  // LOAD UNIVERSITIES
  // ===================================================

  async function loadUniversities() {
    try {
      setLoadingUniversities(true);

      const data = await getAdminUniversities();

      setUniversities(data);

      // اختيار أول جامعة تلقائيًا إذا كانت موجودة
      if (data.length > 0 && !universityId) {
        setUniversityId(data[0].id);
      }
    } catch (err) {
      console.error(
        "ADMIN UNIVERSITIES LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load universities."
      );
    } finally {
      setLoadingUniversities(false);
    }
  }

  // ===================================================
  // LOAD FACULTIES
  // ===================================================

  async function loadFaculties() {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  }

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    void Promise.all([
      loadFaculties(),
      loadUniversities(),
    ]);
  }, []);

  // ===================================================
  // AUTO GENERATE SLUG
  // ===================================================

  function handleNameChange(value: string) {
    setName(value);

    // لا نغير slug يدويًا إذا كان المستخدم عدّله بنفسه
    const generatedSlug = generateFacultySlug(value);

    setSlug(generatedSlug);
  }

  // ===================================================
  // CREATE FACULTY
  // ===================================================

  async function handleCreateFaculty(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanUniversityId = universityId.trim();
    const cleanSlug = slug.trim();
    const cleanDescription = description.trim();
    const cleanLogoUrl = logoUrl.trim();

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!cleanName) {
      setError("Faculty name is required.");
      return;
    }

    if (!cleanUniversityId) {
      setError("Please select a university.");
      return;
    }

    if (!cleanSlug) {
      setError("Faculty slug could not be generated.");
      return;
    }

    // التأكد أن الجامعة المختارة موجودة
    const selectedUniversity = universities.find(
      (university) =>
        university.id === cleanUniversityId
    );

    if (!selectedUniversity) {
      setError("Selected university was not found.");
      return;
    }

    try {
      setCreating(true);

      const faculty = await createAdminFaculty({
        name: cleanName,
        university_id: cleanUniversityId,
        slug: cleanSlug,
        description:
          cleanDescription || null,
        logo_url:
          cleanLogoUrl || null,
      });

      // إضافة الكلية للقائمة مباشرة
      setFaculties((current) => [
        faculty,
        ...current,
      ]);

      // تنظيف النموذج
      setName("");
      setSlug("");
      setDescription("");
      setLogoUrl("");

      // الاحتفاظ بالجامعة المختارة
      setUniversityId(cleanUniversityId);

      setSuccess(
        `Faculty "${faculty.name}" created successfully under "${selectedUniversity.name}".`
      );
    } catch (err) {
      console.error(
        "ADMIN FACULTY CREATE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create faculty."
      );
    } finally {
      setCreating(false);
    }
  }

  // ===================================================
  // DELETE FACULTY
  // ===================================================

  async function handleDeleteFaculty(
    faculty: AdminFaculty
  ) {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${faculty.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(faculty.id);

      setError("");
      setSuccess("");

      await deleteAdminFaculty(faculty.id);

      setFaculties((current) =>
        current.filter(
          (item) => item.id !== faculty.id
        )
      );

      setSuccess(
        `Faculty "${faculty.name}" deleted successfully.`
      );
    } catch (err) {
      console.error(
        "ADMIN FACULTY DELETE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete faculty."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ===================================================
  // UNIVERSITY NAME
  // ===================================================

  function getUniversityName(
    universityId: string | null
  ): string {
    if (!universityId) {
      return "No university";
    }

    const university = universities.find(
      (item) => item.id === universityId
    );

    return university?.name ?? "Unknown university";
  }

  // ===================================================
  // RENDER
  // ===================================================

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
          إدارة الكليات
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          إنشاء وإدارة الكليات وربطها بالجامعات.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* =================================================
          CREATE FACULTY
      ================================================= */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            إضافة كلية
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            اختر الجامعة ثم أضف الكلية التابعة لها.
          </p>
        </div>

        <form
          onSubmit={handleCreateFaculty}
          className="space-y-5"
        >
          {/* =================================================
              UNIVERSITY
          ================================================= */}

          <div className="space-y-2">
            <label
              htmlFor="faculty-university"
              className="text-sm font-medium"
            >
              الجامعة
            </label>

            {loadingUniversities ? (
              <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-500">
                جاري تحميل الجامعات...
              </div>
            ) : universities.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                لا توجد جامعات. يجب إضافة جامعة أولًا.
              </div>
            ) : (
              <select
                id="faculty-university"
                value={universityId}
                onChange={(event) =>
                  setUniversityId(
                    event.target.value
                  )
                }
                disabled={creating}
                className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  اختر الجامعة
                </option>

                {universities.map(
                  (university) => (
                    <option
                      key={university.id}
                      value={university.id}
                    >
                      {university.name}
                      {university.city
                        ? ` — ${university.city}`
                        : ""}
                    </option>
                  )
                )}
              </select>
            )}

            <p className="text-xs text-gray-500">
              سيتم حفظ معرف الجامعة تلقائيًا. لا حاجة
              لإدخال UUID يدويًا.
            </p>
          </div>

          {/* =================================================
              FACULTY NAME
          ================================================= */}

          <div className="space-y-2">
            <label
              htmlFor="faculty-name"
              className="text-sm font-medium"
            >
              اسم الكلية
            </label>

            <input
              id="faculty-name"
              type="text"
              value={name}
              onChange={(event) =>
                handleNameChange(
                  event.target.value
                )
              }
              placeholder="مثال: كلية العلوم الاقتصادية والتجارية وعلوم التسيير"
              disabled={creating}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />
          </div>

          {/* =================================================
              SLUG
          ================================================= */}

          <div className="space-y-2">
            <label
              htmlFor="faculty-slug"
              className="text-sm font-medium"
            >
              Slug
            </label>

            <input
              id="faculty-slug"
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              placeholder="economics"
              disabled={creating}
              className="w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />

            <p className="text-xs text-gray-500">
              يتم توليده تلقائيًا من اسم الكلية ويمكن
              تعديله إذا أردت.
            </p>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="space-y-2">
            <label
              htmlFor="faculty-description"
              className="text-sm font-medium"
            >
              الوصف

              <span className="mr-2 text-xs font-normal text-gray-400">
                اختياري
              </span>
            </label>

            <textarea
              id="faculty-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="وصف الكلية..."
              rows={4}
              disabled={creating}
              className="w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />
          </div>

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="space-y-2">
            <label
              htmlFor="faculty-logo"
              className="text-sm font-medium"
            >
              رابط الشعار

              <span className="mr-2 text-xs font-normal text-gray-400">
                اختياري
              </span>
            </label>

            <input
              id="faculty-logo"
              type="url"
              value={logoUrl}
              onChange={(event) =>
                setLogoUrl(
                  event.target.value
                )
              }
              placeholder="https://..."
              disabled={creating}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="flex justify-start pt-2">
            <button
              type="submit"
              disabled={
                creating ||
                loadingUniversities ||
                universities.length === 0 ||
                !name.trim() ||
                !universityId.trim()
              }
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "جاري الإنشاء..."
                : "إضافة الكلية"}
            </button>
          </div>
        </form>
      </section>

      {/* =================================================
          FACULTIES LIST
      ================================================= */}

      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              الكليات
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {faculties.length}{" "}
              {faculties.length === 1
                ? "كلية"
                : "كليات"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadFaculties();
              void loadUniversities();
            }}
            disabled={
              loading ||
              loadingUniversities ||
              deletingId !== null
            }
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "جاري التحميل..."
              : "تحديث"}
          </button>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            جاري تحميل الكليات...
          </div>
        ) : faculties.length === 0 ? (
          /* =================================================
             EMPTY
          ================================================= */

          <div className="p-10 text-center">
            <p className="text-sm text-gray-500">
              لا توجد كليات حاليًا.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              أضف أول كلية من النموذج أعلاه.
            </p>
          </div>
        ) : (
          /* =================================================
             LIST
          ================================================= */

          <div className="divide-y">
            {faculties.map((faculty) => {
              const isDeleting =
                deletingId === faculty.id;

              const universityName =
                getUniversityName(
                  faculty.university_id
                );

              return (
                <div
                  key={faculty.id}
                  className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  {/* =================================================
                      FACULTY INFORMATION
                  ================================================= */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      {faculty.logo_url ? (
                        <img
                          src={faculty.logo_url}
                          alt={faculty.name}
                          className="h-10 w-10 shrink-0 rounded-lg border object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-500">
                          {faculty.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {faculty.name}
                        </h3>

                        {faculty.slug && (
                          <p className="mt-1 text-xs text-gray-500">
                            {faculty.slug}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* University */}

                    <div className="mt-3">
                      <p className="text-xs text-gray-400">
                        الجامعة
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {universityName}
                      </p>
                    </div>

                    {/* Description */}

                    {faculty.description && (
                      <p className="mt-3 max-w-2xl text-sm text-gray-500">
                        {faculty.description}
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      ACTIONS / IDS
                  ================================================= */}

                  <div className="flex shrink-0 flex-col gap-3 md:min-w-[320px] md:items-end">
                    <div className="w-full md:text-right">
                      <p className="text-xs text-gray-400">
                        Faculty ID
                      </p>

                      <p className="mt-1 break-all font-mono text-xs text-gray-500">
                        {faculty.id}
                      </p>

                      {faculty.university_id && (
                        <>
                          <p className="mt-3 text-xs text-gray-400">
                            University ID
                          </p>

                          <p className="mt-1 break-all font-mono text-xs text-gray-500">
                            {faculty.university_id}
                          </p>
                        </>
                      )}
                    </div>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        void handleDeleteFaculty(
                          faculty
                        )
                      }
                      disabled={
                        deletingId !== null
                      }
                      aria-disabled={
                        deletingId !== null
                      }
                      className="inline-flex min-w-[110px] items-center justify-center rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}