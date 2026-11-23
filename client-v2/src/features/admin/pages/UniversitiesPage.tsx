
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Building2,
  CalendarDays,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  MapPinned,
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
  founded_year: string;
  website_url: string;
  official_email: string;
  phone: string;
  address: string;
  institution_type: string;
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
  founded_year: "",
  website_url: "",
  official_email: "",
  phone: "",
  address: "",
  institution_type: "",
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

      const data = await getAdminUniversities();

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
    const query = search.trim().toLowerCase();

    if (!query) {
      return universities;
    }

    return universities.filter((university) => {
      const searchableFields = [
        university.name,
        university.short_name,
        university.city,
        university.address,
        university.institution_type,
        university.official_email,
      ];

      return searchableFields.some((field) =>
        field?.toLowerCase().includes(query)
      );
    });
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
      country_id: university.country_id ?? "",
      city: university.city ?? "",
      description: university.description ?? "",
      logo_url: university.logo_url ?? "",
      founded_year:
        university.founded_year != null
          ? String(university.founded_year)
          : "",
      website_url: university.website_url ?? "",
      official_email: university.official_email ?? "",
      phone: university.phone ?? "",
      address: university.address ?? "",
      institution_type: university.institution_type ?? "",
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

    let foundedYear: number | null = null;

    if (form.founded_year.trim()) {
      foundedYear = Number(form.founded_year);

      if (
        !Number.isInteger(foundedYear) ||
        foundedYear < 1000 ||
        foundedYear > 2100
      ) {
        setError(
          "سنة التأسيس يجب أن تكون رقماً صحيحاً بين 1000 و2100."
        );
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const commonPayload = {
        name,
        country_id: form.country_id.trim() || null,
        city: form.city.trim() || null,
        description: form.description.trim() || null,
        logo_url: form.logo_url.trim() || null,
        founded_year: foundedYear,
        website_url: form.website_url.trim() || null,
        official_email: form.official_email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        institution_type: form.institution_type.trim() || null,
      };

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      if (editingUniversity) {
        const payload = {
          ...commonPayload,
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

        setSuccess("تم تعديل الجامعة بنجاح.");
      }

      // -------------------------------------------------
      // CREATE
      // -------------------------------------------------

      else {
        const payload = {
          ...commonPayload,
          slug: generateUniversitySlug(name),
        };

        const created =
          await createAdminUniversity(payload);

        setUniversities((current) => [
          ...current,
          created,
        ]);

        setSuccess("تمت إضافة الجامعة بنجاح.");
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

      await deleteAdminUniversity(university.id);

      setUniversities((current) =>
        current.filter(
          (item) => item.id !== university.id
        )
      );

      setSuccess("تم حذف الجامعة بنجاح.");
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
  // INPUT CLASS
  // ===================================================

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200";

  // ===================================================
  // RENDER
  // ===================================================

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
              إدارة الجامعات والمعلومات التعريفية الخاصة بها
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
                loading ? "animate-spin" : ""
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
            placeholder="ابحث عن جامعة أو مدينة أو نوع المؤسسة..."
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
                أدخل المعلومات التعريفية والأكاديمية للجامعة.
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
            className="space-y-6"
          >
            {/* BASIC INFORMATION */}

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <Building2 className="h-4 w-4 text-blue-600" />
                المعلومات الأساسية
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="university-name"
                    className={labelClass}
                  >
                    اسم الجامعة *
                  </label>

                  <input
                    id="university-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="مثال: جامعة الجزائر 1"
                    required
                    disabled={saving}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="university-type"
                    className={labelClass}
                  >
                    نوع المؤسسة
                  </label>

                  <select
                    id="university-type"
                    value={form.institution_type}
                    onChange={(event) =>
                      updateForm(
                        "institution_type",
                        event.target.value
                      )
                    }
                    disabled={saving}
                    className={inputClass}
                  >
                    <option value="">اختر نوع المؤسسة</option>
                    <option value="جامعة حكومية">جامعة حكومية</option>
                    <option value="جامعة خاصة">جامعة خاصة</option>
                    <option value="مدرسة عليا">مدرسة عليا</option>
                    <option value="مركز جامعي">مركز جامعي</option>
                    <option value="معهد">معهد</option>
                    <option value="مؤسسة أكاديمية أخرى">
                      مؤسسة أكاديمية أخرى
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="university-founded-year"
                    className={labelClass}
                  >
                    سنة التأسيس
                  </label>

                  <input
                    id="university-founded-year"
                    type="number"
                    min="1000"
                    max="2100"
                    step="1"
                    value={form.founded_year}
                    onChange={(event) =>
                      updateForm(
                        "founded_year",
                        event.target.value
                      )
                    }
                    placeholder="مثال: 1974"
                    disabled={saving}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="university-city"
                    className={labelClass}
                  >
                    المدينة
                  </label>

                  <input
                    id="university-city"
                    type="text"
                    value={form.city}
                    onChange={(event) =>
                      updateForm("city", event.target.value)
                    }
                    placeholder="مثال: البليدة"
                    disabled={saving}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="university-country"
                    className={labelClass}
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
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="university-address"
                    className={labelClass}
                  >
                    العنوان
                  </label>

                  <input
                    id="university-address"
                    type="text"
                    value={form.address}
                    onChange={(event) =>
                      updateForm(
                        "address",
                        event.target.value
                      )
                    }
                    placeholder="العنوان الكامل للجامعة"
                    disabled={saving}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* CONTACT INFORMATION */}

            <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <Globe className="h-4 w-4 text-blue-600" />
                معلومات الاتصال والموقع الرسمي
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="university-website"
                    className={labelClass}
                  >
                    الموقع الإلكتروني
                  </label>

                  <input
                    id="university-website"
                    type="url"
                    value={form.website_url}
                    onChange={(event) =>
                      updateForm(
                        "website_url",
                        event.target.value
                      )
                    }
                    placeholder="https://www.university.dz"
                    disabled={saving}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="university-email"
                    className={labelClass}
                  >
                    البريد الإلكتروني الرسمي
                  </label>

                  <input
                    id="university-email"
                    type="email"
                    value={form.official_email}
                    onChange={(event) =>
                      updateForm(
                        "official_email",
                        event.target.value
                      )
                    }
                    placeholder="contact@university.dz"
                    disabled={saving}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="university-phone"
                    className={labelClass}
                  >
                    رقم الهاتف
                  </label>

                  <input
                    id="university-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateForm("phone", event.target.value)
                    }
                    placeholder="+213 ..."
                    disabled={saving}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="university-logo"
                    className={labelClass}
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
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
              <label
                htmlFor="university-description"
                className={labelClass}
              >
                نبذة عن الجامعة
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
                placeholder="اكتب نبذة تعريفية مختصرة عن الجامعة وتاريخها وتخصصاتها..."
                rows={4}
                disabled={saving}
                className={`${inputClass} resize-none`}
              />
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
                disabled={saving || !form.name.trim()}
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
          {filteredUniversities.map((university) => {
            const isDeleting =
              deletingId === university.id;

            return (
              <div
                key={university.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start gap-4">
                  {/* LOGO */}

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    {university.logo_url ? (
                      <img
                        src={university.logo_url}
                        alt={university.name}
                        className="h-full w-full object-contain"
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

                    {university.institution_type && (
                      <span className="mt-2 inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        {university.institution_type}
                      </span>
                    )}

                    {university.city && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{university.city}</span>
                      </div>
                    )}

                    {university.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {university.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* UNIVERSITY DETAILS */}

                <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60 sm:grid-cols-2">
                  {university.founded_year != null && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CalendarDays className="h-4 w-4 shrink-0 text-blue-600" />
                      <span>
                        تأسست سنة{" "}
                        <strong className="text-gray-900 dark:text-white">
                          {university.founded_year}
                        </strong>
                      </span>
                    </div>
                  )}

                  {university.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPinned className="h-4 w-4 shrink-0 text-blue-600" />
                      <span className="break-words">
                        {university.address}
                      </span>
                    </div>
                  )}

                  {university.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4 shrink-0 text-blue-600" />
                      <span dir="ltr">
                        {university.phone}
                      </span>
                    </div>
                  )}

                  {university.official_email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 shrink-0 text-blue-600" />
                      <span className="break-all">
                        {university.official_email}
                      </span>
                    </div>
                  )}

                  {university.website_url && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 sm:col-span-2">
                      <Globe className="h-4 w-4 shrink-0 text-blue-600" />
                      <a
                        href={university.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-blue-600 hover:underline dark:text-blue-400"
                      >
                        الموقع الرسمي
                      </a>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(university)
                    }
                    disabled={isDeleting || saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <Pencil className="h-4 w-4" />
                    تعديل
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(university)
                    }
                    disabled={isDeleting || saving}
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
          })}
        </div>
      )}
    </div>
  );
}
