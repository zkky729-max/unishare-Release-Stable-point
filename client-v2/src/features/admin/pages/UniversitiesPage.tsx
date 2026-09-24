import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Building2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createAdminUniversity,
  deleteAdminUniversity,
  getAdminUniversities,
  updateAdminUniversity,
  type AdminUniversity,
} from "../api/adminAcademic";

// =====================================================
// FORM TYPE
// =====================================================

interface UniversityForm {
  name: string;
  country_id: string;
  city: string;
  description: string;
  logo_url: string;
}

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm: UniversityForm = {
  name: "",
  country_id: "",
  city: "",
  description: "",
  logo_url: "",
};

// =====================================================
// SLUG GENERATOR
// =====================================================

function generateUniversitySlug(name: string): string {
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

  // Fallback مهم للأسماء العربية أو أي اسم لا ينتج slug مناسب
  return `university-${Date.now()}`;
}

// =====================================================
// PAGE
// =====================================================

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<
    AdminUniversity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState<string | null>(
    null
  );

  const [success, setSuccess] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingUniversity, setEditingUniversity] =
    useState<AdminUniversity | null>(null);

  const [form, setForm] =
    useState<UniversityForm>(initialForm);

  // ===================================================
  // LOAD UNIVERSITIES
  // ===================================================

  const loadUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "ADMIN UNIVERSITIES: loading..."
      );

      const data = await getAdminUniversities();

      console.log(
        "ADMIN UNIVERSITIES DATA:",
        data
      );

      setUniversities(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "GET ADMIN UNIVERSITIES ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل الجامعات"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUniversities();
  }, [loadUniversities]);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredUniversities = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return universities;
    }

    return universities.filter(
      (university) => {
        const name =
          university.name?.toLowerCase() ?? "";

        const city =
          university.city?.toLowerCase() ?? "";

        return (
          name.includes(query) ||
          city.includes(query)
        );
      }
    );
  }, [universities, search]);

  // ===================================================
  // FORM
  // ===================================================

  const updateForm = (
    field: keyof UniversityForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingUniversity(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm(initialForm);
    setEditingUniversity(null);
    setError(null);
    setSuccess(null);
    setShowForm(true);
  };

  const openEditForm = (
    university: AdminUniversity
  ) => {
    setEditingUniversity(university);

    setForm({
      name: university.name ?? "",
      country_id:
        university.country_id ?? "",
      city: university.city ?? "",
      description:
        university.description ?? "",
      logo_url:
        university.logo_url ?? "",
    });

    setError(null);
    setSuccess(null);
    setShowForm(true);
  };

  // ===================================================
  // CREATE / UPDATE
  // ===================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setError("اسم الجامعة مطلوب.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      if (editingUniversity) {
        const payload = {
          name,
          country_id:
            form.country_id.trim() || null,
          city:
            form.city.trim() || null,
          description:
            form.description.trim() || null,
          logo_url:
            form.logo_url.trim() || null,

          // نحافظ على slug الموجود للجامعة
          slug:
            editingUniversity.slug ??
            generateUniversitySlug(name),
        };

        const updated =
          await updateAdminUniversity(
            editingUniversity.id,
            payload
          );

        setUniversities((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );

        setSuccess(
          "تم تعديل الجامعة بنجاح."
        );
      }

      // -------------------------------------------------
      // CREATE
      // -------------------------------------------------

      else {
        const payload = {
          name,
          country_id:
            form.country_id.trim() || null,
          city:
            form.city.trim() || null,
          description:
            form.description.trim() || null,
          logo_url:
            form.logo_url.trim() || null,

          // إنشاء slug تلقائيًا
          slug: generateUniversitySlug(name),
        };

        const created =
          await createAdminUniversity(
            payload
          );

        setUniversities((current) => [
          ...current,
          created,
        ]);

        setSuccess(
          "تمت إضافة الجامعة بنجاح."
        );
      }

      setForm(initialForm);
      setEditingUniversity(null);
      setShowForm(false);
    } catch (err) {
      console.error(
        "SAVE UNIVERSITY ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء حفظ الجامعة"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (
    university: AdminUniversity
  ) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الجامعة:\n\n"${university.name}"؟\n\nلا يمكن التراجع عن هذا الإجراء.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(university.id);
      setError(null);
      setSuccess(null);

      await deleteAdminUniversity(
        university.id
      );

      setUniversities((current) =>
        current.filter(
          (item) =>
            item.id !== university.id
        )
      );

      setSuccess(
        "تم حذف الجامعة بنجاح."
      );
    } catch (err) {
      console.error(
        "DELETE UNIVERSITY ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء حذف الجامعة"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ===================================================
  // RENDER
  // =====================================================

  return (
    <div
      dir="rtl"
      className="min-h-full space-y-6 p-4 md:p-6"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Building2
              className="h-6 w-6"
              aria-hidden="true"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              الجامعات
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              إدارة الجامعات في منصة UniShare
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            إضافة جامعة
          </button>

          <button
            type="button"
            onClick={() => {
              void loadUniversities();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            تحديث
          </button>
        </div>
      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300"
        >
          {success}
        </div>
      )}

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="ابحث عن جامعة أو مدينة..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          إجمالي الجامعات:{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {universities.length}
          </span>
        </div>
      </div>

      {/* =================================================
          CREATE / EDIT FORM
      ================================================= */}

      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingUniversity
                  ? "تعديل الجامعة"
                  : "إضافة جامعة جديدة"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {editingUniversity
                  ? "قم بتعديل معلومات الجامعة"
                  : "أدخل معلومات الجامعة"}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* NAME */}

              <div className="md:col-span-2">
                <label
                  htmlFor="university-name"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  اسم الجامعة *
                </label>

                <input
                  id="university-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateForm(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="مثال: جامعة الجزائر 1"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* COUNTRY */}

              <div>
                <label
                  htmlFor="university-country"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  معرف الدولة
                </label>

                <input
                  id="university-country"
                  type="text"
                  value={form.country_id}
                  onChange={(event) =>
                    updateForm(
                      "country_id",
                      event.target.value
                    )
                  }
                  placeholder="UUID الدولة"
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* CITY */}

              <div>
                <label
                  htmlFor="university-city"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  المدينة
                </label>

                <input
                  id="university-city"
                  type="text"
                  value={form.city}
                  onChange={(event) =>
                    updateForm(
                      "city",
                      event.target.value
                    )
                  }
                  placeholder="مثال: البليدة"
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* LOGO */}

              <div>
                <label
                  htmlFor="university-logo"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  رابط الشعار
                </label>

                <input
                  id="university-logo"
                  type="url"
                  value={form.logo_url}
                  onChange={(event) =>
                    updateForm(
                      "logo_url",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label
                  htmlFor="university-description"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  الوصف
                </label>

                <textarea
                  id="university-description"
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="وصف مختصر عن الجامعة..."
                  rows={4}
                  disabled={saving}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={
                  saving ||
                  !form.name.trim()
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving
                  ? "جاري الحفظ..."
                  : editingUniversity
                    ? "حفظ التعديلات"
                    : "إضافة الجامعة"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          UNIVERSITIES
      ================================================= */}

      {loading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin" />

            <span className="text-sm">
              جاري تحميل الجامعات...
            </span>
          </div>
        </div>
      ) : filteredUniversities.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center dark:border-gray-700 dark:bg-gray-900">
          <Building2 className="mb-4 h-12 w-12 text-gray-400" />

          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {search.trim()
              ? "لم يتم العثور على نتائج"
              : "لا توجد جامعات"}
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {search.trim()
              ? "جرّب البحث باسم آخر."
              : "لم تتم إضافة أي جامعة حتى الآن."}
          </p>

          {!search.trim() && (
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              إضافة أول جامعة
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredUniversities.map(
            (university) => {
              const isDeleting =
                deletingId === university.id;

              return (
                <div
                  key={university.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-start gap-4">
                    {/* LOGO */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      {university.logo_url ? (
                        <img
                          src={university.logo_url}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <Building2 className="h-7 w-7 text-gray-400" />
                      )}
                    </div>

                    {/* INFO */}

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-bold text-gray-900 dark:text-white">
                        {university.name}
                      </h3>

                      {university.city && (
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />

                          <span>
                            {university.city}
                          </span>
                        </div>
                      )}

                      {university.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                          {university.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(
                          university
                        )
                      }
                      disabled={
                        isDeleting ||
                        saving
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <Pencil className="h-4 w-4" />
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDelete(
                          university
                        )
                      }
                      disabled={
                        isDeleting ||
                        saving
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      {isDeleting
                        ? "جاري الحذف..."
                        : "حذف"}
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}