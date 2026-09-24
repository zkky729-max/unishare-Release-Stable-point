import {
  ArrowLeft,
  BookOpen,
  Building2,
  Globe,
  GraduationCap,
  Mail,
  Phone,
  Users,
  University,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UniShareLogo from "../../../components/brand/UniShareLogo";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center px-3 sm:h-20 sm:px-6 lg:px-8">
          {/* أزرار الحساب */}

          <div className="absolute left-3 z-20 flex items-center gap-1.5 sm:left-6 sm:gap-3 lg:left-8">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg px-2.5 py-2 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-100 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-2.5 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:shadow-md sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
            >
              إنشاء حساب
            </button>
          </div>

          {/* الشعار في المنتصف */}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="UniShare"
              className="pointer-events-auto relative z-30 flex scale-[0.55] items-center justify-center rounded-xl p-1 transition hover:scale-[0.58] sm:scale-100 sm:hover:scale-[1.02]"
            >
              <UniShareLogo />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="pt-16 sm:pt-20">
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />

          <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-4xl text-center">
              {/* الشعار الرمزي */}

              <div className="mb-7 flex justify-center">
                <UniShareLogo
                  showText={false}
                  className="drop-shadow-sm"
                />
              </div>

              {/* الشارة */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm">
                <GraduationCap size={18} />

                من المعرفة يبدأ الطريق
              </div>

              {/* العنوان */}

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                ابنِ مستقبلك

                <span className="mt-2 block bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                  بالعلم والنور
                </span>
              </h1>

              {/* الوصف */}

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600">
                الجامعة ليست مجرد سنوات دراسية، بل مرحلة تبني فيها
                معرفتك وشخصيتك ومستقبلك. تعلّم، شارك ما تعرفه، واستفد
                من معرفة الآخرين، وابنِ طريقك خطوة بعد خطوة.
              </p>

              {/* الأزرار */}

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/universities")}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-7 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                >
                  اكتشف مسارك الدراسي

                  <ArrowLeft
                    size={19}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-7 py-4 font-bold text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
                >
                  ابدأ رحلتك
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            ACADEMIC PATH
        =================================================== */}

        <section className="border-y border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
                طريقك الأكاديمي
              </p>

              <h2 className="mt-3 text-3xl font-extrabold">
                ابدأ من جامعتك وابنِ طريقك
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                اكتشف المسار الأكاديمي بطريقة منظمة، من الجامعة والكلية
                إلى القسم والتخصص والمقررات والدروس.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* الجامعات */}

              <button
                type="button"
                onClick={() => navigate("/universities")}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 text-right transition hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <University size={24} />
                </div>

                <h3 className="font-bold">الجامعات</h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  ابدأ من المؤسسة الجامعية التي تنتمي إليها.
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
                  استكشف

                  <ArrowLeft
                    size={17}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </div>
              </button>

              {/* الكليات */}

              <button
                type="button"
                onClick={() => navigate("/faculties")}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 text-right transition hover:-translate-y-1 hover:border-indigo-100 hover:bg-indigo-50 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Building2 size={24} />
                </div>

                <h3 className="font-bold">الكليات</h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  تعرّف على الكليات والمسارات الموجودة فيها.
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  استكشف

                  <ArrowLeft
                    size={17}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </div>
              </button>

              {/* مجتمع المعرفة */}

              <button
                type="button"
                onClick={() => navigate("/posts")}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 text-right transition hover:-translate-y-1 hover:border-cyan-100 hover:bg-cyan-50 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                  <Users size={24} />
                </div>

                <h3 className="font-bold">مجتمع المعرفة</h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  شارك المعرفة وساعد زملاءك في رحلتهم الدراسية.
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-600">
                  شارك المعرفة

                  <ArrowLeft
                    size={17}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================
            VALUES
        =================================================== */}

        <section className="bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
                فلسفة UniShare
              </p>

              <h2 className="mt-3 text-3xl font-extrabold">
                العلم يبني الإنسان قبل أن يبني المستقبل
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                المعرفة الحقيقية لا تجعل الإنسان يتعالى على غيره،
                بل تمنحه القدرة على التعلم المستمر ومشاركة الخير
                ومساعدة من حوله.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {/* العلم */}

              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <BookOpen size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold">اطلب العلم</h3>

                <p className="mt-3 leading-7 text-gray-600">
                  اجعل التعلم رحلة مستمرة، وابحث عن الفهم والمعرفة
                  قبل أي شيء آخر.
                </p>
              </div>

              {/* بناء المستقبل */}

              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <GraduationCap size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold">ابنِ مستقبلك</h3>

                <p className="mt-3 leading-7 text-gray-600">
                  كل درس وكل مهارة وكل تجربة هي لبنة جديدة في
                  المستقبل الذي تعمل على بنائه.
                </p>
              </div>

              {/* التواضع */}

              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                  <Users size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold">تعلّم بتواضع</h3>

                <p className="mt-3 leading-7 text-gray-600">
                  مهما تعلمنا، يبقى هناك ما يمكن أن نتعلمه من
                  الآخرين. المعرفة تكبر عندما نتشاركها.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            ACADEMIC JOURNEY
        =================================================== */}

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
            <div className="rounded-[2rem] border border-gray-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8 sm:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
                  رحلتك الدراسية
                </p>

                <h2 className="mt-3 text-3xl font-extrabold">
                  من الجامعة إلى الدرس
                </h2>

                <p className="mt-5 leading-8 text-gray-600">
                  اجعل طريقك الدراسي واضحًا ومنظمًا، وانتقل من المرحلة
                  الأكبر إلى التفاصيل التي تحتاجها في رحلتك التعليمية.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white px-5 py-3 shadow-sm">
                  الجامعة
                </span>

                <ArrowLeft size={17} className="text-blue-400" />

                <span className="rounded-full bg-white px-5 py-3 shadow-sm">
                  الكلية
                </span>

                <ArrowLeft size={17} className="text-blue-400" />

                <span className="rounded-full bg-white px-5 py-3 shadow-sm">
                  القسم
                </span>

                <ArrowLeft size={17} className="text-blue-400" />

                <span className="rounded-full bg-white px-5 py-3 shadow-sm">
                  التخصص
                </span>

                <ArrowLeft size={17} className="text-blue-400" />

                <span className="rounded-full bg-white px-5 py-3 shadow-sm">
                  المقياس
                </span>

                <ArrowLeft size={17} className="text-blue-400" />

                <span className="rounded-full bg-white px-5 py-3 shadow-sm">
                  الدرس
                </span>
              </div>

              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/universities")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  ابدأ من جامعتك

                  <ArrowLeft size={19} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            FINAL CTA
        =================================================== */}

        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 px-8 py-16 text-center text-white shadow-xl lg:px-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              ابنِ مستقبلك بالعلم والنور
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-50">
              ابدأ رحلتك الأكاديمية، تعلّم باستمرار، شارك معرفتك،
              وابقَ متواضعًا مهما وصلت.
            </p>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-8 rounded-2xl bg-white px-8 py-4 font-bold text-indigo-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              ابدأ رحلتك
            </button>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            {/* الشعار */}

            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="UniShare"
              className="flex items-center justify-center"
            >
              <UniShareLogo />
            </button>

            {/* معلومات التواصل */}

            <div className="flex flex-col items-center gap-4 text-sm text-gray-500 sm:items-end">
              <p className="font-semibold text-gray-700">
                تواصل معنا
              </p>

              <div className="flex flex-col items-center gap-3 sm:items-end">
                <a
                  href="mailto:support.unishare@gmail.com"
                  className="flex items-center gap-2 transition hover:text-blue-600"
                >
                  <Mail size={17} />
                  <span>support.unishare@gmail.com</span>
                </a>

                <a
                  href="tel:+213553469772"
                  className="flex items-center gap-2 transition hover:text-blue-600"
                  dir="ltr"
                >
                  <Phone size={17} />
                  <span>+213 553 469 772</span>
                </a>

                <a
                  href="https://www.facebook.com/share/1AiFhbNdag/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-blue-600"
                >
                  <Globe size={17} />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} UniShare. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
