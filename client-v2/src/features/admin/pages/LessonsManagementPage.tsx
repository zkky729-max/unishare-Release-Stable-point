import { useEffect, useState } from "react";

import {
  getAdminFaculties,
  getAdminSpecialtiesByFaculty,
  getAdminLevelsBySpecialty,
  getAdminSemestersByLevel,
  getAdminModulesBySemester,
  getAdminSubjectsByModule,
  getAdminLessonsBySubject,
  createAdminLesson,
  deleteAdminLesson,
  type AdminFaculty,
  type AdminSpecialty,
  type AdminLevel,
  type AdminSemester,
  type AdminModule,
  type AdminSubject,
  type AdminLesson,
} from "../api/adminAcademic";

export default function LessonsManagementPage() {
  // =====================================================
  // HIERARCHY
  // =====================================================

  const [faculties, setFaculties] = useState<AdminFaculty[]>([]);
  const [specialties, setSpecialties] = useState<AdminSpecialty[]>([]);
  const [levels, setLevels] = useState<AdminLevel[]>([]);
  const [semesters, setSemesters] = useState<AdminSemester[]>([]);
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);

  // =====================================================
  // SELECTED VALUES
  // =====================================================

  const [facultyId, setFacultyId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [levelId, setLevelId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // =====================================================
  // LOAD FACULTIES
  // =====================================================

  useEffect(() => {
    async function loadFaculties() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminFaculties();

        setFaculties(data);
      } catch (err) {
        console.error("LOAD FACULTIES ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل الكليات."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFaculties();
  }, []);

  // =====================================================
  // FACULTY → SPECIALTIES
  // =====================================================

  useEffect(() => {
    if (!facultyId) {
      setSpecialties([]);
      setSpecialtyId("");
      return;
    }

    async function loadSpecialties() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminSpecialtiesByFaculty(
            facultyId
          );

        setSpecialties(data);
      } catch (err) {
        console.error(
          "LOAD SPECIALTIES ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل التخصصات."
        );

        setSpecialties([]);
      } finally {
        setLoading(false);
      }
    }

    loadSpecialties();

    setSpecialtyId("");
    setLevelId("");
    setSemesterId("");
    setModuleId("");
    setSubjectId("");

    setLevels([]);
    setSemesters([]);
    setModules([]);
    setSubjects([]);
    setLessons([]);
  }, [facultyId]);

  // =====================================================
  // SPECIALTY → LEVELS
  // =====================================================

  useEffect(() => {
    if (!specialtyId) {
      setLevels([]);
      setLevelId("");
      return;
    }

    async function loadLevels() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminLevelsBySpecialty(
            specialtyId
          );

        setLevels(data);
      } catch (err) {
        console.error(
          "LOAD LEVELS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل المستويات."
        );

        setLevels([]);
      } finally {
        setLoading(false);
      }
    }

    loadLevels();

    setLevelId("");
    setSemesterId("");
    setModuleId("");
    setSubjectId("");

    setSemesters([]);
    setModules([]);
    setSubjects([]);
    setLessons([]);
  }, [specialtyId]);

  // =====================================================
  // LEVEL → SEMESTERS
  // =====================================================

  useEffect(() => {
    if (!levelId) {
      setSemesters([]);
      setSemesterId("");
      return;
    }

    async function loadSemesters() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminSemestersByLevel(
            levelId
          );

        setSemesters(data);
      } catch (err) {
        console.error(
          "LOAD SEMESTERS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل السداسيات."
        );

        setSemesters([]);
      } finally {
        setLoading(false);
      }
    }

    loadSemesters();

    setSemesterId("");
    setModuleId("");
    setSubjectId("");

    setModules([]);
    setSubjects([]);
    setLessons([]);
  }, [levelId]);

  // =====================================================
  // SEMESTER → MODULES
  // =====================================================

  useEffect(() => {
    if (!semesterId) {
      setModules([]);
      setModuleId("");
      return;
    }

    async function loadModules() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminModulesBySemester(
            semesterId
          );

        setModules(data);
      } catch (err) {
        console.error(
          "LOAD MODULES ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل المقاييس."
        );

        setModules([]);
      } finally {
        setLoading(false);
      }
    }

    loadModules();

    setModuleId("");
    setSubjectId("");

    setSubjects([]);
    setLessons([]);
  }, [semesterId]);

  // =====================================================
  // MODULE → SUBJECTS
  // =====================================================

  useEffect(() => {
    if (!moduleId) {
      setSubjects([]);
      setSubjectId("");
      return;
    }

    async function loadSubjects() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminSubjectsByModule(
            moduleId
          );

        setSubjects(data);
      } catch (err) {
        console.error(
          "LOAD SUBJECTS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل المواد."
        );

        setSubjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();

    setSubjectId("");
    setLessons([]);
  }, [moduleId]);

  // =====================================================
  // SUBJECT → LESSONS
  // =====================================================

  useEffect(() => {
    if (!subjectId) {
      setLessons([]);
      return;
    }

    async function loadLessons() {
      try {
        setLoadingLessons(true);
        setError("");

        const data =
          await getAdminLessonsBySubject(
            subjectId
          );

        setLessons(data);
      } catch (err) {
        console.error(
          "LOAD LESSONS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل الدروس."
        );

        setLessons([]);
      } finally {
        setLoadingLessons(false);
      }
    }

    loadLessons();
  }, [subjectId]);

  // =====================================================
  // ADD LESSON
  // =====================================================

  async function handleAddLesson() {
    const cleanTitle = title.trim();

    if (!subjectId) {
      setError("يرجى اختيار المادة أولًا.");
      return;
    }

    if (!cleanTitle) {
      setError("يرجى كتابة عنوان الدرس.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newLesson =
        await createAdminLesson({
          subject_id: subjectId,
          title: cleanTitle,
          description:
            description.trim() || null,
          content:
            content.trim() || null,
        });

      setLessons((current) => [
        ...current,
        newLesson,
      ]);

      setTitle("");
      setDescription("");
      setContent("");
      setShowForm(false);
    } catch (err) {
      console.error(
        "CREATE LESSON ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر إضافة الدرس."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // DELETE LESSON
  // =====================================================

  async function handleDeleteLesson(
    lessonId: string
  ) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا الدرس؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(lessonId);
      setError("");

      await deleteAdminLesson(lessonId);

      setLessons((current) =>
        current.filter(
          (lesson) => lesson.id !== lessonId
        )
      );
    } catch (err) {
      console.error(
        "DELETE LESSON ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "تعذر حذف الدرس."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // RESET BELOW HIERARCHY
  // =====================================================

  function handleFacultyChange(
    value: string
  ) {
    setFacultyId(value);
  }

  function handleSpecialtyChange(
    value: string
  ) {
    setSpecialtyId(value);
  }

  function handleLevelChange(
    value: string
  ) {
    setLevelId(value);
  }

  function handleSemesterChange(
    value: string
  ) {
    setSemesterId(value);
  }

  function handleModuleChange(
    value: string
  ) {
    setModuleId(value);
  }

  function handleSubjectChange(
    value: string
  ) {
    setSubjectId(value);
    setShowForm(false);
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
      {/* HEADER */}
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
            إدارة الدروس
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "15px",
              color: "#64748b",
            }}
          >
            إدارة وتنظيم الدروس داخل منصة
            UniShare
          </p>
        </div>

        {subjectId && (
          <button
            type="button"
            onClick={() =>
              setShowForm((value) => !value)
            }
            style={{
              border: "none",
              borderRadius: "12px",
              padding: "12px 20px",
              background:
                "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow:
                "0 8px 20px rgba(59, 130, 246, 0.18)",
            }}
          >
            {showForm
              ? "إلغاء"
              : "+ إضافة درس"}
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* ACADEMIC HIERARCHY */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow:
            "0 4px 16px rgba(15, 23, 42, 0.05)",
        }}
      >
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: "19px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          المسار الأكاديمي
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {/* FACULTY */}
          <div>
            <label
              htmlFor="faculty"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              الكلية
            </label>

            <select
              id="faculty"
              value={facultyId}
              onChange={(event) =>
                handleFacultyChange(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "12px 14px",
                background: "#ffffff",
                color: "#111827",
                fontSize: "14px",
              }}
            >
              <option value="">
                اختر الكلية
              </option>

              {faculties.map((faculty) => (
                <option
                  key={faculty.id}
                  value={faculty.id}
                >
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          {/* SPECIALTY */}
          <div>
            <label
              htmlFor="specialty"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              التخصص
            </label>

            <select
              id="specialty"
              value={specialtyId}
              onChange={(event) =>
                handleSpecialtyChange(
                  event.target.value
                )
              }
              disabled={!facultyId}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "12px 14px",
                background: !facultyId
                  ? "#f1f5f9"
                  : "#ffffff",
                color: "#111827",
                fontSize: "14px",
              }}
            >
              <option value="">
                اختر التخصص
              </option>

              {specialties.map(
                (specialty) => (
                  <option
                    key={specialty.id}
                    value={specialty.id}
                  >
                    {specialty.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* LEVEL */}
          <div>
            <label
              htmlFor="level"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              المستوى
            </label>

            <select
              id="level"
              value={levelId}
              onChange={(event) =>
                handleLevelChange(
                  event.target.value
                )
              }
              disabled={!specialtyId}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "12px 14px",
                background: !specialtyId
                  ? "#f1f5f9"
                  : "#ffffff",
                color: "#111827",
                fontSize: "14px",
              }}
            >
              <option value="">
                اختر المستوى
              </option>

              {levels.map((level) => (
                <option
                  key={level.id}
                  value={level.id}
                >
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* SEMESTER */}
          <div>
            <label
              htmlFor="semester"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              السداسي
            </label>

            <select
              id="semester"
              value={semesterId}
              onChange={(event) =>
                handleSemesterChange(
                  event.target.value
                )
              }
              disabled={!levelId}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "12px 14px",
                background: !levelId
                  ? "#f1f5f9"
                  : "#ffffff",
                color: "#111827",
                fontSize: "14px",
              }}
            >
              <option value="">
                اختر السداسي
              </option>

              {semesters.map(
                (semester) => (
                  <option
                    key={semester.id}
                    value={semester.id}
                  >
                    {semester.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* MODULE */}
          <div>
            <label
              htmlFor="module"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              المقياس
            </label>

            <select
              id="module"
              value={moduleId}
              onChange={(event) =>
                handleModuleChange(
                  event.target.value
                )
              }
              disabled={!semesterId}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "12px 14px",
                background: !semesterId
                  ? "#f1f5f9"
                  : "#ffffff",
                color: "#111827",
                fontSize: "14px",
              }}
            >
              <option value="">
                اختر المقياس
              </option>

              {modules.map((module) => (
                <option
                  key={module.id}
                  value={module.id}
                >
                  {module.name}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT */}
          <div>
            <label
              htmlFor="subject"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              المادة
            </label>

            <select
              id="subject"
              value={subjectId}
              onChange={(event) =>
                handleSubjectChange(
                  event.target.value
                )
              }
              disabled={!moduleId}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                padding: "12px 14px",
                background: !moduleId
                  ? "#f1f5f9"
                  : "#ffffff",
                color: "#111827",
                fontSize: "14px",
              }}
            >
              <option value="">
                اختر المادة
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div
            style={{
              marginTop: "16px",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            جاري تحميل البيانات...
          </div>
        )}
      </div>

      {/* SELECTED SUBJECT */}
      {subjectId && (
        <div
          style={{
            background:
              "linear-gradient(135deg, #eff6ff, #eef2ff)",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginBottom: "4px",
            }}
          >
            المادة المحددة
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "#1e3a8a",
            }}
          >
            {
              subjects.find(
                (subject) =>
                  subject.id === subjectId
              )?.name
            }
          </div>
        </div>
      )}

      {/* ADD LESSON FORM */}
      {showForm && subjectId && (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            boxShadow:
              "0 4px 16px rgba(15, 23, 42, 0.05)",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            إضافة درس جديد
          </h2>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {/* TITLE */}
            <div>
              <label
                htmlFor="lesson-title"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                عنوان الدرس
              </label>

              <input
                id="lesson-title"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="اكتب عنوان الدرس"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  outline: "none",
                  fontSize: "15px",
                  background: "#ffffff",
                  color: "#111827",
                }}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="lesson-description"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                وصف الدرس
              </label>

              <textarea
                id="lesson-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="اكتب وصفًا مختصرًا للدرس"
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  outline: "none",
                  resize: "vertical",
                  fontSize: "15px",
                  background: "#ffffff",
                  color: "#111827",
                }}
              />
            </div>

            {/* CONTENT */}
            <div>
              <label
                htmlFor="lesson-content"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                محتوى الدرس
              </label>

              <textarea
                id="lesson-content"
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder="اكتب محتوى الدرس"
                rows={8}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  outline: "none",
                  resize: "vertical",
                  fontSize: "15px",
                  background: "#ffffff",
                  color: "#111827",
                  lineHeight: 1.8,
                }}
              />
            </div>

            {/* SAVE */}
            <div>
              <button
                type="button"
                onClick={handleAddLesson}
                disabled={saving}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "11px 20px",
                  background: saving
                    ? "#94a3b8"
                    : "#3b82f6",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {saving
                  ? "جاري الحفظ..."
                  : "حفظ الدرس"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATISTICS */}
      {subjectId && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
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
              إجمالي الدروس
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {lessons.length}
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
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
              المنشورة
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#16a34a",
              }}
            >
              {lessons.length}
            </div>
          </div>
        </div>
      )}

      {/* LESSONS LIST */}
      <div
        style={{
          background: "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom:
              "1px solid #e5e7eb",
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
            قائمة الدروس
          </h2>
        </div>

        {!subjectId ? (
          <div
            style={{
              padding: "60px 20px",
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
              📚
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#334155",
                fontSize: "18px",
              }}
            >
              اختر المادة أولًا
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
              }}
            >
              اختر الكلية ثم التخصص والمستوى
              والسداسي والمقياس ثم المادة لعرض
              الدروس.
            </p>
          </div>
        ) : loadingLessons ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              ⏳
            </div>

            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              جاري تحميل الدروس...
            </div>
          </div>
        ) : lessons.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
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
              📚
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#334155",
                fontSize: "18px",
              }}
            >
              لا توجد دروس حاليًا
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
              }}
            >
              لم تتم إضافة أي درس لهذا المقياس
              حتى الآن.
            </p>
          </div>
        ) : (
          <div>
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                style={{
                  padding: "20px 24px",
                  borderBottom:
                    "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: "220px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {lesson.title}
                  </h3>

                  {lesson.description && (
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "14px",
                        color: "#64748b",
                      }}
                    >
                      {lesson.description}
                    </p>
                  )}

                  {lesson.content && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#94a3b8",
                        whiteSpace:
                          "pre-wrap",
                        maxWidth: "800px",
                      }}
                    >
                      {lesson.content.length >
                      180
                        ? `${lesson.content.slice(
                            0,
                            180
                          )}...`
                        : lesson.content}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      padding:
                        "5px 10px",
                      borderRadius:
                        "999px",
                      background: "#dcfce7",
                      color: "#166534",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    منشور
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteLesson(
                        lesson.id
                      )
                    }
                    disabled={
                      deletingId ===
                      lesson.id
                    }
                    style={{
                      border:
                        "1px solid #fecaca",
                      borderRadius: "9px",
                      padding:
                        "8px 12px",
                      background:
                        deletingId ===
                        lesson.id
                          ? "#f8fafc"
                          : "#ffffff",
                      color: "#dc2626",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor:
                        deletingId ===
                        lesson.id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {deletingId ===
                    lesson.id
                      ? "جاري الحذف..."
                      : "حذف"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}