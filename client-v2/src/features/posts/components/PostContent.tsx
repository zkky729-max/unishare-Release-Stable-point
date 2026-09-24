import { useState } from "react";

interface PostContentProps {
  content: string;
}

export default function PostContent({
  content,
}: PostContentProps) {
  const [expanded, setExpanded] =
    useState(false);

  const shouldShowButton =
    content.length > 250;

  if (!content) {
    return null;
  }

  return (
    <div className="mt-5">
      <p
        className={`
          whitespace-pre-wrap
          text-[15px]
          leading-7
          text-slate-800
          transition-all
          duration-300

          ${
            !expanded &&
            shouldShowButton
              ? "line-clamp-5"
              : ""
          }
        `}
      >
        {content}
      </p>

      {shouldShowButton && (
        <button
          type="button"
          onClick={() =>
            setExpanded(
              (previous) => !previous
            )
          }
          className="
            mt-2
            text-sm
            font-semibold
            text-indigo-600
            transition
            hover:text-indigo-700
            hover:underline
          "
        >
          {expanded
            ? "عرض أقل"
            : "عرض المزيد"}
        </button>
      )}
    </div>
  );
}