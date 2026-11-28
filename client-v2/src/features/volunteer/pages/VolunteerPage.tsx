
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Handshake,
  Bot,
  Search,
  Palette,
  Star,
  Rocket,
  Lightbulb,
  Users,
  Network,
  TrendingUp,
  Check,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  GraduationCap,
  Target,
  ChevronDown,
  HeartHandshake,
  Zap,
} from "lucide-react";

const teams = [
  {
    number: "01",
    name: "فريق جمع المحتوى",
    description: "البحث عن المحتوى الأكاديمي وجمعه وتنظيمه.",
    tasks: [
      "البحث عن المصادر والمراجع الأكاديمية.",
      "جمع الدروس والمواد التعليمية وتنظيمها.",
      "تصنيف المحتوى وأرشفته.",
      "توثيق المصادر واحترام حقوق أصحابها.",
    ],
    skills: ["البحث", "التنظيم", "إدارة الملفات", "الدقة"],
    icon: BookOpen,
  },
  {
    number: "02",
    name: "فريق التنسيق الأكاديمي",
    description: "بناء جسور التعاون والتواصل مع الأساتذة.",
    tasks: [
      "التواصل مع الأساتذة والتعريف بمشروع UniShare.",
      "جمع البرامج والمنهجيات الأكاديمية.",
      "متابعة احتياجات الأساتذة ومساهماتهم.",
      "تنسيق التعاون المستمر بين الأستاذ والفريق.",
    ],
    skills: ["التواصل", "التنسيق", "العلاقات", "العمل الجماعي"],
    icon: Handshake,
  },
  {
    number: "03",
    name: "فريق المعالجة بالذكاء الاصطناعي",
    description: "تطوير المحتوى التعليمي باستخدام الأدوات الذكية.",
    tasks: [
      "استخدام أدوات الذكاء الاصطناعي لمعالجة الدروس.",
      "إعداد الملخصات وتبسيط المفاهيم.",
      "إعداد الأسئلة والتمارين التعليمية.",
      "تطوير الأوامر والأدوات مع الالتزام بمنهجية الأستاذ.",
    ],
    skills: ["الذكاء الاصطناعي", "التقنية", "التحليل", "كتابة الأوامر"],
    icon: Bot,
  },
  {
    number: "04",
    name: "فريق المراجعة والجودة",
    description: "ضمان دقة المحتوى وجودته قبل تقديمه للطلبة.",
    tasks: [
      "مراجعة المعلومات والتحقق من صحتها علمياً.",
      "التدقيق اللغوي وتحسين الصياغة.",
      "التحقق من المصادر والمراجع.",
      "مراجعة المحتوى واعتماده وفق معايير الجودة.",
    ],
    skills: ["التدقيق", "التحليل", "اللغة", "الدقة العلمية"],
    icon: Search,
  },
  {
    number: "05",
    name: "فريق التصميم والإخراج",
    description: "تحويل المحتوى إلى مواد تعليمية واضحة وجذابة.",
    tasks: [
      "تصميم وتنسيق الدروس والملخصات.",
      "إعداد الملفات والوثائق التعليمية.",
      "تصميم الرسوم والعناصر التوضيحية.",
      "توحيد الهوية البصرية وتجهيز المحتوى للنشر.",
    ],
    skills: ["التصميم", "الإبداع", "التنسيق", "الإخراج"],
    icon: Palette,
  },
];

const benefits = [
  {
    icon: Rocket,
    title: "اكتساب خبرة عملية",
    description: "المشاركة في أعمال ومشاريع حقيقية ضمن بيئة تعاونية.",
  },
  {
    icon: Lightbulb,
    title: "تطوير المهارات",
    description: "تنمية مهاراتك واكتشاف مجالات جديدة للتعلم والتطور.",
  },
  {
    icon: Users,
    title: "العمل ضمن فريق",
    description: "التعاون مع أشخاص يمتلكون اهتمامات وخبرات متنوعة.",
  },
  {
    icon: Network,
    title: "بناء شبكة علاقات",
    description: "التعرف على متعاونين ومختصين ومهتمين بمجالات مختلفة.",
  },
  {
    icon: TrendingUp,
    title: "التعلم والتطور",
    description: "اكتساب المعرفة من خلال التجربة وتبادل الخبرات.",
  },
];

