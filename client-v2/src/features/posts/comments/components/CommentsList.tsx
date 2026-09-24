import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

import { useComments } from "../hooks/useComments";

import { useCommentsRealtime } from "../../realtime/useCommentsRealtime";

// =====================================================
// Props
// =====================================================

interface Props {
  postId: string;
}

// =====================================================
// Component
// =====================================================

export default function CommentsList({
  postId,
}: Props) {
  const {
    comments,
    loading,
    addComment,
    refresh,
  } = useComments(postId);

  // ===================================================
  // Comments Realtime
  // ===================================================

  useCommentsRealtime(
    postId,
    refresh
  );

  // ===================================================
  // Render
  // ===================================================

  return (
    <div
      dir="rtl"
      className="
        border-t
        border-slate-100
        bg-white
        px-5
        py-4
      "
    >
      {/* ================================================= */}
      {/* Input */}
      {/* ================================================= */}

      <CommentInput
        onSubmit={addComment}
      />

      {/* ================================================= */}
      {/* Comments */}
      {/* ================================================= */}

      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500">
            جاري تحميل التعليقات...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">
            لا توجد تعليقات بعد.
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
            />
          ))
        )}
      </div>
    </div>
  );
}