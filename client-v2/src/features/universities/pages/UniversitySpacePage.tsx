
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  CalendarDays,
  Landmark,
  MapPinned,
  ExternalLink,
  GraduationCap,
  FileText,
} from "lucide-react";

import {
  useParams,
} from "react-router-dom";

import {
  useUniversity,
} from "../hooks/useUniversity";


export default function UniversitySpacePage() {

  const {
    slug,
  } = useParams<{
    slug: string;
  }>();

  const {
    university,
    loading,
    error,
  } = useUniversity(slug);


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <p className="mt-4 text-gray-500 dark:text-gray-400">
              جاري تحميل الجامعة...
            </p>
          </div>
        </div>
      </main>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <h1 className="text-xl font-bold">
              تعذر تحميل الجامعة
            </h1>

            <p className="mt-3 text-sm">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }


  /* =========================
     NOT FOUND
  ========================= */

  if (!university) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
        <div className="mx-auto flex min-h-[400px] max-w-4xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-900">
              <Building2 size={30} />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              الجامعة غير موجودة
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              لم نتمكن من العثور على الجامعة المطلوبة.
            </p>
          </div>
        </div>
      </main>
    );
  }


  /* =========================
     UNIVERSITY INFORMATION
  ========================= */

  const informationItems = [
    {
      label: "سنة التأسيس",
      value: university.founded_year,
      icon: CalendarDays,
    },
    {
      label: "نوع المؤسسة",
      value: university.institution_type,
      icon: Landmark,
    },
    {
      label: "المدينة",
      value: university.city,
      icon: MapPin,
    },
    {
      label: "العنوان",
      value: university.address,
      icon: MapPinned,
    },
  ].filter((item) => item.value !== null && item.value !== undefined && item.value !== "");


  /* =========================
     UNIVERSITY SPACE
  ========================= */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-10 text-white sm:px-6 lg:px-8">

        {university.cover_image_url && (
          <img
            src={university.cover_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-indigo-700/90 to-purple-800/90" />

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10" />

        <div className="relative mx-auto max-w-7xl">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Logo */}

            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white p-3 shadow-xl">

              {university.logo_url ? (
                <img
                  src={university.logo_url}
                  alt={university.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2
                  size={48}
                  className="text-blue-600"
                />
              )}

            </div>


            {/* University information */}

            <div className="min-w-0">

              <p className="text-sm font-medium text-blue-100">
                UniShare University Space
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                {university.name}
              </h1>

              {university.short_name && (
                <p className="mt-2 text-blue-100">
                  {university.short_name}
                </p>
              )}

              {university.city && (
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
                  <MapPin size={17} />
                  <span>{university.city}</span>
                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CONTENT
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


        {/* =========================
            STATS
        ========================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              الكليات
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              0
            </p>
          </div>


          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              التخصصات
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              0
            </p>
          </div>


          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              المنشورات
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              0
            </p>
          </div>

        </div>


        {/* =========================
            UNIVERSITY DESCRIPTION
        ========================= */}

        {university.description && (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <FileText size={22} />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                نبذة عن الجامعة
              </h2>

            </div>

            <p className="mt-5 whitespace-pre-line leading-8 text-gray-600 dark:text-gray-300">
              {university.description}
            </p>

          </div>
        )}


        {/* =========================
            UNIVERSITY INFORMATION
        ========================= */}

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Building2 size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  معلومات الجامعة
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  البيانات التعريفية والمؤسسية
                </p>
              </div>

            </div>

          </div>


          {/* Basic information */}

          {informationItems.length > 0 && (
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {informationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-gray-900 dark:text-blue-400">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>

                      <p className="mt-2 break-words font-semibold text-gray-900 dark:text-white">
                        {item.value}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          )}


          {/* Contact information */}

          {(university.website_url ||
            university.official_email ||
            university.phone) && (

            <div className="mt-8 border-t border-gray-100 pt-7 dark:border-gray-800">

              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                معلومات التواصل الرسمية
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Website */}

                {university.website_url && (
                  <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-5 dark:border-gray-800">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <Globe size={21} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        الموقع الإلكتروني
                      </p>

                      <a
                        href={
                          /^https?:\/\//i.test(university.website_url)
                            ? university.website_url
                            : `https://${university.website_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex max-w-full items-center gap-2 break-all font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <span>
                          {university.website_url}
                        </span>

                        <ExternalLink
                          size={15}
                          className="shrink-0"
                        />
                      </a>

                    </div>

                  </div>
                )}


                {/* Email */}

                {university.official_email && (
                  <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-5 dark:border-gray-800">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <Mail size={21} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        البريد الإلكتروني الرسمي
                      </p>

                      <a
                        href={`mailto:${university.official_email}`}
                        className="mt-2 block break-all font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        {university.official_email}
                      </a>

                    </div>

                  </div>
                )}


                {/* Phone */}

                {university.phone && (
                  <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-5 dark:border-gray-800">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <Phone size={21} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        رقم الهاتف
                      </p>

                      <a
                        href={`tel:${university.phone.replace(/[^\d+]/g, "")}`}
                        className="mt-2 block font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        {university.phone}
                      </a>

                    </div>

                  </div>
                )}

              </div>

            </div>
          )}


          {/* Empty state */}

          {informationItems.length === 0 &&
            !university.website_url &&
            !university.official_email &&
            !university.phone && (
              <div className="mt-7 rounded-2xl bg-gray-50 p-6 text-center dark:bg-gray-950">
                <Building2 className="mx-auto text-gray-400" size={30} />

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  لا توجد معلومات تعريفية إضافية لهذه الجامعة حالياً.
                </p>
              </div>
            )}

        </div>


        {/* =========================
            ACADEMIC STRUCTURE
        ========================= */}

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <GraduationCap size={25} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              الفضاء الأكاديمي
            </h2>

          </div>

          <p className="mt-4 leading-7 text-gray-500 dark:text-gray-400">
            سيتم هنا تنظيم الكليات والتخصصات والمستويات والوحدات والمواد الخاصة بهذه الجامعة.
          </p>

        </div>

      </section>

    </main>
  );
}