const faqs = [
  {
    question: "هل يمكنني الانضمام دون خبرة؟",
    answer:
      "نعم. نرحب بالمبتدئين، ويمكنك التعلم والتطور تدريجياً بمساعدة أعضاء الفريق.",
  },
  {
    question: "هل يمكنني اختيار الفريق الذي أريد الانضمام إليه؟",
    answer:
      "نعم، يمكنك تحديد الفريق الذي يناسب اهتماماتك ومهاراتك في استمارة الانضمام، وتتم مراجعة الطلب وفق احتياجات الفريق.",
  },
  {
    question: "هل يمكنني المشاركة في أكثر من فريق؟",
    answer:
      "يمكنك التعبير عن اهتمامك بأكثر من فريق، ويُحدد نطاق مشاركتك بالتنسيق مع إدارة UniShare والفرق المعنية.",
  },
  {
    question: "هل أستطيع الانسحاب لاحقاً؟",
    answer:
      "نعم، يحق لكل عضو الانسحاب من المجتمع في أي وقت بحرية، دون الحاجة إلى تبرير قراره أو الحصول على موافقة مسبقة.",
  },
  {
    question: "كيف أعرف نتيجة طلب الانضمام؟",
    answer:
      "ستصلك رسالة تأكيد عبر البريد الإلكتروني عند استلام طلبك، ثم يتم التواصل معك لإبلاغك بالنتيجة بعد مراجعته. استلام الطلب لا يعني القبول النهائي.",
  },
  {
    question: "هل أحتاج إلى شهادة جامعية؟",
    answer:
      "لا، لا يشترط الحصول على شهادة جامعية بشكل عام. الأهم هو الاهتمام بالمساهمة والالتزام بالمهام المتفق عليها.",
  },
  {
    question: "هل يمكنني المشاركة في مهمة واحدة فقط؟",
    answer:
      "نعم، يمكنك المساهمة في مهمة أو مشروع مستقل بحسب المهام المتاحة واحتياجات المجتمع.",
  },
  {
    question: "هل توجد مكافآت؟",
    answer:
      "قد يحدد مجتمع UniShare مبادرات تقدير أو مكافآت وفق الإمكانات والقرارات المعتمدة، ولا تُعد المشاركة وعداً بمكافأة أو توظيف أو شهادة.",
  },
];

const cardClass =
  "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d3b] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-cyan-300/50 hover:shadow-[0_20px_55px_rgba(0,229,255,0.13)]";

