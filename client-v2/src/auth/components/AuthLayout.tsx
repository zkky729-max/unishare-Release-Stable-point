
import {
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  Sparkles,
  Atom,
  Orbit,
  Lightbulb,
  ArrowUpLeft,
} from "lucide-react";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: Props) {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#070B1A] text-white"
    >
      {/* الخلفية التقنية */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(59,130,246,0.22),transparent_40%),radial-gradient(ellipse_at_85%_85%,rgba(124,58,237,0.2),transparent_40%)]" />

        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(148,163,184,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.5)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full border border-blue-400/10" />
        <div className="absolute -top-24 -right-24 h-[340px] w-[340px] rounded-full border border-indigo-400/10" />
        <div className="absolute -bottom-48 -left-40 h-[550px] w-[550px] rounded-full border border-purple-400/10" />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* الجانب التعريفي */}
        <section className="relative hidden lg:flex flex-col justify-between overflow-hidden px-12 py-12 xl:px-20">

          <div>
            {/* شعار المنصة */}
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg shadow-blue-950/30 backdrop-blur-xl">
                <GraduationCap size={32} className="text-cyan-300" />
                <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full border-2 border-[#10152A] bg-blue-400" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  UniShare
                </h1>
                <p className="mt-1 text-xs font-medium tracking-[0.2em] text-blue-200/70">
                  KNOWLEDGE CONNECTS US
                </p>
              </div>
            </div>

            {/* العنوان الرئيسي */}
            <div className="mt-20 max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-sm text-cyan-200">
                <Sparkles size={15} />
                <span>مساحة جديدة لمستقبل التعليم</span>
              </div>

              <h2 className="text-5xl font-black leading-[1.35] xl:text-6xl">
                المعرفة
                <br />
                <span className="bg-gradient-to-l from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  أقوى عندما
                  <br />
                  نتشاركها.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-lg leading-9 text-slate-300">
                UniShare تجمع الطلبة والمعرفة والفرص في
                فضاء جامعي رقمي واحد، لتتعلم وتشارك
                وتبني مستقبلك مع مجتمعك.
              </p>
            </div>

            {/* عناصر المنظومة */}
            <div className="mt-14 grid max-w-xl grid-cols-2 gap-4">

              <Feature
                icon={<BookOpen size={22} />}
                title="المعرفة الأكاديمية"
                description="دروس وملخصات وموارد منظمة"
                color="text-cyan-300"
              />

              <Feature
                icon={<Users size={22} />}
                title="المجتمع الطلابي"
                description="تعاون وتبادل الخبرات"
                color="text-violet-300"
              />

              <Feature
                icon={<Building2 size={22} />}
                title="البيئة الجامعية"
                description="جامعات وكليات وتخصصات"
                color="text-blue-300"
              />

              <Feature
                icon={<Lightbulb size={22} />}
                title="الأفكار والمبادرات"
                description="مساحة للإبداع والمشاركة"
                color="text-amber-300"
              />

            </div>
          </div>

          {/* العنصر العلمي البصري */}
          <div className="relative mt-12 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Atom size={19} className="text-cyan-300" />
              <span>نتعلم. نتشارك. نتطور.</span>
            </div>

            <span className="text-xs tracking-widest text-slate-500">
              THE FUTURE IS SHARED
            </span>
          </div>

          {/* الزخرفة العلمية */}
          <div className="pointer-events-none absolute left-[-100px] top-[30%] opacity-[0.12]">
            <Orbit size={360} strokeWidth={0.5} />
          </div>

        </section>

        {/* منطقة النموذج */}
        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:border-r lg:border-white/[0.07] lg:bg-white/[0.015]">

          {/* إضاءة خلف البطاقة */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.10] blur-[120px]" />

          <div className="relative w-full max-w-[470px]">

            {/* شعار الهاتف */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <GraduationCap size={28} className="text-cyan-300" />
              </div>

              <div>
                <h1 className="text-2xl font-black">UniShare</h1>
                <p className="text-[10px] tracking-[0.18em] text-blue-200/60">
                  KNOWLEDGE CONNECTS US
                </p>
              </div>
            </div>

            {/* البطاقة */}
            <div className="overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#11182D]/90 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

              {/* الشريط العلوي */}
              <div className="h-1.5 w-full bg-gradient-to-l from-cyan-400 via-blue-500 to-violet-500" />

              <div className="p-6 sm:p-9">

                {/* رأس النموذج */}
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-cyan-300">
                    <Sparkles size={23} />
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-white">
                    {title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {subtitle}
                  </p>
                </div>

                {/* محتوى الصفحة */}
                {children}

              </div>
            </div>

            {/* التذييل */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ArrowUpLeft size={14} />
              <span>مساحة جامعية تجمعنا بالمعرفة</span>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
  color,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.07]">
      <div className={`shrink-0 ${color}`}>
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
