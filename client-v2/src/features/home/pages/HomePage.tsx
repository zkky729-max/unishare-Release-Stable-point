
import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  BookMarked,
  Building2,
  CheckCircle2,
  GraduationCap,
  Globe,
  HeartHandshake,
  Layers3,
  Lightbulb,
  Mail,
  Network,
  Phone,
  Sparkles,
  Users,
  University,
  Orbit,
  Atom,
  BrainCircuit,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import UniShareLogo from "../../../components/brand/UniShareLogo";

const knowledgeNodes = [
  {
    title: "التعلّم",
    subtitle: "اكتشف المعرفة",
    icon: BookOpen,
    color: "blue",
    position: "node-one",
  },
  {
    title: "المشاركة",
    subtitle: "انشر أفكارك",
    icon: Lightbulb,
    color: "violet",
    position: "node-two",
  },
  {
    title: "التواصل",
    subtitle: "تواصل مع مجتمعك",
    icon: Users,
    color: "cyan",
    position: "node-three",
  },
  {
    title: "التطوّر",
    subtitle: "اصنع مستقبلك",
    icon: GraduationCap,
    color: "fuchsia",
    position: "node-four",
  },
];

const academicSteps = [
  {
    title: "الجامعة",
    subtitle: "مؤسستك الجامعية",
    icon: University,
    color: "bg-blue-500",
  },
  {
    title: "الكلية والقسم",
    subtitle: "المجال الأكاديمي",
    icon: Building2,
    color: "bg-violet-500",
  },
  {
    title: "التخصص والمستوى",
    subtitle: "مسارك الدراسي",
    icon: GraduationCap,
    color: "bg-cyan-500",
  },
  {
    title: "السداسي والمقياس",
    subtitle: "المواد التعليمية",
    icon: Layers3,
    color: "bg-fuchsia-500",
  },
  {
    title: "الدروس والمحتوى",
    subtitle: "مساحة التعلم والمشاركة",
    icon: BookMarked,
    color: "bg-emerald-500",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#f8faff] text-slate-900"
    >
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes node-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes core-pulse {
          0%, 100% {
            box-shadow: 0 0 25px rgba(59,130,246,.22),
                        0 0 70px rgba(99,102,241,.12);
          }
          50% {
            box-shadow: 0 0 45px rgba(34,211,238,.38),
                        0 0 110px rgba(124,58,237,.25);
          }
        }

        @keyframes particle-glow {
          0%, 100% { opacity: .35; }
          50% { opacity: 1; }
        }

        @keyframes line-flow {
          to { stroke-dashoffset: -100; }
        }

        @keyframes soft-entrance {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .unishare-orbit-one {
          animation: orbit-spin 28s linear infinite;
          transform-origin: center;
        }

        .unishare-orbit-two {
          animation: orbit-reverse 36s linear infinite;
          transform-origin: center;
        }

        .unishare-orbit-three {
          animation: orbit-spin 48s linear infinite;
          transform-origin: center;
        }

        .unishare-node-float {
          animation: node-float 5s ease-in-out infinite;
        }

        .unishare-node-delay {
          animation-delay: -2.5s;
        }

        .unishare-core {
          animation: core-pulse 4s ease-in-out infinite;
        }

        .unishare-particle {
          animation: particle-glow 3s ease-in-out infinite;
        }

        .unishare-flow-line {
          stroke-dasharray: 5 12;
          animation: line-flow 8s linear infinite;
        }

        .unishare-entrance {
          animation: soft-entrance .8s ease-out both;
        }

        .unishare-entrance-delay {
          animation-delay: .2s;
        }

        @media (prefers-reduced-motion: reduce) {
          .unishare-orbit-one,
          .unishare-orbit-two,
          .unishare-orbit-three,
          .unishare-node-float,
          .unishare-core,
          .unishare-particle,
          .unishare-flow-line,
          .unishare-entrance {
            animation: none !important;
          }
        }
      `}</style>

      {/* NAVBAR */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/90 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
        <div className="mx-auto grid h-[68px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-3 sm:h-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-xl px-2.5 py-2 text-[11px] font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:px-5 sm:py-3 sm:text-sm"
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-xl bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 px-3 py-2.5 text-[11px] font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:px-5 sm:py-3 sm:text-sm"
            >
              إنشاء حساب
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="UniShare"
            className="flex items-center justify-center rounded-xl p-1 transition hover:scale-[1.03]"
          >
            <span className="scale-[0.57] sm:scale-100">
              <UniShareLogo />
            </span>
          </button>

          <div aria-hidden="true" />
        </div>
      </header>

      <main className="pt-[68px] sm:pt-20">
        {/* HERO - KNOWLEDGE UNIVERSE */}

        <section className="relative isolate overflow-hidden bg-[#070d27] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(37,99,235,0.28),transparent_38%),radial-gradient(ellipse_at_85%_75%,rgba(124,58,237,0.25),transparent_42%)]" />

          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(148,163,184,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.25)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full border border-blue-400/10" />
          <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full border border-blue-400/10" />
          <div className="pointer-events-none absolute -bottom-48 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:px-8 lg:py-24">
            {/* Hero Text */}

            <div className="relative z-10 text-center lg:text-right">
              <div className="unishare-entrance mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-200 shadow-lg shadow-blue-950/20 backdrop-blur sm:text-sm">
                <Atom size={16} />
                حيث تلتقي العقول وتصنع المعرفة
              </div>

              <h1 className="unishare-entrance text-4xl font-black leading-[1.3] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                المعرفة لا تعرف
                <span className="block">الحدود.</span>

                <span className="mt-3 block bg-gradient-to-l from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  شاركها... تكبر.
                </span>
              </h1>

              <p className="unishare-entrance unishare-entrance-delay mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
                UniShare مساحة أكاديمية تجمع الطلبة والجامعات
                والأفكار في منظومة واحدة. تعلّم، شارك معرفتك،
                اكتشف مسارك، وكن جزءاً من مجتمع يصنع المستقبل.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-500 px-7 py-4 font-extrabold text-white shadow-xl shadow-blue-950/30 transition hover:-translate-y-1 hover:shadow-cyan-500/20 sm:w-auto"
                >
                  انضم إلى UniShare

                  <ArrowLeft
                    size={20}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/universities")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-7 py-4 font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/15 sm:w-auto"
                >
                  اكتشف الجامعات
                  <Globe size={18} />
                </button>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 border-t border-white/10 pt-7 lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={17} className="text-cyan-400" />
                  مجتمع طلابي
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={17} className="text-cyan-400" />
                  معرفة مشتركة
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 size={17} className="text-cyan-400" />
                  تطوّر مستمر
                </div>
              </div>
            </div>

            {/* SCIENTIFIC ORBIT */}

            <div className="relative mx-auto flex aspect-square w-full max-w-[540px] items-center justify-center">
              <div className="pointer-events-none absolute inset-[15%] rounded-full bg-blue-500/15 blur-[65px]" />
              <div className="pointer-events-none absolute inset-[28%] rounded-full bg-violet-500/15 blur-[55px]" />

              <div className="absolute inset-[7%] rounded-full border border-cyan-300/15" />
              <div className="absolute inset-[16%] rounded-full border border-blue-300/20" />

              <div className="unishare-orbit-one absolute inset-[9%] rounded-full border border-dashed border-cyan-300/30">
                <span className="absolute -top-2 left-1/2 h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_20px_5px_rgba(34,211,238,.45)]" />
              </div>

              <div className="unishare-orbit-two absolute inset-[19%] rounded-full border border-dashed border-violet-300/30">
                <span className="absolute bottom-[12%] right-[8%] h-3 w-3 rounded-full bg-violet-300 shadow-[0_0_18px_5px_rgba(167,139,250,.5)]" />
              </div>

              <div className="unishare-orbit-three absolute inset-[29%] rounded-full border border-blue-300/20">
                <span className="absolute left-[7%] top-[25%] h-2.5 w-2.5 rounded-full bg-blue-300 shadow-[0_0_16px_4px_rgba(96,165,250,.6)]" />
              </div>

              <svg
                viewBox="0 0 500 500"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="knowledge-line" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity=".8" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity=".7" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity=".8" />
                  </linearGradient>

                  <radialGradient id="knowledge-dot">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </radialGradient>
                </defs>

                <g stroke="url(#knowledge-line)" strokeWidth="1.4" opacity=".6">
                  <path d="M250 250 L250 60" />
                  <path d="M250 250 L430 180" />
                  <path d="M250 250 L375 420" />
                  <path d="M250 250 L70 340" />
                  <path d="M250 250 L100 120" />
                  <path d="M250 60 L430 180" />
                  <path d="M430 180 L375 420" />
                  <path d="M375 420 L70 340" />
                  <path d="M70 340 L100 120" />
                  <path d="M100 120 L250 60" />
                  <path d="M100 120 L375 420" />
                  <path d="M70 340 L430 180" />
                </g>

                <g className="unishare-flow-line" stroke="#67e8f9" strokeWidth="2" opacity=".8">
                  <path d="M250 250 L250 60 L430 180 L375 420 L70 340 L100 120 Z" />
                </g>

                <g fill="url(#knowledge-dot)">
                  <circle cx="250" cy="60" r="4" />
                  <circle cx="430" cy="180" r="4" />
                  <circle cx="375" cy="420" r="4" />
                  <circle cx="70" cy="340" r="4" />
                  <circle cx="100" cy="120" r="4" />
                </g>

                <g className="unishare-particle" fill="#a5f3fc">
                  <circle cx="160" cy="190" r="3" />
                  <circle cx="330" cy="130" r="2.5" />
                  <circle cx="340" cy="320" r="3" />
                  <circle cx="160" cy="370" r="2.5" />
                  <circle cx="250" cy="420" r="2" />
                </g>
              </svg>

              <div className="unishare-core relative z-10 flex h-[39%] w-[39%] items-center justify-center rounded-full border border-cyan-200/40 bg-gradient-to-br from-[#172c64] via-[#142452] to-[#101735] shadow-[0_0_55px_rgba(59,130,246,.3)]">
                <div className="absolute inset-2 rounded-full border border-white/10" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/10 to-violet-500/20" />

                <div className="relative flex flex-col items-center justify-center">
                  <div className="scale-[0.66] sm:scale-90">
                    <UniShareLogo showText={false} />
                  </div>

                  <span className="mt-1 text-[10px] font-black tracking-[0.2em] text-cyan-200 sm:text-xs">
                    UNISHARE
                  </span>

                  <span className="mt-1 text-[8px] text-blue-200/70 sm:text-[10px]">
                    KNOWLEDGE CONNECTS US
                  </span>
                </div>
              </div>

              {knowledgeNodes.map((node) => {
                const Icon = node.icon;

                const positionClasses: Record<string, string> = {
                  "node-one": "right-[42%] top-[1%]",
                  "node-two": "left-[1%] top-[35%]",
                  "node-three": "right-[1%] top-[35%]",
                  "node-four": "bottom-[1%] right-[42%]",
                };

                const colorClasses: Record<string, string> = {
                  blue: "border-blue-300/30 bg-blue-500/20 text-blue-200",
                  violet: "border-violet-300/30 bg-violet-500/20 text-violet-200",
                  cyan: "border-cyan-300/30 bg-cyan-500/20 text-cyan-200",
                  fuchsia: "border-fuchsia-300/30 bg-fuchsia-500/20 text-fuchsia-200",
                };

                return (
                  <div
                    key={node.title}
                    className={`unishare-node-float absolute z-20 ${positionClasses[node.position]}`}
                  >
                    <div className={`flex h-[58px] w-[58px] items-center justify-center rounded-2xl border shadow-xl backdrop-blur-xl transition duration-300 hover:scale-110 sm:h-[68px] sm:w-[68px] ${colorClasses[node.color]}`}>
                      <Icon size={25} />
                    </div>

                    <div className="mt-2 hidden text-center sm:block">
                      <p className="text-xs font-bold text-white">{node.title}</p>
                      <p className="mt-1 text-[9px] text-blue-200/70">{node.subtitle}</p>
                    </div>
                  </div>
                );
              })}

              <div className="unishare-node-float unishare-node-delay absolute left-[8%] top-[10%] z-20 hidden rounded-xl border border-white/15 bg-white/10 px-3 py-2 shadow-xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2 text-cyan-200">
                  <BrainCircuit size={15} />
                  <span className="text-[10px] font-bold">IDEAS</span>
                </div>
              </div>

              <div className="unishare-node-float absolute bottom-[15%] left-[8%] z-20 hidden rounded-xl border border-white/15 bg-white/10 px-3 py-2 shadow-xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2 text-violet-200">
                  <Network size={15} />
                  <span className="text-[10px] font-bold">CONNECT</span>
                </div>
              </div>

              <div className="unishare-node-float unishare-node-delay absolute right-[8%] top-[10%] z-20 hidden rounded-xl border border-white/15 bg-white/10 px-3 py-2 shadow-xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2 text-blue-200">
                  <Orbit size={15} />
                  <span className="text-[10px] font-bold">DISCOVER</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-transparent via-cyan-400/50 to-transparent" />
        </section>

        {/* ACADEMIC DISCOVERY */}

        <section className="relative bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
                  <Layers3 size={15} />
                  استكشف عالمك الأكاديمي
                </div>

                <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                  ابدأ من جامعتك.
                  <span className="block text-blue-600">
                    واكتشف كل ما تحتاجه.
                  </span>
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
                انتقل بين المراحل الأكاديمية واكتشف الكليات
                والأقسام والتخصصات، واجعل رحلتك الدراسية أكثر وضوحاً.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <button
                type="button"
                onClick={() => navigate("/universities")}
                className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-right text-white shadow-xl shadow-blue-600/10 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/20"
              >
                <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10 transition duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur">
                      <University size={28} />
                    </div>
                    <ArrowUpLeft size={24} className="text-blue-200 transition group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <h3 className="mt-10 text-2xl font-black">الجامعات</h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-blue-100">
                    اكتشف المؤسسات الجامعية وانطلق من المكان الذي
                    تبدأ فيه رحلتك الأكاديمية.
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold backdrop-blur transition group-hover:bg-white/25">
                    استكشف الجامعات
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/faculties")}
                className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-fuchsia-700 p-7 text-right text-white shadow-xl shadow-violet-600/10 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-600/20"
              >
                <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10 transition duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur">
                      <Building2 size={28} />
                    </div>
                    <ArrowUpLeft size={24} className="text-violet-200 transition group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <h3 className="mt-10 text-2xl font-black">الكليات</h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-violet-100">
                    تعرّف على الكليات والأقسام والمسارات التي
                    تمنحك فرصاً جديدة للتعلم.
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold backdrop-blur transition group-hover:bg-white/25">
                    اكتشف الكليات
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/posts")}
                className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-cyan-500 to-teal-700 p-7 text-right text-white shadow-xl shadow-cyan-600/10 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-600/20"
              >
                <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10 transition duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur">
                      <Users size={28} />
                    </div>
                    <ArrowUpLeft size={24} className="text-cyan-100 transition group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <h3 className="mt-10 text-2xl font-black">مجتمع المعرفة</h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-cyan-50">
                    شارك أفكارك ومعلوماتك، واستفد من تجارب
                    ومعارف زملائك.
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold backdrop-blur transition group-hover:bg-white/25">
                    ادخل المجتمع
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}

        <section className="relative overflow-hidden bg-[#f1f5ff] py-20 sm:py-24">
          <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm">
                <Sparkles size={15} />
                فلسفة UniShare
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                لسنا هنا لنحفظ المعلومات فقط.
                <span className="mt-2 block bg-gradient-to-l from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  بل لنصنع عقولاً تتطور.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
                نؤمن أن الجامعة بيئة للتعلم والنمو والتعاون،
                وأن المعرفة تزداد قيمة عندما تتحول إلى أثر
                إيجابي في حياة الآخرين.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <div className="group rounded-[1.75rem] border border-blue-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20 transition group-hover:rotate-6">
                  <BookOpen size={30} />
                </div>
                <div className="mt-7 text-xs font-bold uppercase tracking-widest text-blue-600">
                  01 / LEARN
                </div>
                <h3 className="mt-3 text-xl font-black">اطلب العلم</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  لا تتوقف عن السؤال والبحث والتجربة.
                  اجعل الفضول محركك نحو فهم أعمق ومعرفة أوسع.
                </p>
              </div>

              <div className="group rounded-[1.75rem] border border-violet-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-900/5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 transition group-hover:rotate-6">
                  <HeartHandshake size={30} />
                </div>
                <div className="mt-7 text-xs font-bold uppercase tracking-widest text-violet-600">
                  02 / SHARE
                </div>
                <h3 className="mt-3 text-xl font-black">شارك المعرفة</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  ما تتعلمه قد يكون سبباً في نجاح شخص آخر.
                  المعرفة الحقيقية تنمو بالمشاركة.
                </p>
              </div>

              <div className="group rounded-[1.75rem] border border-cyan-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-900/5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/20 transition group-hover:rotate-6">
                  <Lightbulb size={30} />
                </div>
                <div className="mt-7 text-xs font-bold uppercase tracking-widest text-cyan-600">
                  03 / GROW
                </div>
                <h3 className="mt-3 text-xl font-black">تطوّر باستمرار</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  ابنِ مهاراتك وشخصيتك، وكن مستعداً
                  لصناعة فرص جديدة في مستقبلك.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ACADEMIC JOURNEY */}

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-bold text-cyan-700">
                  <Network size={15} />
                  رحلتك الأكاديمية
                </div>

                <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                  كل خطوة تقرّبك
                  <span className="block text-blue-600">من هدفك.</span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-8 text-slate-500 sm:text-base">
                  من المؤسسة الجامعية إلى التفاصيل الدقيقة
                  في مسارك الدراسي، يساعدك UniShare على اكتشاف
                  الهيكل الأكاديمي والوصول إلى المحتوى الذي تبحث عنه.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/universities")}
                  className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
                >
                  اكتشف مسارك الآن
                  <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
                </button>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#101a45] via-[#172b64] to-[#263c82] p-6 text-white shadow-2xl shadow-blue-900/15 sm:p-8">
                <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-200">
                      YOUR ACADEMIC PATH
                    </p>
                    <h3 className="mt-2 text-xl font-black">مسارك الدراسي</h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                    <GraduationCap size={27} />
                  </div>
                </div>

                <div className="relative mt-8 space-y-3">
                  {academicSteps.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 backdrop-blur transition hover:translate-x-1 hover:bg-white/[0.12]"
                      >
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color} shadow-lg`}>
                          <Icon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="mt-1 text-[11px] text-blue-200">
                            {item.subtitle}
                          </p>
                        </div>

                        <span className="text-xs font-bold text-blue-200/60">
                          0{index + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}

        <section className="relative overflow-hidden bg-[#080e2a] px-5 py-20 text-white sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,0.3),transparent_55%)]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-blue-500 to-violet-600 shadow-xl shadow-blue-900/30">
              <Sparkles size={30} />
            </div>

            <p className="mt-7 text-xs font-bold tracking-[0.25em] text-cyan-300">
              YOUR NEXT CHAPTER STARTS HERE
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              لا تنتظر أن يتغير المستقبل.
              <span className="mt-2 block bg-gradient-to-l from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                كن جزءاً من صناعته.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
              انضم إلى مجتمع يقدّر العلم، يشجع التعاون،
              ويؤمن بأن لكل طالب فكرة تستحق أن تُشارك.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-extrabold text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:shadow-white/10"
              >
                ابدأ رحلتك مع UniShare
                <ArrowLeft size={19} className="transition group-hover:-translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/posts")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition hover:bg-white/10"
              >
                اكتشف مجتمع المعرفة
                <Users size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3 md:items-start">
            <div className="flex flex-col items-center text-center md:items-start md:text-right">
              <button
                type="button"
                onClick={() => navigate("/")}
                aria-label="UniShare"
                className="transition hover:scale-[1.02]"
              >
                <UniShareLogo />
              </button>

              <p className="mt-4 max-w-xs text-sm leading-7 text-slate-500">
                مساحة تجمع المعرفة والتعاون،
                وتمنح الطلبة فرصة للتعلم والمشاركة والتطور.
              </p>
            </div>

            <div className="text-center md:text-right">
              <h3 className="font-black text-slate-800">اكتشف UniShare</h3>

              <div className="mt-5 flex flex-col items-center gap-3 text-sm text-slate-500 md:items-start">
                <button
                  type="button"
                  onClick={() => navigate("/universities")}
                  className="transition hover:text-blue-600"
                >
                  الجامعات
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/faculties")}
                  className="transition hover:text-blue-600"
                >
                  الكليات
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/posts")}
                  className="transition hover:text-blue-600"
                >
                  مجتمع المعرفة
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="transition hover:text-blue-600"
                >
                  إنشاء حساب
                </button>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="font-black text-slate-800">تواصل معنا</h3>

              <div className="mt-5 flex flex-col items-center gap-4 text-sm text-slate-500 md:items-start">
                <a
                  href="mailto:support.unishare@gmail.com"
                  className="flex items-center gap-2 transition hover:text-blue-600"
                >
                  <Mail size={17} />
                  <span>support.unishare@gmail.com</span>
                </a>

                <a
                  href="tel:+213553469772"
                  dir="ltr"
                  className="flex items-center gap-2 transition hover:text-blue-600"
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

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} UniShare. جميع الحقوق محفوظة.
            </p>

            <p className="flex items-center gap-2">
              صُنع بشغف من أجل مجتمع المعرفة
              <Sparkles size={14} className="text-blue-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
