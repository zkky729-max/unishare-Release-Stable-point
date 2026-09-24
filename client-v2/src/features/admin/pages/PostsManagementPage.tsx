import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

// =====================================================
// ADMIN POST TYPE
// =====================================================

interface AdminPost {
  id: string;
  user_id: string | null;
  content: string | null;
  pdf_url: string | null;
  pdf_name: string | null;
  images_urls: string[] | null;
  created_at: string;
  visibility_type: string | null;
  audience_type: string | null;
  university_id: string | null;
  faculty_id: string | null;
  specialty_id: string | null;
  level_id: string | null;
  semester_id: string | null;
  module_id: string | null;
  teacher_name: string | null;
  academic_type: string | null;
  subject_name: string | null;
  academic_year: string | null;
}

// =====================================================
// POSTS MANAGEMENT PAGE
// =====================================================

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD POSTS
  // =====================================================

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى."
        );
      }

      const response = await fetch("/api/admin/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "فشل تحميل المنشورات."
        );
      }

      const postsData = Array.isArray(result?.data)
        ? result.data
        : [];

      setPosts(postsData);
    } catch (err) {
      console.error("LOAD ADMIN POSTS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل تحميل المنشورات."
      );

      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadPosts();
  }, []);

  // =====================================================
  // DELETE POST
  // =====================================================

  async function handleDeletePost(postId: string) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المنشور؟\n\nسيتم حذف المنشور نهائيًا مع الإعجابات والتعليقات المرتبطة به."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(postId);
      setError("");
      setSuccess("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى."
        );
      }

      const response = await fetch(
        "/api/admin/posts/" + postId,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "فشل حذف المنشور."
        );
      }

      setPosts((current) =>
        current.filter((post) => post.id !== postId)
      );

      setSuccess("تم حذف المنشور بنجاح.");
    } catch (err) {
      console.error("DELETE ADMIN POST ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "فشل حذف المنشور."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(date: string) {
    try {
      return new Intl.DateTimeFormat("ar-DZ", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(date));
    } catch {
      return date;
    }
  }

  // =====================================================
  // POST TYPE LABEL
  // =====================================================

  function getPostTypeLabel(post: AdminPost) {
    switch (post.academic_type) {
      case "lesson":
        return "درس";

      case "summary":
        return "ملخص";

      case "exam":
        return "امتحان";

      case "research_discussion":
        return "مناقشة أكاديمية";

      default:
        return "منشور";
    }
  }

  // =====================================================
  // AUDIENCE LABEL
  // =====================================================

  function getAudienceLabel(post: AdminPost) {
    switch (post.audience_type) {
      case "public":
        return "عام";

      case "university":
        return "الجامعة";

      case "faculty":
        return "الكلية";

      case "specialty":
        return "التخصص";

      case "level":
        return "المستوى";

      case "semester":
        return "السداسي";

      case "module":
        return "المقياس";

      default:
        return "عام";
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        color: "#111827",
        fontFamily: "Cairo, sans-serif",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            إدارة المنشورات
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "15px",
              color: "#64748b",
            }}
          >
            إدارة ومراجعة جميع المنشورات داخل منصة UniShare
          </p>
        </div>

        <button
          type="button"
          onClick={loadPosts}
          disabled={loading}
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "12px 20px",
            background:
              "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "جاري التحديث..." : "تحديث المنشورات"}
        </button>
      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            color: "#166534",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {success}
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* TOTAL */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            إجمالي المنشورات
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {posts.length}
          </div>
        </div>

        {/* ACADEMIC */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            المنشورات الأكاديمية
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#3b82f6",
            }}
          >
            {
              posts.filter(
                (post) => post.academic_type
              ).length
            }
          </div>
        </div>

        {/* PUBLIC */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            المنشورات العامة
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#16a34a",
            }}
          >
            {
              posts.filter(
                (post) =>
                  post.audience_type === "public"
              ).length
            }
          </div>
        </div>
      </div>

      {/* =================================================
          POSTS LIST
      ================================================= */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            جميع المنشورات
          </h2>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                marginBottom: "12px",
              }}
            >
              ⏳
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "15px",
              }}
            >
              جاري تحميل المنشورات...
            </p>
          </div>
        ) : posts.length === 0 ? (
          /* =================================================
             EMPTY
          ================================================= */

          <div
            style={{
              padding: "70px 20px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "12px",
              }}
            >
              📝
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#334155",
                fontSize: "18px",
              }}
            >
              لا توجد منشورات
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
              }}
            >
              لا توجد منشورات لعرضها حاليًا.
            </p>
          </div>
        ) : (
          /* =================================================
             POSTS
          ================================================= */

          <div>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: "22px 24px",
                  borderBottom:
                    "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* =================================================
                      POST INFORMATION
                  ================================================= */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: "280px",
                    }}
                  >
                    {/* AUTHOR */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #3b82f6, #6366f1)",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "16px",
                        }}
                      >
                        م
                      </div>

                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#0f172a",
                            fontSize: "15px",
                          }}
                        >
                          مستخدم
                        </div>

                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "12px",
                            marginTop: "2px",
                          }}
                        >
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "12px",
                        color: "#334155",
                        fontSize: "14px",
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {post.content || "بدون محتوى"}
                    </div>

                    {/* META */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: "999px",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {getPostTypeLabel(post)}
                      </span>

                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: "999px",
                          background: "#f5f3ff",
                          color: "#6d28d9",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {getAudienceLabel(post)}
                      </span>

                      {post.subject_name && (
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "999px",
                            background: "#f0fdf4",
                            color: "#15803d",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {post.subject_name}
                        </span>
                      )}

                      {post.teacher_name && (
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "999px",
                            background: "#fff7ed",
                            color: "#c2410c",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          الأستاذ: {post.teacher_name}
                        </span>
                      )}

                      {post.academic_year && (
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "999px",
                            background: "#f8fafc",
                            color: "#64748b",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          السنة: {post.academic_year}
                        </span>
                      )}

                      {post.pdf_name && (
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "999px",
                            background: "#fef2f2",
                            color: "#b91c1c",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          📄 {post.pdf_name}
                        </span>
                      )}

                      {post.images_urls &&
                        post.images_urls.length > 0 && (
                          <span
                            style={{
                              padding: "5px 10px",
                              borderRadius: "999px",
                              background: "#f0fdfa",
                              color: "#0f766e",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            🖼️{" "}
                            {post.images_urls.length} صورة
                          </span>
                        )}
                    </div>
                  </div>

                  {/* =================================================
                      DELETE
                  ================================================= */}

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeletePost(post.id)
                      }
                      disabled={
                        deletingId === post.id
                      }
                      style={{
                        border:
                          "1px solid #fecaca",
                        borderRadius: "10px",
                        padding: "9px 15px",
                        background:
                          deletingId === post.id
                            ? "#fef2f2"
                            : "#ffffff",
                        color: "#dc2626",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor:
                          deletingId === post.id
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          deletingId === post.id
                            ? 0.6
                            : 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {deletingId === post.id
                        ? "جاري الحذف..."
                        : "حذف المنشور"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}