import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Compass,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Lightbulb,
  Network,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Target,
  Eye,
  MessageCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import UniShareLogo from "../../../components/brand/UniShareLogo";

const values = [
  {
    title: "التعاون والعمل الجماعي",
    description: "نؤمن أن بناء المعرفة وتطوير التعليم مسؤولية مشتركة تقوم على تبادل الخبرات وتكامل الجهود.",
    icon: Users,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "الجودة والمصداقية الأكاديمية",
    description: "نحرص على أن يكون المحتوى واضحاً وموثوقاً، وأن يخضع للمراجعة قبل تقديمه للطلبة.",
    icon: ShieldCheck,
    color: "from-violet-500 to-indigo-400",
  },
  {
    title: "الابتكار والتطوير المستمر",
    description: "نبحث باستمرار عن طرق وأدوات أفضل لتطوير التجربة التعليمية وتحسين العمل.",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-400",
  },
  {
    title: "الشفافية والمسؤولية",
    description: "نعمل بوضوح، ونقدّر الالتزام، ونتحمّل مسؤولية القرارات والمهام التي نتولاها.",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-400",
  },
  {
    title: "التعلم وتبادل الخبرات",
    description: "نعتبر كل مساهمة فرصة للتعلم، ونشجع مشاركة المعرفة ونقل الخبرات بين الأعضاء.",
    icon: GraduationCap,
    color: "from-cyan-500 to-sky-400",
  },
  {
    title: "الانفتاح وتكافؤ الفرص",
    description: "نرحب بالأفكار والمهارات المختلفة، ونؤمن بأن لكل شخص فرصة للمساهمة والتطور.",
    icon: Globe2,
    color: "from-pink-500 to-fuchsia-400",
  },
];

const teams = [
  {
    number: "01",
    title: "فريق جمع المحتوى",
    subtitle: "المصادر والمحتوى الأكاديمي",
    description:
      "يساهم في جمع وتنظيم المحتوى المرتبط بالمقاييس الجامعية، والتواصل بشأن المواد والمصادر التي تساعد على بناء مرجع أكاديمي منظم.",
    tasks: [
      "جمع الدروس والوثائق والمراجع المتاحة",
      "ترتيب المحتوى حسب الجامعة والتخصص والمقياس",
      "متابعة اكتمال المواد والملفات الأساسية",
    ],
    skills: "التنظيم، البحث، الدقة، والتواصل",
    icon: BookOpen,
    color: "blue",
  },
  {
    number: "02",
    title: "فريق التنسيق الأكاديمي",
    subtitle: "التعاون مع الأساتذة",
    description:
      "ينسق التعاون مع أساتذة المواد، ويساعد على توضيح برنامج المادة ومنهجيتها واحتياجاتها، ليكون الأستاذ شريكاً في إنتاج المعرفة.",
    tasks: [
      "التواصل والتنسيق مع الأساتذة",
      "متابعة برامج المواد ومنهجيات تدريسها",
      "نقل الملاحظات والاحتياجات بين الأستاذ وفرق العمل",
    ],
    skills: "التواصل، التنسيق، الفهم الأكاديمي، والمتابعة",
    icon: GraduationCap,
    color: "violet",
  },
  {
    number: "03",
    title: "فريق المعالجة بالذكاء الاصطناعي",
    subtitle: "تطوير المحتوى التعليمي",
    description:
      "يساهم في توظيف أدوات الذكاء الاصطناعي لمعالجة المحتوى الأكاديمي وتطويره وتلخيصه وتكييفه، مع مراعاة توجيهات الأستاذ.",
    tasks: [
      "معالجة المحتوى وتنظيمه",
      "إعداد ملخصات وصيغ تعليمية مساعدة",
      "تكييف المحتوى وفق احتياجات الطلبة والمادة",
    ],
    skills: "أدوات الذكاء الاصطناعي، التحليل، والصياغة",
    icon: BrainCircuit,
    color: "cyan",
  },
  {
    number: "04",
    title: "فريق المراجعة والجودة",
    subtitle: "التدقيق والتحقق",
    description:
      "يراجع المحتوى الناتج ويتحقق من وضوحه واتساقه وجودته قبل تقديمه للطلبة، مع إحالة المسائل الأكاديمية إلى الأستاذ عند الحاجة.",
    tasks: [
      "مراجعة الدقة والوضوح والتنظيم",
      "رصد الأخطاء والنواقص والتناقضات",
      "متابعة الملاحظات والتحسينات قبل النشر",
    ],
    skills: "التدقيق، التفكير النقدي، والدقة الأكاديمية",
    icon: ShieldCheck,
    color: "emerald",
  },
  {
    number: "05",
    title: "فريق التصميم والإخراج",
    subtitle: "تقديم المحتوى بصورة واضحة",
    description:
      "يعمل على تحسين الشكل البصري وطريقة عرض المواد، لتكون أكثر وضوحاً وتنظيماً وسهولة في الاستخدام.",
    tasks: [
      "تنسيق وإخراج الملفات التعليمية",
      "إعداد العناصر والمواد البصرية المساندة",
      "تحسين قابلية القراءة وتجربة عرض المحتوى",
    ],
    skills: "التصميم، التنسيق، الإخراج، والاهتمام بالتفاصيل",
    icon: Palette,
    color: "pink",
  },
];

