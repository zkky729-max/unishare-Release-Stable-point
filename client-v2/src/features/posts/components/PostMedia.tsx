import {
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

// =====================================================
// Props
// =====================================================

interface PostMediaProps {
  /**
   * Multiple images - new system
   */
  images?: string[];

  /**
   * Legacy single image support
   */
  image?: string;

  /**
   * PDF URL
   */
  pdf?: string;

  /**
   * PDF original filename
   */
  pdfName?: string | null;
}

// =====================================================
// Component
// =====================================================

export default function PostMedia({
  images = [],
  image,
  pdf,
  pdfName,
}: PostMediaProps) {
  // ===================================================
  // Normalize Images
  // ===================================================

  const normalizedImages =
    images.length > 0
      ? images
      : image
        ? [image]
        : [];

  // ===================================================
  // Nothing to render
  // ===================================================

  if (
    normalizedImages.length === 0 &&
    !pdf
  ) {
    return null;
  }

  // ===================================================
  // Render
  // ===================================================

  return (
    <div className="mt-5 space-y-4">
      {/* ================================================= */}
      {/* Images */}
      {/* ================================================= */}

      {normalizedImages.length > 0 && (
        <div
          className={`
            grid
            gap-2
            ${
              normalizedImages.length === 1
                ? "grid-cols-1"
                : "grid-cols-2"
            }
          `}
        >
          {normalizedImages.map(
            (src, index) => (
              <a
                key={`${src}-${index}`}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  relative
                  block
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                "
              >
                <img
                  src={src}
                  alt={`مرفق ${index + 1}`}
                  loading="lazy"
                  className={`
                    block
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-[1.02]

                    ${
                      normalizedImages.length === 1
                        ? "max-h-[650px]"
                        : "aspect-square"
                    }
                  `}
                />

                {/* Image Overlay */}

                <div
                  className="
                    absolute
                    bottom-3
                    right-3
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-black/60
                    px-2.5
                    py-1.5
                    text-[11px]
                    font-medium
                    text-white
                    opacity-0
                    backdrop-blur-md
                    transition
                    group-hover:opacity-100
                  "
                >
                  <ImageIcon size={13} />

                  <span>
                    عرض الصورة
                  </span>
                </div>
              </a>
            )
          )}
        </div>
      )}

      {/* ================================================= */}
      {/* PDF */}
      {/* ================================================= */}

      {pdf && (
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-red-100
            bg-gradient-to-br
            from-red-50
            via-white
            to-orange-50
            shadow-sm
            transition-all
            duration-300
            hover:border-red-200
            hover:shadow-md
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              p-3.5
              sm:p-4
            "
          >
            {/* PDF Icon */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-red-100
                text-red-600
                shadow-sm
              "
            >
              <FileText size={22} />
            </div>

            {/* PDF Information */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                {pdfName || "ملف PDF"}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[11px]
                  text-slate-500
                "
              >
                مستند أكاديمي مرفق بالمنشور
              </p>
            </div>

            {/* Actions */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-1.5
              "
            >
              {/* Open */}

              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فتح ملف PDF"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-slate-500
                  shadow-sm
                  ring-1
                  ring-slate-200
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <ExternalLink size={16} />
              </a>

              {/* Download */}

              <a
                href={pdf}
                download
                aria-label="تحميل ملف PDF"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-600
                  text-white
                  shadow-sm
                  transition
                  hover:bg-red-700
                "
              >
                <Download size={16} />
              </a>
            </div>
          </div>

          {/* Bottom Accent */}

          <div
            className="
              h-0.5
              w-full
              bg-gradient-to-r
              from-red-400
              to-orange-400
            "
          />
        </div>
      )}
    </div>
  );
}