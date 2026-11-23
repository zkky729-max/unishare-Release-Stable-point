
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Props {
  userId: string;
  currentAvatar: string | null;
  onUploaded: (url: string) => void;
}

export default function AvatarUpload({
  userId,
  currentAvatar,
  onUploaded,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadAvatar(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صالح.");
      e.target.value = "";
      setFileName("");
      return;
    }

    try {
      setLoading(true);

      const fileExt = file.name.split(".").pop();

      const newFileName =
        `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(newFileName, file, {
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(newFileName);

      const url = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: url,
        })
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      onUploaded(url);

      alert("تم تغيير الصورة بنجاح.");
    } catch (error) {
      console.error("Avatar upload error:", error);

      alert("فشل رفع الصورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={currentAvatar || "/avatars/default.png"}
        alt="الصورة الشخصية"
        className="
          h-32
          w-32
          rounded-full
          border
          border-slate-200
          object-cover
          dark:border-slate-700
        "
      />

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "Chargement..." : "Choisir une photo"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={uploadAvatar}
        />

        {fileName && (
          <p
            dir="auto"
            className="max-w-64 truncate text-xs text-slate-500"
          >
            {fileName}
          </p>
        )}
      </div>
    </div>
  );
}
