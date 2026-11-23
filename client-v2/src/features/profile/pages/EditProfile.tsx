
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

interface Item {
  id: string;
  name: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");

  const [facultyId, setFacultyId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const [faculties, setFaculties] = useState<Item[]>([]);
  const [specialties, setSpecialties] = useState<Item[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadSpecialties(faculty: string) {
    const { data } = await supabase
      .from("specialties")
      .select("id,name")
      .eq("faculty_id", faculty)
      .order("name");

    setSpecialties(data || []);
  }

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      setFullName(profile.full_name ?? "");
      setUsername(profile.username ?? "");
      setBio(profile.bio ?? "");
      setAge(profile.age ? String(profile.age) : "");

      setFacultyId(profile.faculty_id ?? "");
      setSpecialtyId(profile.specialty_id ?? "");

      setPreview(profile.avatar_url ?? "");

      if (profile.faculty_id) {
        loadSpecialties(profile.faculty_id);
      }
    }

    const { data } = await supabase
      .from("faculties")
      .select("id,name")
      .order("name");

    setFaculties(data || []);
  }

  function handleAvatarChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صالح.");
      e.target.value = "";
      return;
    }

    setAvatar(file);
    setSelectedFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  async function saveProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }

    let avatarUrl = preview;

    // Upload profile picture

    if (avatar) {
      const extension =
        avatar.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar, {
          upsert: true,
          contentType: avatar.type,
        });

      if (uploadError) {
        console.error("Avatar upload error:", uploadError);
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      avatarUrl = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath).data.publicUrl;
    }

    // Update profile

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username,
        bio,
        age: age ? Number(age) : null,
        faculty_id: facultyId || null,
        specialty_id: specialtyId || null,
        avatar_url: avatarUrl,
      })
      .eq("user_id", user.id);

    setLoading(false);

    if (error) {
      console.error("Profile update error:", error);
      alert(error.message);
      return;
    }

    alert("تم تحديث الملف الشخصي بنجاح.");

    navigate("/profile");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">
        تعديل الملف الشخصي
      </h1>

      <div className="space-y-4 rounded-2xl bg-white p-6 shadow dark:bg-slate-900">

        {/* Profile Picture */}

        <div className="flex flex-col items-center gap-4">
          <img
            src={preview || "/avatars/default.png"}
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
            onError={(e) => {
              e.currentTarget.src = "/avatars/default.png";
            }}
          />

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
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
              "
            >
              📷 Choisir une photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />

            {selectedFileName && (
              <p
                dir="auto"
                className="max-w-64 truncate text-xs text-slate-500"
              >
                {selectedFileName}
              </p>
            )}

            <p className="text-xs text-slate-500">
              اختر صورة شخصية جديدة
            </p>
          </div>
        </div>

        {/* Personal Information */}

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="الاسم الكامل"
          className="w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"
        />

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="اسم المستخدم"
          className="w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"
        />

        <textarea
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="نبذة عنك"
          className="w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"
        />

        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="العمر"
          className="w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"
        />

        {/* Faculty */}

        <select
          value={facultyId}
          onChange={(e) => {
            setFacultyId(e.target.value);
            setSpecialtyId("");
            loadSpecialties(e.target.value);
          }}
          className="w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="">
            اختر الكلية
          </option>

          {faculties.map((f) => (
            <option
              key={f.id}
              value={f.id}
            >
              {f.name}
            </option>
          ))}
        </select>

        {/* Specialty */}

        <select
          value={specialtyId}
          disabled={!facultyId}
          onChange={(e) => setSpecialtyId(e.target.value)}
          className="w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="">
            اختر التخصص
          </option>

          {specialties.map((s) => (
            <option
              key={s.id}
              value={s.id}
            >
              {s.name}
            </option>
          ))}
        </select>

        {/* Save */}

        <button
          type="button"
          onClick={saveProfile}
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-blue-600
            py-3
            font-bold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "جارٍ الحفظ..."
            : "💾 حفظ التعديلات"}
        </button>

      </div>
    </div>
  );
}