const offerings = [
  {
    title: "المحتوى الأكاديمي",
    description: "تنظيم المعرفة والمواد الجامعية في مسارات مترابطة تسهّل الوصول إليها والاستفادة منها.",
    icon: BookOpen,
  },
  {
    title: "التعاون مع الأساتذة",
    description: "بناء شراكات أكاديمية مستمرة يكون فيها الأستاذ مرجعاً وشريكاً في تطوير محتوى مادته.",
    icon: HeartHandshake,
  },
  {
    title: "الحلول التعليمية الذكية",
    description: "توظيف التقنيات الحديثة والذكاء الاصطناعي للمساعدة في معالجة المحتوى وتطويره.",
    icon: BrainCircuit,
  },
  {
    title: "المجتمع الجامعي",
    description: "مساحة للتواصل وتبادل المعرفة والخبرات والتعاون بين أفراد المجتمع الجامعي.",
    icon: Network,
  },
  {
    title: "المبادرات والمشاريع",
    description: "فتح المجال أمام الأفكار والمبادرات التي تسهم في تطوير التعليم والعمل الأكاديمي.",
    icon: Workflow,
  },
];

const differentiators = [
  "التعاون المستمر مع الأساتذة، لا الاكتفاء بجمع المحتوى.",
  "استخدام الذكاء الاصطناعي للمساعدة في معالجة المعرفة وتطويرها.",
  "مراجعة بشرية للمحتوى قبل تقديمه للطلبة.",
  "مجتمع يشارك أعضاؤه في بناء المنظومة وتطويرها.",
  "تكامل المنصة الجامعية مع المبادرات المجتمعية والتقنية.",
];

