import { useEffect, useState } from "react";

import { getFaculties } from "../../faculties/api/faculties";
import { getSpecialtiesByFaculty } from "../../specialties/api/specialties";
import { getLevelsBySpecialty } from "../../levels/api/levels";
import { getSemestersByLevel } from "../../semesters/api/semesters";
import { getModulesBySemester } from "../../modules/api/modules";

import {
  addSubject,
  deleteSubject,
  getSubjectsByModule,
} from "../../subjects/api/subjects";

export default function SubjectsManagementPage() {
  // =====================================================
  // ACADEMIC DATA
  // =====================================================

  const [faculties, setFaculties] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // =====================================================
  // SELECTED IDS
  // =====================================================

  const [selectedFacultyId, setSelectedFacultyId] =
    useState("");

  const [selectedSpecialtyId, setSelectedSpecialtyId] =
    useState("");

  const [selectedLevelId, setSelectedLevelId] =
    useState("");

  const [selectedSemesterId, setSelectedSemesterId] =
    useState("");

  const [selectedModuleId, setSelectedModuleId] =
    useState("");

  // =====================================================
  // SUBJECT FORM
  // =====================================================

  const [subjectName, setSubjectName] =
    useState("");

  const [subjectDescription, setSubjectDescription] =
    useState("");

  // =====================================================
  // LOADING
  // =====================================================

  const [loadingFaculties, setLoadingFaculties] =
    useState(true);

  const [loadingSpecialties, setLoadingSpecialties] =
    useState(false);

  const [loadingLevels, setLoadingLevels] =
    useState(false);

  const [loadingSemesters, setLoadingSemesters] =
    useState(false);

  const [loadingModules, setLoadingModules] =
    useState(false);

  const [loadingSubjects, setLoadingSubjects] =
    useState(false);

  const [savingSubject, setSavingSubject] =
    useState(false);

  // =====================================================
  // MESSAGES
  // =====================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  // =====================================================
  // RESET SUBJECT FORM
  // =====================================================

  function resetSubjectForm() {
    setSubjectName("");
    setSubjectDescription("");
  }

  // =====================================================
  // LOAD FACULTIES
  // =====================================================

  useEffect(() => {
    async function loadFaculties() {
      try {
        setLoadingFaculties(true);
        clearMessages();

        const data = await getFaculties();

        setFaculties(data || []);
      } catch (err) {
        console.error(
          "SUBJECTS FACULTIES ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "فشل تحميل الكليات."
        );
      } finally {
        setLoadingFaculties(false);
      }
    }

    loadFaculties();
  }, []);

  // =====================================================
  // LOAD SPECIALTIES
  // =====================================================

  useEffect(() => {
    async function loadSpecialties() {
      setSpecialties([]);
      setLevels([]);
      setSemesters([]);
      setModules([]);
      setSubjects([]);

      setSelectedSpecialtyId("");
      setSelectedLevelId("");
      setSelectedSemesterId("");
      setSelectedModuleId("");

      resetSubjectForm();

      if (!selectedFacultyId) {
        return;
      }

      try {
        setLoadingSpecialties(true);
        clearMessages();

        const data =
          await getSpecialtiesByFaculty(
            selectedFacultyId
          );

        setSpecialties(data || []);
      } catch (err) {
        console.error(
          "SUBJECTS SPECIALTIES ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "فشل تحميل التخصصات."
        );
      } finally {
        setLoadingSpecialties(false);
      }
    }

    loadSpecialties();
  }, [selectedFacultyId]);

  // =====================================================
  // LOAD LEVELS
  // =====================================================

  useEffect(() => {
    async function loadLevels() {
      setLevels([]);
      setSemesters([]);
      setModules([]);
      setSubjects([]);

      setSelectedLevelId("");
      setSelectedSemesterId("");
      setSelectedModuleId("");

      resetSubjectForm();

      if (!selectedSpecialtyId) {
        return;
      }

      try {
        setLoadingLevels(true);
        clearMessages();

        const data =
          await getLevelsBySpecialty(
            selectedSpecialtyId
          );

        setLevels(data || []);
      } catch (err) {
        console.error(
          "SUBJECTS LEVELS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "فشل تحميل المستويات."
        );
      } finally {
        setLoadingLevels(false);
      }
    }

    loadLevels();
  }, [selectedSpecialtyId]);

  // =====================================================
  // LOAD SEMESTERS
  // =====================================================

  useEffect(() => {
    async function loadSemesters() {
      setSemesters([]);
      setModules([]);
      setSubjects([]);

      setSelectedSemesterId("");
      setSelectedModuleId("");

      resetSubjectForm();

      if (!selectedLevelId) {
        return;
      }

      try {
        setLoadingSemesters(true);
        clearMessages();

        const data =
          await getSemestersByLevel(
            selectedLevelId
          );

        setSemesters(data || []);
      } catch (err) {
        console.error(
          "SUBJECTS SEMESTERS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "فشل تحميل السداسيات."
        );
      } finally {
        setLoadingSemesters(false);
      }
    }

    loadSemesters();
  }, [selectedLevelId]);

  // =====================================================
  // LOAD MODULES
  // =====================================================

  async function loadModules(
    semesterId: string
  ) {
    if (!semesterId) {
      setModules([]);
      return;
    }

    try {
      setLoadingModules(true);
      clearMessages();

      const data =
        await getModulesBySemester(
          semesterId
        );

      setModules(data || []);
    } catch (err) {
      console.error(
        "SUBJECTS MODULES ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل تحميل الوحدات."
      );
    } finally {
      setLoadingModules(false);
    }
  }

  // =====================================================
  // SEMESTER CHANGE
  // =====================================================

  function handleSemesterChange(
    semesterId: string
  ) {
    setSelectedSemesterId(
      semesterId
    );

    setSelectedModuleId("");

    setModules([]);
    setSubjects([]);

    resetSubjectForm();
    clearMessages();

    if (!semesterId) {
      return;
    }

    loadModules(semesterId);
  }

  // =====================================================
  // LOAD SUBJECTS
  // =====================================================

  async function loadSubjects(
    moduleId: string
  ) {
    if (!moduleId) {
      setSubjects([]);
      return;
    }

    try {
      setLoadingSubjects(true);
      clearMessages();

      const data =
        await getSubjectsByModule(
          moduleId
        );

      setSubjects(data || []);
    } catch (err) {
      console.error(
        "SUBJECTS LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل تحميل المواد."
      );
    } finally {
      setLoadingSubjects(false);
    }
  }

  // =====================================================
  // MODULE CHANGE
  // =====================================================

  function handleModuleChange(
    moduleId: string
  ) {
    setSelectedModuleId(
      moduleId
    );

    setSubjects([]);

    resetSubjectForm();
    clearMessages();

    if (!moduleId) {
      return;
    }

    loadSubjects(moduleId);
  }

  // =====================================================
  // CREATE SUBJECT
  // =====================================================

  async function handleCreateSubject() {
    if (!selectedSpecialtyId) {
      setError(
        "يرجى اختيار التخصص."
      );

      return;
    }

    if (!selectedModuleId) {
      setError(
        "يرجى اختيار الوحدة."
      );

      return;
    }

    if (!subjectName.trim()) {
      setError(
        "يرجى إدخال اسم المادة."
      );

      return;
    }

    try {
      setSavingSubject(true);
      clearMessages();

      const newSubject =
        await addSubject(
          subjectName,
          subjectDescription,
          selectedSpecialtyId,
          selectedModuleId
        );

      setSubjects((current) => [
        ...current,
        newSubject,
      ]);

      resetSubjectForm();

      setSuccess(
        "تم إنشاء المادة بنجاح."
      );
    } catch (err) {
      console.error(
        "CREATE SUBJECT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل إنشاء المادة."
      );
    } finally {
      setSavingSubject(false);
    }
  }

  // =====================================================
  // DELETE SUBJECT
  // =====================================================

  async function handleDeleteSubject(
    subjectId: string
  ) {
    const confirmed =
      window.confirm(
        "هل أنت متأكد من حذف هذه المادة؟"
      );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await deleteSubject(
        subjectId
      );

      setSubjects((current) =>
        current.filter(
          (subject) =>
            subject.id !== subjectId
        )
      );

      setSuccess(
        "تم حذف المادة بنجاح."
      );
    } catch (err) {
      console.error(
        "DELETE SUBJECT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "فشل حذف المادة."
      );
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      dir="rtl"
      className="space-y-6 p-6"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold">
          إدارة المقاييس
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          أنشئ وأدر المقاييس المرتبطة بالوحدات
          والتخصصات الأكاديمية.
        </p>
      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* =================================================
          ACADEMIC PATH
      ================================================= */}

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          المسار الأكاديمي
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Faculty */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              الكلية
            </label>

            <select
              value={selectedFacultyId}
              onChange={(e) =>
                setSelectedFacultyId(
                  e.target.value
                )
              }
              disabled={
                loadingFaculties
              }
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="">
                {loadingFaculties
                  ? "جاري تحميل الكليات..."
                  : "اختر الكلية"}
              </option>

              {faculties.map(
                (faculty) => (
                  <option
                    key={faculty.id}
                    value={faculty.id}
                  >
                    {faculty.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Specialty */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              التخصص
            </label>

            <select
              value={
                selectedSpecialtyId
              }
              onChange={(e) =>
                setSelectedSpecialtyId(
                  e.target.value
                )
              }
              disabled={
                !selectedFacultyId ||
                loadingSpecialties
              }
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="">
                {!selectedFacultyId
                  ? "اختر الكلية أولًا"
                  : loadingSpecialties
                  ? "جاري تحميل التخصصات..."
                  : "اختر التخصص"}
              </option>

              {specialties.map(
                (specialty) => (
                  <option
                    key={specialty.id}
                    value={
                      specialty.id
                    }
                  >
                    {specialty.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Level */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              المستوى
            </label>

            <select
              value={
                selectedLevelId
              }
              onChange={(e) =>
                setSelectedLevelId(
                  e.target.value
                )
              }
              disabled={
                !selectedSpecialtyId ||
                loadingLevels
              }
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="">
                {!selectedSpecialtyId
                  ? "اختر التخصص أولًا"
                  : loadingLevels
                  ? "جاري تحميل المستويات..."
                  : "اختر المستوى"}
              </option>

              {levels.map(
                (level) => (
                  <option
                    key={level.id}
                    value={level.id}
                  >
                    {level.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Semester */}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              السداسي
            </label>

            <select
              value={
                selectedSemesterId
              }
              onChange={(e) =>
                handleSemesterChange(
                  e.target.value
                )
              }
              disabled={
                !selectedLevelId ||
                loadingSemesters
              }
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="">
                {!selectedLevelId
                  ? "اختر المستوى أولًا"
                  : loadingSemesters
                  ? "جاري تحميل السداسيات..."
                  : semesters.length ===
                    0
                  ? "لا توجد سداسيات"
                  : "اختر السداسي"}
              </option>

              {semesters.map(
                (semester) => (
                  <option
                    key={semester.id}
                    value={
                      semester.id
                    }
                  >
                    {semester.name ||
                      `السداسي ${semester.semester_number}`}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Module */}

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">
              الوحدة
            </label>

            <select
              value={
                selectedModuleId
              }
              onChange={(e) =>
                handleModuleChange(
                  e.target.value
                )
              }
              disabled={
                !selectedSemesterId ||
                loadingModules
              }
              className="w-full rounded-lg border bg-white px-3 py-2"
            >
              <option value="">
                {!selectedSemesterId
                  ? "اختر السداسي أولًا"
                  : loadingModules
                  ? "جاري تحميل الوحدات..."
                  : modules.length ===
                    0
                  ? "لا توجد وحدات"
                  : "اختر الوحدة"}
              </option>

              {modules.map(
                (module) => (
                  <option
                    key={module.id}
                    value={module.id}
                  >
                    {module.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* =================================================
          CREATE SUBJECT
      ================================================= */}

      {selectedModuleId && (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              إضافة مقياس جديد
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              أضف المقياس إلى الوحدة الأكاديمية
              المحددة.
            </p>
          </div>

          <div className="space-y-4">
            {/* Name */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                اسم المقياس
              </label>

              <input
                type="text"
                value={subjectName}
                onChange={(e) =>
                  setSubjectName(
                    e.target.value
                  )
                }
                placeholder="مثال: مدخل إلى اللسانيات"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                الوصف
              </label>

              <textarea
                value={
                  subjectDescription
                }
                onChange={(e) =>
                  setSubjectDescription(
                    e.target.value
                  )
                }
                placeholder="وصف مختصر للمقياس (اختياري)"
                rows={3}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Actions */}

            <div>
              <button
                type="button"
                onClick={
                  handleCreateSubject
                }
                disabled={
                  savingSubject ||
                  !subjectName.trim()
                }
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingSubject
                  ? "جاري الحفظ..."
                  : "إضافة المقياس"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SUBJECTS LIST
      ================================================= */}

      {selectedModuleId && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                مقاييس الوحدة
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {
                  modules.find(
                    (module) =>
                      module.id ===
                      selectedModuleId
                  )?.name
                }
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {subjects.length}{" "}
              {subjects.length === 1
                ? "مقياس"
                : "مقاييس"}
            </span>
          </div>

          {loadingSubjects ? (
            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
              جاري تحميل المقاييس...
            </div>
          ) : subjects.length ===
            0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
              لا توجد مقاييس لهذه الوحدة حاليًا.
              <div className="mt-2 text-sm">
                يمكنك إضافة أول مقياس من النموذج أعلاه.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {subjects.map(
                (subject, index) => (
                  <div
                    key={subject.id}
                    className="rounded-xl border bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold">
                            {subject.name}
                          </h3>

                          {subject.description && (
                            <p className="mt-1 text-sm text-gray-500">
                              {
                                subject.description
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSubject(
                            subject.id
                          )
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}