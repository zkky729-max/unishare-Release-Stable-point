import {
  FileText,
  Image as ImageIcon,
  User,
  Building2,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import type { Post } from "../types/post";

import PostActions from "./PostActions";

import CommentsList from "../comments/components/CommentsList";

import { toggleLike } from "../api/toggleLike";

import { updatePost } from "../api/updatePost";

import { deletePost } from "../api/deletePost";

// =====================================================
// Props
// =====================================================

interface Props {
  post: Post;
}

// =====================================================
// Component
// =====================================================

export default function PostCard({
  post,
}: Props) {
  const [showComments, setShowComments] =
    useState(false);

  const [likeLoading, setLikeLoading] =
    useState(false);

  // ===================================================
  // Edit / Delete
  // ===================================================

  const [showMenu, setShowMenu] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editContent, setEditContent] =
    useState(post.content || "");

  const [editLoading, setEditLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [currentContent, setCurrentContent] =
    useState(post.content || "");

  const [isDeleted, setIsDeleted] =
    useState(false);

  // ===================================================
  // Image Viewer
  // ===================================================

  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number | null>(null);

  const postImages =
    post.images_urls &&
    post.images_urls.length > 0
      ? post.images_urls
      : post.image
        ? [post.image]
        : [];

  // ===================================================
  // Open Image
  // ===================================================

  function openImage(index: number) {
    setSelectedImageIndex(index);
  }

  // ===================================================
  // Close Image
  // ===================================================

  function closeImage() {
    setSelectedImageIndex(null);
  }

  // ===================================================
  // Previous Image
  // ===================================================

  function showPreviousImage() {
    if (
      selectedImageIndex === null ||
      postImages.length <= 1
    ) {
      return;
    }

    setSelectedImageIndex(
      selectedImageIndex === 0
        ? postImages.length - 1
        : selectedImageIndex - 1
    );
  }

  // ===================================================
  // Next Image
  // ===================================================

  function showNextImage() {
    if (
      selectedImageIndex === null ||
      postImages.length <= 1
    ) {
      return;
    }

    setSelectedImageIndex(
      selectedImageIndex === postImages.length - 1
        ? 0
        : selectedImageIndex + 1
    );
  }

  // ===================================================
  // Keyboard controls
  // ===================================================

  useEffect(() => {
    if (selectedImageIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowLeft") {
        showNextImage();
      }

      if (event.key === "ArrowRight") {
        showPreviousImage();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedImageIndex]);

  // ===================================================
  // Edit
  // ===================================================

  function startEditing() {
    setEditContent(currentContent);
    setShowMenu(false);
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditContent(currentContent);
    setIsEditing(false);
  }

  async function handleUpdate() {
    if (editLoading) {
      return;
    }

    const trimmedContent =
      editContent.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setEditLoading(true);

      await updatePost(
        post.id,
        trimmedContent
      );

      setCurrentContent(
        trimmedContent
      );

      setIsEditing(false);
    } catch (error) {
      console.error(
        "POST CARD UPDATE ERROR:",
        error
      );

      window.alert(
        "تعذر تعديل المنشور. حاول مرة أخرى."
      );
    } finally {
      setEditLoading(false);
    }
  }

  // ===================================================
  // Delete
  // ===================================================

  async function handleDelete() {
    if (deleteLoading) {
      return;
    }

    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف هذا المنشور؟\nلا يمكن التراجع عن هذه العملية."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deletePost(post.id);

      setIsDeleted(true);
    } catch (error) {
      console.error(
        "POST CARD DELETE ERROR:",
        error
      );

      window.alert(
        "تعذر حذف المنشور. حاول مرة أخرى."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  // ===================================================
  // Like
  // ===================================================

  async function handleLike() {
    if (likeLoading) {
      return;
    }

    try {
      setLikeLoading(true);

      await toggleLike(
        post.id,
        post.likedByMe
      );
    } catch (error) {
      console.error(
        "POST CARD LIKE ERROR:",
        error
      );
    } finally {
      setLikeLoading(false);
    }
  }

  // ===================================================
  // Deleted
  // ===================================================

  if (isDeleted) {
    return null;
  }

  // ===================================================
  // Render
  // ===================================================

  return (
    <>
      <article
        dir="rtl"
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            gap-3
            px-4
            py-4
          "
        >
          {/* Avatar */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-slate-100
            "
          >
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={`صورة ${post.author.name}`}
                loading="lazy"
                decoding="async"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <User
                size={21}
                className="text-slate-400"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Author */}

          <div className="min-w-0 flex-1">
            <div
              className="
                truncate
                text-sm
                font-bold
                text-slate-900
              "
            >
              {post.author.name}
            </div>

            <div
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              {post.createdAt}
            </div>
          </div>

          {/* =================================================
              Owner Menu
          ================================================= */}

          {post.isOwner && (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() =>
                  setShowMenu(
                    previous => !previous
                  )
                }
                disabled={
                  editLoading ||
                  deleteLoading
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-800
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="خيارات المنشور"
                aria-expanded={showMenu}
              >
                <MoreVertical
                  size={20}
                  aria-hidden="true"
                />
              </button>

              {showMenu && (
                <div
                  className="
                    absolute
                    left-0
                    top-11
                    z-40
                    min-w-[160px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    py-1
                    shadow-xl
                  "
                >
                  {/* Edit */}

                  <button
                    type="button"
                    onClick={startEditing}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2.5
                      px-4
                      py-2.5
                      text-right
                      text-sm
                      font-medium
                      text-slate-700
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <Pencil
                      size={17}
                      className="text-blue-600"
                      aria-hidden="true"
                    />

                    <span>
                      تعديل المنشور
                    </span>
                  </button>

                  {/* Delete */}

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2.5
                      px-4
                      py-2.5
                      text-right
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    {deleteLoading ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash2
                        size={17}
                        aria-hidden="true"
                      />
                    )}

                    <span>
                      {deleteLoading
                        ? "جاري الحذف..."
                        : "حذف المنشور"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* Academic Information */}
        {/* ================================================= */}

        {(post.facultyName ||
          post.subjectName ||
          post.teacherName ||
          post.academicYear ||
          post.semesterName ||
          post.moduleName) && (
          <div
            className="
              mx-4
              mb-3
              rounded-xl
              bg-slate-50
              px-3
              py-3
            "
          >
            <div
              className="
                flex
                flex-wrap
                gap-2
                text-xs
                text-slate-600
              "
            >
              {post.facultyName && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-blue-50
                    px-2.5
                    py-1
                    font-semibold
                    text-blue-700
                  "
                >
                  <Building2
                    size={14}
                    aria-hidden="true"
                  />

                  <span>
                    {post.facultyName}
                  </span>
                </span>
              )}

              {post.subjectName && (
                <span
                  className="
                    rounded-lg
                    bg-white
                    px-2.5
                    py-1
                    font-semibold
                  "
                >
                  {post.subjectName}
                </span>
              )}

              {post.teacherName && (
                <span
                  className="
                    rounded-lg
                    bg-white
                    px-2.5
                    py-1
                  "
                >
                  الأستاذ: {post.teacherName}
                </span>
              )}

              {post.academicYear && (
                <span
                  className="
                    rounded-lg
                    bg-white
                    px-2.5
                    py-1
                  "
                >
                  {post.academicYear}
                </span>
              )}

              {post.semesterName && (
                <span
                  className="
                    rounded-lg
                    bg-white
                    px-2.5
                    py-1
                  "
                >
                  {post.semesterName}
                </span>
              )}

              {post.moduleName && (
                <span
                  className="
                    rounded-lg
                    bg-white
                    px-2.5
                    py-1
                  "
                >
                  {post.moduleName}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* Content / Edit */}
        {/* ================================================= */}

        {isEditing ? (
          <div className="px-4 pb-4">
            <textarea
              value={editContent}
              onChange={event =>
                setEditContent(
                  event.target.value
                )
              }
              rows={5}
              autoFocus
              disabled={editLoading}
              className="
                w-full
                resize-y
                rounded-xl
                border
                border-blue-200
                bg-white
                px-4
                py-3
                text-[15px]
                leading-7
                text-slate-800
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                disabled:opacity-60
              "
              placeholder="اكتب محتوى المنشور..."
            />

            <div
              className="
                mt-3
                flex
                items-center
                justify-end
                gap-2
              "
            >
              <button
                type="button"
                onClick={cancelEditing}
                disabled={editLoading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:opacity-50
                "
              >
                <X
                  size={17}
                  aria-hidden="true"
                />

                إلغاء
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={
                  editLoading ||
                  !editContent.trim()
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {editLoading ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Check
                    size={17}
                    aria-hidden="true"
                  />
                )}

                {editLoading
                  ? "جاري الحفظ..."
                  : "حفظ التعديل"}
              </button>
            </div>
          </div>
        ) : (
          currentContent && (
            <div
              className="
                whitespace-pre-wrap
                break-words
                px-4
                pb-4
                text-[15px]
                leading-7
                text-slate-800
              "
            >
              {currentContent}
            </div>
          )
        )}

        {/* ================================================= */}
        {/* Images */}
        {/* ================================================= */}

        {post.images_urls &&
          post.images_urls.length > 0 && (
            <div
              role="group"
              aria-label="صور المنشور"
              className="
                overflow-hidden
                border-y
                border-slate-100
              "
            >
              {post.images_urls.length === 1 ? (
                <button
                  type="button"
                  onClick={() => openImage(0)}
                  className="
                    block
                    w-full
                    cursor-zoom-in
                    overflow-hidden
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-500
                    focus-visible:ring-inset
                  "
                  aria-label="فتح الصورة بحجم كبير"
                >
                  <img
                    src={post.images_urls[0]}
                    alt="صورة مرفقة بالمنشور"
                    loading="lazy"
                    decoding="async"
                    className="
                      max-h-[600px]
                      w-full
                      object-cover
                      transition
                      duration-300
                      hover:scale-[1.01]
                    "
                  />
                </button>
              ) : (
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-1
                  "
                >
                  {post.images_urls.map(
                    (
                      imageUrl,
                      index
                    ) => (
                      <button
                        key={`${imageUrl}-${index}`}
                        type="button"
                        onClick={() =>
                          openImage(index)
                        }
                        className="
                          block
                          w-full
                          cursor-zoom-in
                          overflow-hidden
                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-blue-500
                          focus-visible:ring-inset
                        "
                        aria-label={`فتح الصورة ${index + 1} من ${post.images_urls?.length ?? 0}`}
                      >
                        <img
                          src={imageUrl}
                          alt={`الصورة المرفقة ${index + 1} من ${post.images_urls?.length ?? 0}`}
                          loading="lazy"
                          decoding="async"
                          className="
                            aspect-square
                            w-full
                            object-cover
                            transition
                            duration-300
                            hover:scale-[1.03]
                          "
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}

        {/* ================================================= */}
        {/* Single Image Fallback */}
        {/* ================================================= */}

        {!post.images_urls?.length &&
          post.image && (
            <div
              role="group"
              aria-label="صورة المنشور"
              className="
                overflow-hidden
                border-y
                border-slate-100
              "
            >
              <button
                type="button"
                onClick={() => openImage(0)}
                className="
                  block
                  w-full
                  cursor-zoom-in
                  overflow-hidden
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-500
                  focus-visible:ring-inset
                "
                aria-label="فتح الصورة بحجم كبير"
              >
                <img
                  src={post.image}
                  alt="صورة مرفقة بالمنشور"
                  loading="lazy"
                  decoding="async"
                  className="
                    max-h-[600px]
                    w-full
                    object-cover
                    transition
                    duration-300
                    hover:scale-[1.01]
                  "
                />
              </button>
            </div>
          )}

        {/* ================================================= */}
        {/* PDF */}
        {/* ================================================= */}

        {(post.pdf_url || post.pdf) && (
          <div className="px-4 py-3">
            <a
              href={
                post.pdf_url ||
                post.pdf
              }
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-3
                transition
                hover:bg-slate-100
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-red-50
                  text-red-600
                "
              >
                <FileText
                  size={20}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <div
                  className="
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >
                  {post.pdf_name ||
                    "ملف PDF"}
                </div>

                <div
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  فتح الملف
                </div>
              </div>
            </a>
          </div>
        )}

        {/* ================================================= */}
        {/* Empty Media */}
        {/* ================================================= */}

        {!currentContent &&
          !post.image &&
          !post.images_urls?.length &&
          !post.pdf &&
          !post.pdf_url && (
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-6
                text-sm
                text-slate-400
              "
            >
              <ImageIcon
                size={18}
                aria-hidden="true"
              />

              <span>
                لا يوجد محتوى إضافي
              </span>
            </div>
          )}

        {/* ================================================= */}
        {/* Statistics */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            px-4
            py-2.5
            text-xs
            text-slate-500
          "
        >
          <span>
            {post.likes} إعجاب
          </span>

          <button
            type="button"
            onClick={() =>
              setShowComments(
                previous =>
                  !previous
              )
            }
            className="
              transition
              hover:text-blue-600
            "
          >
            {post.comments} تعليق
          </button>
        </div>

        {/* ================================================= */}
        {/* Actions */}
        {/* ================================================= */}

        <div
          className="
            border-t
            border-slate-100
          "
        >
          <div
            className={
              likeLoading
                ? "pointer-events-none opacity-70"
                : ""
            }
          >
            <PostActions
              postId={post.id}
              likedByMe={
                post.likedByMe
              }
              onLike={handleLike}
              showComments={
                showComments
              }
              onComment={() =>
                setShowComments(
                  previous =>
                    !previous
                )
              }
              onShare={() => {
                // المشاركة ستضاف لاحقًا
              }}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* Comments */}
        {/* ================================================= */}

        {showComments && (
          <div
            className="
              border-t
              border-slate-100
              bg-slate-50/60
            "
          >
            <CommentsList
              postId={post.id}
            />
          </div>
        )}
      </article>

      {/* =====================================================
          IMAGE LIGHTBOX
      ===================================================== */}

      {selectedImageIndex !== null &&
        postImages[selectedImageIndex] && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="عرض صورة المنشور"
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/90
              p-4
              backdrop-blur-sm
            "
            onClick={closeImage}
          >
            {/* Close */}

            <button
              type="button"
              onClick={closeImage}
              className="
                absolute
                right-4
                top-4
                z-30
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
              "
              aria-label="إغلاق الصورة"
            >
              <X
                size={24}
                aria-hidden="true"
              />
            </button>

            {/* Previous */}

            {postImages.length > 1 && (
              <button
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                className="
                  absolute
                  right-3
                  top-1/2
                  z-30
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  transition
                  hover:bg-white/20
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                "
                aria-label="الصورة السابقة"
              >
                <ChevronRight
                  size={26}
                  aria-hidden="true"
                />
              </button>
            )}

            {/* Image */}

            <div
              className="
                relative
                flex
                max-h-[92vh]
                max-w-[92vw]
                items-center
                justify-center
              "
              onClick={event =>
                event.stopPropagation()
              }
            >
              <img
                src={
                  postImages[
                    selectedImageIndex
                  ]
                }
                alt={`الصورة ${selectedImageIndex + 1} من ${postImages.length}`}
                decoding="async"
                className="
                  max-h-[92vh]
                  max-w-[92vw]
                  rounded-lg
                  object-contain
                  shadow-2xl
                "
              />

              {postImages.length > 1 && (
                <div
                  className="
                    absolute
                    bottom-3
                    left-1/2
                    -translate-x-1/2
                    rounded-full
                    bg-black/60
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  {selectedImageIndex + 1} /{" "}
                  {postImages.length}
                </div>
              )}
            </div>

            {/* Next */}

            {postImages.length > 1 && (
              <button
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  showNextImage();
                }}
                className="
                  absolute
                  left-3
                  top-1/2
                  z-30
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  transition
                  hover:bg-white/20
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                "
                aria-label="الصورة التالية"
              >
                <ChevronLeft
                  size={26}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        )}
    </>
  );
}