const colorClasses: Record<string, { icon: string; number: string; border: string }> = {
  blue: {
    icon: "bg-blue-500/15 text-blue-300",
    number: "text-blue-300",
    border: "hover:border-blue-400/40",
  },
  violet: {
    icon: "bg-violet-500/15 text-violet-300",
    number: "text-violet-300",
    border: "hover:border-violet-400/40",
  },
  cyan: {
    icon: "bg-cyan-500/15 text-cyan-300",
    number: "text-cyan-300",
    border: "hover:border-cyan-400/40",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-300",
    number: "text-emerald-300",
    border: "hover:border-emerald-400/40",
  },
  pink: {
    icon: "bg-pink-500/15 text-pink-300",
    number: "text-pink-300",
    border: "hover:border-pink-400/40",
  },
};

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#07152f] text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07152f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigate("/")} aria-label="العودة إلى الرئيسية">
            <UniShareLogo />
          </button>

          <nav className="hidden items-center gap-2 sm:flex" aria-label="التنقل الرئيسي">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-blue-300"
            >
              الرئيسية
            </button>
            <span className="rounded-xl bg-blue-500/15 px-4 py-2 text-sm font-bold text-blue-300">
              من نحن
            </span>
            <button
              type="button"
              onClick={() => navigate("/volunteer")}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-blue-300"
            >
              انضم إلينا
            </button>
          </nav>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-violet-600 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 sm:px-5 sm:text-sm"
          >
            ابدأ رحلتك
            <ArrowLeft size={16} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#07152f] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(99,102,241,0.30),transparent_35%)]" />
        <div className="absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full border border-cyan-300/10" />
        <div className="absolute -left-12 top-22 -z-10 h-48 w-48 rounded-full border border-violet-300/10" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-200 sm:text-sm">
              <Sparkles size={15} />
              تعرّف على UniShare
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.35] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-[#00E5FF]">معاً نبني تجربة</span>
              <span className="block bg-gradient-to-l from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                جامعية أكثر تعاوناً
              </span>
              <span className="text-[#00E5FF]">ومعرفة بلا حدود</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
              UniShare منظومة مجتمعية وتقنية وأكاديمية تجمع الطلبة والأساتذة والمطورين
              والمبدعين، لنتعاون في بناء مستقبل أفضل للتعليم الجامعي وإنتاج المعرفة.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/volunteer")}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl transition hover:-translate-y-1 hover:shadow-cyan-500/10"
              >
                اكتشف فرص التطوع
                <ArrowUpLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                ابدأ رحلتك مع UniShare
                <ArrowLeft size={17} />
              </button>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
            <div className="absolute inset-8 rounded-full border border-cyan-200/15" />
            <div className="absolute inset-16 rounded-full border border-violet-200/20" />
            <div className="absolute inset-24 rounded-full border border-blue-200/20" />
            <div className="absolute h-64 w-64 rounded-full bg-blue-500/150/10 blur-3xl" />
            <div className="relative flex h-44 w-44 flex-col items-center justify-center rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
              <div className="mb-3 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 p-4 text-white shadow-lg shadow-cyan-500/20">
                <Network size={38} />
              </div>
              <span className="text-2xl font-black tracking-wide">UniShare</span>
              <span className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-cyan-100">
                LEARN · CONNECT · GROW
              </span>
            </div>
            <div className="absolute right-3 top-16 rounded-2xl border border-white/10 bg-white/10 p-3 text-cyan-200 backdrop-blur-lg">
              <BookOpen size={22} />
            </div>
            <div className="absolute bottom-14 left-2 rounded-2xl border border-white/10 bg-white/10 p-3 text-violet-200 backdrop-blur-lg">
              <BrainCircuit size={22} />
            </div>
            <div className="absolute bottom-5 right-16 rounded-2xl border border-white/10 bg-white/10 p-3 text-blue-200 backdrop-blur-lg">
              <Users size={22} />
            </div>
            <div className="absolute left-12 top-8 rounded-2xl border border-white/10 bg-white/10 p-3 text-pink-200 backdrop-blur-lg">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>
      </section>

      {/* Identity and story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-extrabold text-blue-300">هويتنا وقصتنا</span>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            مساحة تجمع من أجل معرفة أفضل
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            انطلقت فكرة UniShare من إدراكنا أن الحياة الجامعية تحتاج إلى أكثر من
            أدوات متفرقة؛ تحتاج إلى تعاون مستمر يربط المعرفة بأصحابها، ويمنح أفراد
            المجتمع فرصة للمشاركة في تطويرها.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-[#0d1b35] p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-[#00E5FF]">من الفكرة إلى التعاون</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              نعمل على تحويل التحديات التي يواجهها الطالب في الوصول إلى المعرفة
              وتنظيمها إلى فرص للتعاون والعمل المشترك.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-[#0d1b35] p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-[#00E5FF]">الأستاذ شريك أساسي</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              نؤمن بأن تطوير المحتوى الأكاديمي يبدأ بالتعاون مع الأستاذ، وفهم
              برنامج مادته ومنهجيتها واحتياجات طلبته.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-[#0d1b35] p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-[#00E5FF]">التقنية في خدمة المعرفة</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              نستفيد من التقنيات الحديثة والذكاء الاصطناعي للمساعدة في معالجة
              المحتوى، مع إبقاء المراجعة البشرية والجودة في صميم العمل.
            </p>
          </article>
        </div>
      </section>

      {/* Vision and mission */}
      <section className="bg-[#0d1b35] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 to-indigo-800 p-8 text-white sm:p-10">
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full border border-white/10" />
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Eye size={28} />
              </div>
              <h2 className="text-2xl font-black">رؤيتنا</h2>
              <p className="mt-5 text-base leading-9 text-blue-50">
                الانطلاق من الجامعات الجزائرية، ثم التوسع دولياً لتصبح UniShare
                منظومة عالمية للتعاون وإنتاج المعرفة الجامعية، تفتح المجال أمام
                الجميع للمساهمة في تطوير التعليم.
              </p>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white sm:p-10">
            <div className="absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-cyan-500/150/10 blur-2xl" />
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                <Target size={28} />
              </div>
              <h2 className="text-2xl font-black">رسالتنا</h2>
              <p className="mt-5 text-base leading-9 text-slate-300">
                بناء منظومة متكاملة تجمع التعليم والتكنولوجيا والمجتمع والتعاون
                الأكاديمي، وتطور المعرفة الجامعية باستمرار من خلال إشراك الطلبة
                والأساتذة والمختصين وتوظيف التقنيات الحديثة والذكاء الاصطناعي.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <span className="text-sm font-extrabold text-blue-300">ما نؤمن به</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">قيمنا التي توجه عملنا</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            مبادئ نسترشد بها في تعاوننا وقراراتنا وطريقة بناء مجتمع UniShare.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="rounded-3xl border border-white/10 bg-[#0d1b35] p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${value.color} text-white shadow-lg`}>
                  <Icon size={23} />
                </div>
                <h3 className="text-lg font-extrabold text-[#00E5FF]">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* What makes us different */}
      <section className="bg-[#07152f] py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <span className="text-sm font-extrabold text-cyan-300">طريقتنا في العمل</span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#00E5FF] sm:text-4xl">
              ما الذي يجعل تجربة UniShare مختلفة؟
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              لا ننظر إلى المحتوى باعتباره ملفات تُجمع فحسب، بل باعتباره معرفة
              تحتاج إلى تعاون وتطوير ومراجعة حتى تصل إلى الطالب بصورة نافعة.
            </p>
          </div>
          <div className="space-y-4">
            {differentiators.map((item, index) => (
              <div key={item} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-sm font-black text-cyan-200">
                  {index + 1}
                </span>
                <p className="text-sm leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational structure */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-extrabold text-blue-300">نعمل كفريق واحد</span>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">هيكلنا التنظيمي</h2>
          <p className="mt-4 text-sm leading-8 text-slate-300">
            تتولى إدارة UniShare الإشراف العام والتنسيق بين الفرق، ويقود كل فريق
            مسؤول يتابع مهامه ويتواصل مع الإدارة. ويشارك الأعضاء والمتعاونون في
            تنفيذ الأعمال والمبادرات بحسب اختصاصاتهم.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-blue-200 bg-gradient-to-l from-blue-700 to-indigo-700 p-6 text-center text-white shadow-xl shadow-blue-900/10">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Target size={25} />
          </div>
          <h3 className="text-xl font-black">إدارة UniShare</h3>
          <p className="mt-2 text-sm leading-6 text-blue-100">الإشراف العام والتوجيه والتنسيق بين الفرق</p>
        </div>

        <div className="mx-auto h-10 w-px bg-gradient-to-b from-blue-400 to-slate-300" />
        <div className="mx-auto mb-8 h-px max-w-5xl bg-slate-600" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {teams.map((team) => {
            const Icon = team.icon;
            const colors = colorClasses[team.color];
            return (
              <article key={team.number} className={`rounded-3xl border border-white/10 bg-[#0d1b35] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${colors.number}`}>{team.number}</span>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors.icon}`}>
                    <Icon size={22} />
                  </div>
                </div>
                <h3 className="mt-5 text-base font-black leading-7 text-[#00E5FF]">{team.title}</h3>
                <p className="mt-1 text-xs font-bold text-slate-400">{team.subtitle}</p>
                <p className="mt-4 text-xs leading-6 text-slate-300">{team.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-dashed border-white/15 bg-white/[0.06] px-6 py-5 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d1b35] text-slate-300 shadow-sm">
            <Users size={21} />
          </div>
          <h3 className="font-extrabold text-[#00E5FF]">الأعضاء والمتعاونون</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            يساهمون في أعمال الفرق والمشاريع، ويتعاونون مع قادة الفرق والإدارة لتحقيق أهداف المجتمع.
          </p>
        </div>
      </section>

      {/* What we offer */}
      <section className="bg-[#0d1b35] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-extrabold text-blue-300">مجالات عملنا</span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">ماذا تقدم UniShare؟</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-300">
              خمسة محاور مترابطة نعمل من خلالها على بناء منظومة جامعية أكثر تعاوناً وتكاملاً.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="group rounded-3xl border border-white/10 bg-[#0d1b35] p-7 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-[#0d1b35] hover:shadow-xl hover:shadow-blue-950/5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={24} />
                    </div>
                    <span className="text-sm font-black text-slate-300">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-black text-[#00E5FF]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-7 text-center text-xs leading-6 text-slate-400">
            تمثل هذه المحاور مجالات عمل UniShare وتوجهاتها، وقد تختلف الخدمات المتاحة بحسب مراحل التطوير.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-l from-blue-700 via-indigo-700 to-violet-700 px-6 py-14 text-center text-white shadow-2xl shadow-blue-900/15 sm:px-12 sm:py-16">
          <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full border border-white/10" />
          <div className="relative">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <HeartHandshake size={29} />
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              المعرفة تكبر عندما نتشاركها
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-blue-100 sm:text-base">
              كن جزءاً من مجتمع يؤمن بالتعاون والتعلم والمساهمة في تطوير التعليم الجامعي.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/volunteer")}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-1"
              >
                اكتشف فرص التطوع
                <ArrowUpLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                ابدأ رحلتك مع UniShare
                <ArrowLeft size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0d1b35]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:text-right lg:px-8">
          <button type="button" onClick={() => navigate("/")} aria-label="UniShare - الرئيسية">
            <UniShareLogo />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-400">
            <button type="button" onClick={() => navigate("/")} className="transition hover:text-blue-300">الرئيسية</button>
            <span className="font-bold text-blue-300">من نحن</span>
            <button type="button" onClick={() => navigate("/volunteer")} className="transition hover:text-blue-300">انضم إلينا</button>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} UniShare. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </main>
  );
}
