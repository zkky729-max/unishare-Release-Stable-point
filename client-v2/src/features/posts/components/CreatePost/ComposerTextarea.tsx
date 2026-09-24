import { useEffect, useRef } from "react";

interface ComposerTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function ComposerTextarea({
  value,
  onChange,
  maxLength = 2000,
}: ComposerTextareaProps) {
  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";

    const height = Math.min(
      textarea.scrollHeight,
      240
    );

    textarea.style.height = `${height}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > 240
        ? "auto"
        : "hidden";
  }, [value]);

  const progress =
    Math.min(
      (value.length / maxLength) * 100,
      100
    );

  const counterColor =
    value.length >= maxLength
      ? "text-red-600"
      : value.length >= maxLength * 0.9
        ? "text-orange-500"
        : "text-slate-400";

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        dir="rtl"
        placeholder="بماذا تفكر؟"
        value={value}
        maxLength={maxLength}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          min-h-[120px]
          max-h-[240px]
          w-full
          resize-none
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-4
          text-sm
          text-slate-900
          outline-none
          transition-all
          duration-200
          placeholder:text-slate-400
          focus:border-blue-400
          focus:bg-white
          focus:ring-2
          focus:ring-blue-100
        "
      />

      <div
        dir="rtl"
        className="
          flex
          items-center
          justify-between
          px-1
        "
      >
        <span
          className="
            text-xs
            font-medium
            text-slate-400
          "
        >
          يمكنك كتابة حتى {maxLength} حرف
        </span>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              h-1.5
              w-16
              overflow-hidden
              rounded-full
              bg-slate-200
            "
          >
            <div
              className={`
                h-full
                rounded-full
                transition-all
                duration-200
                ${
                  value.length >= maxLength
                    ? "bg-red-500"
                    : value.length >=
                        maxLength * 0.9
                      ? "bg-orange-500"
                      : "bg-blue-500"
                }
              `}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <span
            className={`
              text-xs
              font-semibold
              ${counterColor}
            `}
          >
            {value.length} / {maxLength}
          </span>
        </div>
      </div>
    </div>
  );
}