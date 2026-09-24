import { useId } from "react";
import type { SVGProps } from "react";

interface UniShareLogoProps extends SVGProps<SVGSVGElement> {
  showText?: boolean;
  compact?: boolean;
}

export default function UniShareLogo({
  showText = true,
  compact = false,
  className = "",
  ...props
}: UniShareLogoProps) {
  const uid = useId().replace(/:/g, "");

  const mainId = `unishare-main-${uid}`;
  const bookId = `unishare-book-${uid}`;
  const glowId = `unishare-glow-${uid}`;

  const hasText = showText && !compact;

  return (
    <div
      dir="ltr"
      className={`flex items-center gap-3 ${
        compact ? "justify-center" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        role={hasText ? undefined : "img"}
        aria-label={hasText ? undefined : "UniShare"}
        aria-hidden={hasText ? true : undefined}
        className={compact ? "h-10 w-10" : "h-12 w-12"}
        {...props}
      >
        <defs>
          {/* =====================================================
              MAIN GRADIENT
          ===================================================== */}

          <linearGradient
            id={mainId}
            x1="18"
            y1="15"
            x2="105"
            y2="105"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* =====================================================
              BOOK GRADIENT
          ===================================================== */}

          <linearGradient
            id={bookId}
            x1="35"
            y1="55"
            x2="85"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* =====================================================
              LIGHT / GLOW
          ===================================================== */}

          <radialGradient
            id={glowId}
            cx="60"
            cy="25"
            r="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor="#06B6D4"
              stopOpacity="0.35"
            />

            <stop
              offset="100%"
              stopColor="#06B6D4"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* LIGHT OF KNOWLEDGE */}

        <circle
          cx="60"
          cy="27"
          r="28"
          fill={`url(#${glowId})`}
        />

        {/* UNIVERSITY / SHIELD */}

        <path
          d="M21 27V63C21 87 37 102 60 108C83 102 99 87 99 63V27"
          fill="none"
          stroke={`url(#${mainId})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* GRADUATION CAP */}

        <path
          d="M60 17L88 30L60 43L32 30Z"
          fill={`url(#${mainId})`}
        />

        <path
          d="M44 37V45C44 50 51 53 60 53C69 53 76 50 76 45V37"
          fill="none"
          stroke={`url(#${mainId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* CAP TASSEL */}

        <path
          d="M88 30V45"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <circle
          cx="88"
          cy="48"
          r="3.2"
          fill="#06B6D4"
        />

        {/* OPEN BOOK */}

        <path
          d="M34 61C42 57 51 58 58 63V89C51 85 42 84 34 87Z"
          fill={`url(#${bookId})`}
        />

        <path
          d="M86 61C78 57 69 58 62 63V89C69 85 78 84 86 87Z"
          fill={`url(#${bookId})`}
        />

        {/* BOOK CENTER */}

        <path
          d="M60 63V89"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* STUDENT */}

        <circle
          cx="60"
          cy="57"
          r="6"
          fill="#FFFFFF"
        />

        <path
          d="M51 70C51 64.5 54.5 62 60 62C65.5 62 69 64.5 69 70V75H51V70Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* BRAND NAME */}

      {hasText && (
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-extrabold tracking-tight text-[#0B1B3A]">
            Uni
            <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
              Share
            </span>
          </span>

          <span className="mt-1.5 text-[9px] font-semibold tracking-[0.22em] text-slate-500">
            LEARN · CONNECT · GROW
          </span>
        </div>
      )}
    </div>
  );
}