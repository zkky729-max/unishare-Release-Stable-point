
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  UserRound,
  GraduationCap,
  Save,
  Loader2,
  ImagePlus,
  ArrowRight,
} from "lucide-react";

import { supabase } from "../../../lib/supabaseClient";

interface Item {
  id: string;
  name: string;
}

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");

  const [facultyId, setFacultyId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  const [faculties, setFaculties] = useState<Item[]>([]);
  const [specialties, setSpecialties] = useState<Item[]>([]);

  useEffect(() => {
    loadProfile();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  async function loadSpecialties(faculty: string) {
    if (!faculty) {
      setSpecialties([]);
      return;
    }

    const { data, error } = await supabase
      .from("specialties")
      .select("id,name")
      .eq("faculty_id", faculty)
      .order("name");

    if (error) {
      console.error("Load specialties error:", error);
      return;
    }

    setSpecialties(data || []);
  }

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setFullName(profile.full_name ?? "");
        setUsername(profile.username ?? "");
        setBio(profile.bio ?? "");
        setAge(profile.age ? String(profile.age) : "");

        setFacultyId(profile.faculty_id ?? "");
        setSpecialtyId(profile.specialty_id ?? "");

        setPreview(profile.avatar_url ?? "");
        setAvatarError(false);

        if (profile.faculty_id) {
          await loadSpecialties(profile.faculty_id);
        }
      }

      const { data: facultyData, error: facultyError } =
        await supabase
          .from("faculties")
          .select("id,name")
          .order("name");

      if (facultyError) throw facultyError;

      setFaculties(facultyData || []);
    } catch (error) {
      console.error("Load profile error:", error);
      alert("تعذر تحميل بيانات الملف الشخصي.");
    } finally {
      setLoadingProfile(false);
    }
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

    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب ألا يتجاوز 5 ميغابايت.");
      e.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    setAvatar(file);
    setSelectedFileName(file.name);
    setPreview(objectUrl);
    setAvatarError(false);
  }

  async function saveProfile() {
    if (!fullName.trim()) {
      alert("يرجى إدخال الاسم الكامل.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
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

        if (uploadError) throw uploadError;

        avatarUrl = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath).data.publicUrl;
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          username: username.trim(),
          bio: bio.trim(),
          age: age ? Number(age) : null,
          faculty_id: facultyId || null,
          specialty_id: specialtyId || null,
          avatar_url: avatarUrl || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      alert("تم تحديث الملف الشخصي بنجاح.");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحديث الملف الشخصي."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            جارٍ تحميل بياناتك...
          </p>
        </div>
      </div>
    );
  }

  const inputClass = `
    w-full rounded-xl border border-slate-200
    bg-slate-50 px-4 py-3.5 text-sm
    text-slate-800 outline-none transition
    placeholder:text-slate-400
    focus:border-blue-500 focus:bg-white
    focus:ring-4 focus:ring-blue-500/10
    dark:border-slate-700 dark:bg-slate-800
    dark:text-white dark:focus:bg-slate-800
  `;

  const labelClass = `
    mb-2 block text-sm font-semibold text-slate-700
    dark:text-slate-200
  `;

  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-6 pb-10">

      {/* Header */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="العودة إلى الملف الشخصي"
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-slate-200 bg-white
            text-slate-600 transition hover:bg-slate-50
            dark:border-slate-700 dark:bg-slate-900
            dark:text-slate-300
          "
        >
          <ArrowRight size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            تعديل الملف الشخصي
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            حدّث معلوماتك وصورتك الشخصية على UniShare
          </p>
        </div>
      </div>

      {/* Avatar Card */}

      <section className="
        overflow-hidden rounded-3xl border border-slate-200
        bg-white shadow-sm dark:border-slate-800
        dark:bg-slate-900
      ">
        <div className="
          h-28 bg-gradient-to-l from-blue-600
          via-indigo-500 to-cyan-500 sm:h-36
        " />

        <div className="px-5 pb-7 sm:px-8">
          <div className="-mt-16 flex flex-col items-center text-center sm:-mt-20">
            <div
              className="
                relative rounded-full border-4 border-white
                bg-white shadow-lg dark:border-slate-900
              "
            >
              {preview && !avatarError ? (
                <img
                  src={preview}
                  alt="الصورة الشخصية"
                  className="
                    h-32 w-32 rounded-full object-cover
                    bg-slate-100 sm:h-40 sm:w-40
                  "
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div
                  className="
                    flex
                    h-32
                    w-32
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-6xl
                    font-bold
                    leading-none
                    text-white
                    sm:h-40
                    sm:w-40
                  "
                  aria-label="الصورة الشخصية الافتراضية"
                >
                  ?
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="اختيار صورة شخصية"
                className="
                  absolute bottom-1 left-1 flex h-10 w-10
                  items-center justify-center rounded-full
                  border-2 border-white bg-blue-600
                  text-white shadow-md transition
                  hover:scale-105 hover:bg-blue-700
                  dark:border-slate-900
                "
              >
                <Camera size={18} />
              </button>
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              صورتك الشخصية
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              اختر صورة تعبّر عنك وتعرّف بك داخل المجتمع الجامعي
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="
                mt-4 inline-flex items-center gap-2
                rounded-xl bg-blue-50 px-5 py-2.5
                text-sm font-semibold text-blue-700
                transition hover:bg-blue-100
                dark:bg-blue-950/40 dark:text-blue-400
                dark:hover:bg-blue-950/70
              "
            >
              <ImagePlus size={17} />
              اختيار صورة جديدة
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
                className="mt-3 max-w-full truncate text-xs text-slate-400"
              >
                {selectedFileName}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-400">
              PNG أو JPG — الحد الأقصى 5 ميغابايت
            </p>
          </div>
        </div>
      </section>

      {/* Personal Information */}

      <section className="
        space-y-6 rounded-3xl border border-slate-200
        bg-white p-5 shadow-sm dark:border-slate-800
        dark:bg-slate-900 sm:p-8
      ">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="
            flex h-11 w-11 items-center justify-center
            rounded-xl bg-blue-50 text-blue-600
            dark:bg-blue-950/40 dark:text-blue-400
          ">
            <UserRound size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              المعلومات الشخصية
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              المعلومات التي تظهر في ملفك الشخصي
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              الاسم الكامل
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              اسم المستخدم
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className={inputClass}
              dir="auto"
            />
          </div>

          <div>
            <label className={labelClass}>
              العمر
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="أدخل عمرك"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>
              نبذة عنك
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب نبذة قصيرة عن نفسك واهتماماتك..."
              className={`${inputClass} resize-y`}
            />
            <p className="mt-2 text-xs text-slate-400">
              شارك الآخرين اهتماماتك وما تحب أن يعرفوه عنك.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Information */}

      <section className="
        space-y-6 rounded-3xl border border-slate-200
        bg-white p-5 shadow-sm dark:border-slate-800
        dark:bg-slate-900 sm:p-8
      ">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="
            flex h-11 w-11 items-center justify-center
            rounded-xl bg-indigo-50 text-indigo-600
            dark:bg-indigo-950/40 dark:text-indigo-400
          ">
            <GraduationCap size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              المعلومات الجامعية
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              حدّد الكلية والتخصص الذي تنتمي إليه
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              الكلية
            </label>

            <select
              value={facultyId}
              onChange={(e) => {
                const value = e.target.value;
                setFacultyId(value);
                setSpecialtyId("");
                loadSpecialties(value);
              }}
              className={inputClass}
            >
              <option value="">اختر الكلية</option>

              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              التخصص
            </label>

            <select
              value={specialtyId}
              disabled={!facultyId}
              onChange={(e) => setSpecialtyId(e.target.value)}
              className={`
                ${inputClass}
                disabled:cursor-not-allowed
                disabled:opacity-50
              `}
            >
              <option value="">اختر التخصص</option>

              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Save */}

      <div className="
        flex flex-col-reverse gap-3 sm:flex-row
        sm:justify-end
      ">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          disabled={loading}
          className="
            rounded-xl border border-slate-200
            bg-white px-7 py-3.5 text-sm font-semibold
            text-slate-600 transition hover:bg-slate-50
            disabled:opacity-50
            dark:border-slate-700 dark:bg-slate-900
            dark:text-slate-300
          "
        >
          إلغاء
        </button>

        <button
          type="button"
          onClick={saveProfile}
          disabled={loading}
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl bg-gradient-to-l from-blue-600
            to-indigo-600 px-8 py-3.5 text-sm
            font-bold text-white shadow-lg
            shadow-blue-600/20 transition
            hover:-translate-y-0.5 hover:shadow-xl
            disabled:cursor-not-allowed disabled:opacity-60
            disabled:hover:translate-y-0
          "
        >
          {loading ? (
            <>
              <Loader2 size={19} className="animate-spin" />
              جارٍ حفظ التعديلات...
            </>
          ) : (
            <>
              <Save size={19} />
              حفظ التعديلات
            </>
          )}
        </button>
      </div>
    </div>
  );
}