const iconBoxClass =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-cyan-300/60 group-hover:bg-cyan-400/20";

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-14 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/5 px-4 py-2 text-sm font-bold text-cyan-300">
        <Sparkles size={15} />
        {eyebrow}
      </span>

      <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#00E5FF] sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export default function VolunteerPage() {
  const [activeTeam, setActiveTeam] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#07152f] text-white"
    >
      {/* HERO */}
      <section className="relative isolate overflow-hidden px-5 pb-28 pt-24 text-center sm:px-8 lg:pb-36 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.16),transparent_58%)]" />

        <div className="pointer-events-none absolute -right-28 top-28 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="pointer-events-none absolute -left-28 bottom-0 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.08)]">
            <HeartHandshake size={17} />
            مجتمع UniShare للتعاون والتطوع
          </span>

          <h1 className="mt-9 text-4xl font-black leading-[1.35] tracking-tight text-[#00E5FF] sm:text-5xl lg:text-7xl">
            معاً نصنع الفرق
            <br />
            <span className="bg-gradient-to-l from-cyan-200 via-[#00E5FF] to-blue-400 bg-clip-text text-transparent">
              ونبني معرفة بلا حدود
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-200 sm:text-xl">
            نؤمن أن بناء مستقبل أفضل للتعليم يحتاج إلى عقول متعاونة،
            وأفكار مبتكرة، وأشخاص مستعدين للمساهمة.
            انضم إلى مجتمع يجمع بين خدمة التعليم واكتساب الخبرة
            وبناء مشروع جماعي مستدام.
          </p>

          <div className="mt-11 flex flex-wrap justify-center gap-4">
            <Link
              to="/volunteer/apply"
              className="group inline-flex items-center gap-3 rounded-xl bg-[#00E5FF] px-8 py-4 font-extrabold text-[#07152f] shadow-[0_8px_30px_rgba(0,229,255,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-200 hover:shadow-[0_12px_40px_rgba(0,229,255,0.35)]"
            >
              <Users size={19} />
              انضم إلى مجتمعنا
              <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>

            <a
              href="#teams"
              className="group inline-flex items-center gap-3 rounded-xl border border-cyan-300/40 bg-white/[0.02] px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/80 hover:bg-cyan-400/10"
            >
              اكتشف الفرق
              <ChevronDown size={18} className="transition-transform duration-300 group-hover:translate-y-1" />
            </a>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {[
              { icon: GraduationCap, text: "خدمة التعليم" },
              { icon: Users, text: "عمل جماعي" },
              { icon: Zap, text: "أفكار مبتكرة" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:text-cyan-200"
                >
                  <Icon size={17} className="text-cyan-300" />
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative border-y border-white/10 bg-[#0b1d3b] px-5 py-20 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.045),transparent_65%)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_30px_rgba(0,229,255,0.08)]">
            <Target size={32} />
          </div>

          <h2 className="text-3xl font-extrabold text-[#00E5FF] sm:text-4xl">
            لماذا نبني هذا المجتمع؟
          </h2>

          <p className="mx-auto mt-7 max-w-4xl text-lg leading-9 text-slate-200">
            UniShare ليس مجرد منصة تعليمية، بل مجتمع من الأشخاص الذين
            يجمعهم هدف مشترك: تطوير المعرفة الجامعية وتحسين تجربة التعلم.
            نعمل مع الأساتذة والمتطوعين على جمع المحتوى الأكاديمي
            ومعالجته وتطويره ومراجعته، ثم تقديمه للطلبة بجودة أفضل.
          </p>

          <p className="mx-auto mt-5 max-w-4xl text-lg leading-9 text-slate-200">
            نريد أن تكون مساهمتك فرصة لخدمة التعليم، وتطوير مهاراتك،
            والتعلم من الآخرين، والمشاركة في بناء مشروع يستمر ويتطور
            بجهود أعضائه.
          </p>
        </div>
      </section>

      {/* TEAMS */}
      <section id="teams" className="scroll-mt-20 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="فرق العمل"
            title="لكل مهارة مكان في UniShare"
            description="تتكامل فرقنا لإنجاز العمل من جمع المحتوى إلى مراجعته وتجهيزه للنشر. اختر البطاقة للتعرف على مهام كل فريق."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team, index) => {
              const isActive = activeTeam === index;
              const TeamIcon = team.icon;

              return (
                <article
                  key={team.number}
                  className={`${cardClass} ${
                    isActive
                      ? "border-cyan-300/60 bg-[#102b50] shadow-[0_18px_50px_rgba(0,229,255,0.12)]"
                      : ""
                  }`}
                >
                  <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/0 blur-3xl transition-all duration-700 group-hover:bg-cyan-400/10" />

                  <div className="relative p-7">
                    <div className="flex items-center justify-between">
                      <div className={iconBoxClass}>
                        <TeamIcon
                          size={29}
                          strokeWidth={1.8}
                          className="text-[#00E5FF]"
                          aria-hidden="true"
                        />
                      </div>

                      <span className="rounded-lg border border-cyan-300/20 bg-cyan-400/5 px-3 py-1.5 text-sm font-extrabold tracking-wider text-cyan-300 transition-colors group-hover:border-cyan-300/50 group-hover:bg-cyan-400/10">
                        {team.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-extrabold text-[#00E5FF] transition-colors duration-300 group-hover:text-cyan-200">
                      {team.name}
                    </h3>

                    <p className="mt-4 min-h-16 leading-8 text-slate-300">
                      {team.description}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveTeam(isActive ? null : index)
                      }
                      aria-expanded={isActive}
                      className="mt-6 flex w-full items-center justify-between rounded-xl border border-cyan-300/25 bg-cyan-400/[0.04] px-5 py-3.5 font-bold text-cyan-300 transition-all duration-300 hover:border-cyan-300/60 hover:bg-cyan-400/10"
                    >
                      <span>
                        {isActive ? "إخفاء التفاصيل" : "اكتشف مهام الفريق"}
                      </span>
                      <ChevronDown
                        size={19}
                        className={`transition-transform duration-300 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isActive && (
                      <div className="mt-7 border-t border-white/10 pt-6">
                        <h4 className="flex items-center gap-2 font-extrabold text-white">
                          <Target size={17} className="text-cyan-300" />
                          المهام والمسؤوليات
                        </h4>

                        <ul className="mt-4 space-y-3">
                          {team.tasks.map((task) => (
                            <li
                              key={task}
                              className="flex gap-3 text-sm leading-7 text-slate-200"
                            >
                              <Check
                                size={18}
                                strokeWidth={2.5}
                                className="mt-1 shrink-0 text-cyan-300"
                                aria-hidden="true"
                              />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>

                        <h4 className="mt-7 flex items-center gap-2 font-extrabold text-white">
                          <Star size={17} className="text-cyan-300" />
                          مهارات مفيدة
                        </h4>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {team.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:border-cyan-300/50 hover:bg-cyan-400/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <Link
                          to="/volunteer/apply"
                          className="group/link mt-7 inline-flex items-center gap-2 font-bold text-[#00E5FF] hover:text-cyan-200"
                        >
                          أريد الانضمام إلى هذا الفريق
                          <ArrowLeft
                            size={17}
                            className="transition-transform duration-300 group-hover/link:-translate-x-1"
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            <article className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-dashed border-cyan-300/30 bg-gradient-to-br from-cyan-400/[0.08] to-[#0b1d3b] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-300/60 hover:shadow-[0_20px_55px_rgba(0,229,255,0.12)]">
              <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/0 blur-3xl transition-all duration-700 group-hover:bg-cyan-400/15" />

              <div className="relative">
                <div className={iconBoxClass}>
                  <Star
                    size={29}
                    strokeWidth={1.8}
                    className="text-[#00E5FF]"
                  />
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-[#00E5FF]">
                  الأعضاء والمتعاونون
                </h3>

                <p className="mt-4 leading-8 text-slate-300">
                  المجتمع أكبر من الفرق. نرحب بكل من يمتلك فكرة أو مهارة
                  أو رغبة في المساهمة في مهمة أو مشروع مستقل.
                </p>

                <Link
                  to="/volunteer/apply"
                  className="group/link mt-6 inline-flex items-center gap-2 font-bold text-cyan-300 hover:text-cyan-100"
                >
                  ساهم بطريقتك
                  <ArrowLeft
                    size={17}
                    className="transition-transform duration-300 group-hover/link:-translate-x-1"
                  />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative overflow-hidden bg-[#0b1d3b] px-5 py-24 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.055),transparent_65%)]" />

        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="رحلة من التعلم والمشاركة"
            title="ماذا ستستفيد من الانضمام؟"
            description="تجربة التطوع مساحة للمشاركة والتعلم والنمو."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const BenefitIcon = benefit.icon;

              return (
                <article key={benefit.title} className={cardClass}>
                  <div className="relative p-7">
                    <div className={iconBoxClass}>
                      <BenefitIcon
                        size={28}
                        strokeWidth={1.8}
                        className="text-[#00E5FF]"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-[#00E5FF] transition-colors duration-300 group-hover:text-cyan-200">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 leading-8 text-slate-300">
                      {benefit.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mx-auto mt-9 max-w-3xl text-center text-sm leading-7 text-slate-400">
            هذه فرص محتملة للتعلم والتطور، ولا تمثل وعداً بالتوظيف
            أو الحصول على مكافآت أو شهادات.
          </p>
        </div>
      </section>

      {/* BEGINNERS */}
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/5 px-4 py-2 text-sm font-bold text-cyan-300">
              <Lightbulb size={16} />
              لا يشترط أن تكون خبيراً
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#00E5FF] sm:text-4xl">
              ابدأ من حيث أنت
            </h2>

            <p className="mt-6 text-lg leading-9 text-slate-300">
              نؤمن أن المهارات تُبنى بالممارسة، وأن لكل شخص فرصة
              للتعلم والمساهمة. لذلك نرحب بالمبتدئين وأصحاب الخبرة
              على حد سواء.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-400/5 px-5 py-4 text-cyan-200">
              <GraduationCap size={24} />
              <span className="font-semibold">
                التعلم والمساهمة يسيران معاً
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              "التعريف بالمجتمع والميثاق.",
              "شرح مهام الفريق والأدوات المستخدمة.",
              "التوجيه والمرافقة من أعضاء أكثر خبرة.",
              "إسناد مهام مناسبة لمستوى العضو.",
              "التطور التدريجي حسب الاستعداد والكفاءة.",
            ].map((item, index) => (
              <div
                key={item}
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-[#0b1d3b] p-5 transition-all duration-300 hover:translate-x-1 hover:border-cyan-300/40 hover:bg-[#102b50]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 font-extrabold text-cyan-300 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-cyan-400/20">
                  {index + 1}
                </span>
                <p className="leading-7 text-slate-200">{item}</p>
                <Check
                  size={18}
                  className="mr-auto shrink-0 text-cyan-400 opacity-40 transition-opacity group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOINING PROCESS */}
      <section className="border-y border-white/10 bg-[#0b1d3b] px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="خطوات واضحة"
            title="كيف تنضم إلى مجتمعنا؟"
            description="رحلة انضمام منظمة تبدأ بطلبك وتنتهي بالتعرف على فريقك ومهامك."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["01", "تقديم الطلب", "املأ استمارة الانضمام وحدد اهتماماتك.", Users],
              ["02", "مراجعة الطلب", "تراجع الإدارة طلبك وفق احتياجات المجتمع.", Search],
              ["03", "مقابلة عند الحاجة", "قد يتم التواصل معك لمناقشة بعض التفاصيل.", Handshake],
              ["04", "اتخاذ القرار", "يتم إبلاغك بنتيجة مراجعة طلبك.", Check],
              ["05", "التعريف والتوجيه", "تتعرف على الفريق والمهام وأدوات العمل.", GraduationCap],
            ].map(([number, title, description, Icon]) => {
              const StepIcon = Icon as typeof Users;

              return (
                <article
                  key={number as string}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#07152f] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-300/40 hover:shadow-[0_18px_45px_rgba(0,229,255,0.10)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-cyan-300/70 transition-colors duration-300 group-hover:text-cyan-200">
                      {number as string}
                    </span>

                    <div className={iconBoxClass}>
                      <StepIcon size={24} className="text-[#00E5FF]" />
                    </div>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-white transition-colors group-hover:text-cyan-200">
                    {title as string}
                  </h3>

                  <p className="mt-3 leading-8 text-slate-300">
                    {description as string}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-center leading-8 text-slate-400">
            نستقبل طلبات الانضمام طوال السنة، وقد يتوقف استقبال الطلبات
            لفريق معين عند اكتمال احتياجاته. أما المساهمات المستقلة
            فترتبط بالمهام والمشاريع المتاحة.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="نجيب عن استفساراتك"
            title="الأسئلة الشائعة"
            description="كل ما تحتاج معرفته قبل تقديم طلب الانضمام."
          />

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <article
                  key={faq.question}
                  className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "border-cyan-300/40 bg-[#102b50] shadow-[0_10px_30px_rgba(0,229,255,0.07)]"
                      : "border-white/10 bg-[#0b1d3b] hover:border-cyan-300/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-right"
                  >
                    <span className="font-bold leading-8 text-[#00E5FF]">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-cyan-400 text-[#07152f]"
                          : "bg-cyan-400/10 text-cyan-300"
                      }`}
                    >
                      {isOpen ? (
                        <Minus size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <p className="border-t border-white/10 px-5 py-5 leading-8 text-slate-300">
                      {faq.answer}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24 sm:px-8">
        <div className="group relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-[#103b68] via-[#102b50] to-[#0b1d3b] px-7 py-16 text-center shadow-[0_20px_70px_rgba(0,229,255,0.07)] sm:px-12">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px] transition-all duration-700 group-hover:bg-cyan-400/20" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-blue-400/10 blur-[90px]" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-300 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
              <HeartHandshake size={32} />
            </div>

            <h2 className="mt-7 text-3xl font-extrabold text-[#00E5FF] sm:text-5xl">
              مكانك بيننا
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-slate-200">
              لا تنتظر أن تكون خبيراً حتى تبدأ. شارك بما تعرف،
              وتعلم ما لا تعرف، وساهم معنا في بناء مستقبل أفضل للمعرفة.
            </p>

            <Link
              to="/volunteer/apply"
              className="group/button mt-9 inline-flex items-center gap-3 rounded-xl bg-[#00E5FF] px-9 py-4 font-extrabold text-[#07152f] shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-200 hover:shadow-cyan-500/30"
            >
              قدّم طلب الانضمام الآن
              <ArrowLeft
                size={19}
                className="transition-transform duration-300 group-hover/button:-translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
