
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../auth/context/AuthContext";

interface Faculty {
  id: string;
  name: string;
}

interface Specialty {
  id: string;
  name: string;
}

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { reloadProfile } = useAuth();

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [facultyId, setFacultyId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);
      setFullName(user.user_metadata?.full_name ?? "");

      const { data, error } = await supabase
        .from("faculties")
        .select("id,name")
        .order("name");

      if (error) {
        console.error("FACULTIES ERROR:", error);
        alert("تعذر تحميل قائمة الكليات");
        return;
      }

      setFaculties(data ?? []);
    }

    void init();
  }, [navigate]);

  async function loadSpecialties(id: string) {
    setFacultyId(id);
    setSpecialtyId("");
    setSpecialties([]);

    if (!id) return;

    const { data, error } = await supabase
      .from("specialties")
      .select("id,name")
      .eq("faculty_id", id)
      .order("name");

    if (error) {
      console.error("SPECIALTIES ERROR:", error);
      alert("تعذر تحميل التخصصات");
      return;
    }

    setSpecialties(data ?? []);
  }

  async function saveProfile() {
    const cleanUsername = username.trim();
    const numericAge = Number(age);

    if (
      !cleanUsername ||
      !age ||
      !facultyId ||
      !specialtyId ||
      !Number.isFinite(numericAge) ||
      numericAge <= 0
    ) {
      alert("أكمل جميع المعلومات بشكل صحيح");
      return;
    }

    if (!userId) {
      alert("لم يتم التعرف على المستخدم، يرجى تسجيل الدخول مجدداً");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            full_name: fullName,
            username: cleanUsername,
            age: numericAge,
            faculty_id: facultyId,
            specialty_id: specialtyId,
            role: "student",
          },
          {
            onConflict: "user_id",
          }
        );

      if (error) throw error;

      // تحديث بيانات المستخدم داخل AuthContext
      await reloadProfile();

      // التأكد من أن البيانات حُفظت فعلاً
      const {
        data: savedProfile,
        error: verifyError,
      } = await supabase
        .from("profiles")
        .select("username,age,faculty_id,specialty_id")
        .eq("user_id", userId)
        .single();

      if (verifyError) throw verifyError;

      const profileComplete =
        !!savedProfile?.username?.trim() &&
        !!savedProfile?.age &&
        !!savedProfile?.faculty_id &&
        !!savedProfile?.specialty_id;

      if (!profileComplete) {
        throw new Error(
          "تم الحفظ لكن بعض المعلومات المطلوبة ما زالت ناقصة"
        );
      }

      alert("تم حفظ الملف الشخصي بنجاح ✅");

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      console.error("PROFILE ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "فشل حفظ الملف الشخصي"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-5">
      <h1 className="text-3xl font-bold">
        أكمل ملفك الشخصي 🎓
      </h1>

      <input
        placeholder="اسم المستخدم"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border rounded-xl p-3"
      />

      <input
        type="number"
        min="1"
        placeholder="العمر"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full border rounded-xl p-3"
      />

      <select
        value={facultyId}
        onChange={(e) => loadSpecialties(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">اختر الكلية</option>

        {faculties.map((faculty) => (
          <option key={faculty.id} value={faculty.id}>
            {faculty.name}
          </option>
        ))}
      </select>

      <select
        disabled={!facultyId}
        value={specialtyId}
        onChange={(e) => setSpecialtyId(e.target.value)}
        className="w-full border rounded-xl p-3"
      >
        <option value="">اختر التخصص</option>

        {specialties.map((specialty) => (
          <option key={specialty.id} value={specialty.id}>
            {specialty.name}
          </option>
        ))}
      </select>

      <button
        onClick={saveProfile}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold disabled:opacity-50"
      >
        {loading ? "جاري الحفظ..." : "حفظ الملف الشخصي"}
      </button>
    </div>
  );
}
