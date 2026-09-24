import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createAdminModule,
  getAdminModulesBySemester,
  type AdminModule,
  type AdminSemester,
} from "../api/adminAcademic";

import {
  getAdminFaculties,
  getAdminSpecialtiesByFaculty,
  getAdminLevelsBySpecialty,
  getAdminSemestersByLevel,
  type AdminFaculty,
  type AdminSpecialty,
  type AdminLevel,
} from "../api/adminAcademic";

export default function ModulesManagementPage() {
  const [faculties, setFaculties] = useState<
    AdminFaculty[]
  >([]);

  const [specialties, setSpecialties] = useState<
    AdminSpecialty[]
  >([]);

  const [levels, setLevels] = useState<
    AdminLevel[]
  >([]);

  const [semesters, setSemesters] = useState<
    AdminSemester[]
  >([]);

  const [modules, setModules] = useState<
    AdminModule[]
  >([]);

  const [selectedFacultyId, setSelectedFacultyId] =
    useState("");

  const [selectedSpecialtyId, setSelectedSpecialtyId] =
    useState("");

  const [selectedLevelId, setSelectedLevelId] =
    useState("");

  const [selectedSemesterId, setSelectedSemesterId] =
    useState("");

  const [name, setName] = useState("");

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

  const [creating, setCreating] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     LOAD FACULTIES
  ===================================================== */

  async function loadFaculties() {
    try {
      setLoadingFaculties(true);
      setError("");

      const data = await getAdminFaculties();

      setFaculties(data);
    } catch (err) {
      console.error(
        "ADMIN FACULTIES LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load faculties."
      );
    } finally {
      setLoadingFaculties(false);
    }
  }

  useEffect(() => {
    loadFaculties();
  }, []);

  /* =====================================================
     LOAD SPECIALTIES
  ===================================================== */

  async function loadSpecialties(
    facultyId: string
  ) {
    if (!facultyId) {
      setSpecialties([]);
      return;
    }

    try {
      setLoadingSpecialties(true);
      setError("");

      const data =
        await getAdminSpecialtiesByFaculty(
          facultyId
        );

      setSpecialties(data);
    } catch (err) {
      console.error(
        "ADMIN SPECIALTIES LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load specialties."
      );
    } finally {
      setLoadingSpecialties(false);
    }
  }

  /* =====================================================
     LOAD LEVELS
  ===================================================== */

  async function loadLevels(
    specialtyId: string
  ) {
    if (!specialtyId) {
      setLevels([]);
      return;
    }

    try {
      setLoadingLevels(true);
      setError("");

      const data =
        await getAdminLevelsBySpecialty(
          specialtyId
        );

      setLevels(data);
    } catch (err) {
      console.error(
        "ADMIN LEVELS LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load levels."
      );
    } finally {
      setLoadingLevels(false);
    }
  }

  /* =====================================================
     LOAD SEMESTERS
  ===================================================== */

  async function loadSemesters(
    levelId: string
  ) {
    if (!levelId) {
      setSemesters([]);
      return;
    }

    try {
      setLoadingSemesters(true);
      setError("");

      const data =
        await getAdminSemestersByLevel(
          levelId
        );

      setSemesters(
        data
          .slice()
          .sort(
            (a, b) =>
              (a.semester_number ?? 0) -
              (b.semester_number ?? 0)
          )
      );
    } catch (err) {
      console.error(
        "ADMIN SEMESTERS LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load semesters."
      );
    } finally {
      setLoadingSemesters(false);
    }
  }

  /* =====================================================
     LOAD MODULES
  ===================================================== */

  async function loadModules(
    semesterId: string
  ) {
    if (!semesterId) {
      setModules([]);
      return;
    }

    try {
      setLoadingModules(true);
      setError("");

      const data =
        await getAdminModulesBySemester(
          semesterId
        );

      setModules(data);
    } catch (err) {
      console.error(
        "ADMIN MODULES LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load modules."
      );
    } finally {
      setLoadingModules(false);
    }
  }

  /* =====================================================
     FACULTY CHANGE
  ===================================================== */

  function handleFacultyChange(
    facultyId: string
  ) {
    setSelectedFacultyId(facultyId);

    setSelectedSpecialtyId("");
    setSelectedLevelId("");
    setSelectedSemesterId("");

    setSpecialties([]);
    setLevels([]);
    setSemesters([]);
    setModules([]);

    setName("");

    setError("");
    setSuccess("");

    if (!facultyId) {
      return;
    }

    loadSpecialties(facultyId);
  }

  /* =====================================================
     SPECIALTY CHANGE
  ===================================================== */

  function handleSpecialtyChange(
    specialtyId: string
  ) {
    setSelectedSpecialtyId(specialtyId);

    setSelectedLevelId("");
    setSelectedSemesterId("");

    setLevels([]);
    setSemesters([]);
    setModules([]);

    setName("");

    setError("");
    setSuccess("");

    if (!specialtyId) {
      return;
    }

    loadLevels(specialtyId);
  }

  /* =====================================================
     LEVEL CHANGE
  ===================================================== */

  function handleLevelChange(
    levelId: string
  ) {
    setSelectedLevelId(levelId);

    setSelectedSemesterId("");

    setSemesters([]);
    setModules([]);

    setName("");

    setError("");
    setSuccess("");

    if (!levelId) {
      return;
    }

    loadSemesters(levelId);
  }

  /* =====================================================
     SEMESTER CHANGE
  ===================================================== */

  function handleSemesterChange(
    semesterId: string
  ) {
    setSelectedSemesterId(semesterId);

    setModules([]);

    setName("");

    setError("");
    setSuccess("");

    if (!semesterId) {
      return;
    }

    loadModules(semesterId);
  }

  /* =====================================================
     CREATE MODULE
  ===================================================== */

  async function handleCreateModule(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();

    if (!selectedFacultyId) {
      setError("Please select a faculty.");
      return;
    }

    if (!selectedSpecialtyId) {
      setError("Please select a specialty.");
      return;
    }

    if (!selectedLevelId) {
      setError("Please select a level.");
      return;
    }

    if (!selectedSemesterId) {
      setError("Please select a semester.");
      return;
    }

    if (!cleanName) {
      setError("Module name is required.");
      return;
    }

    const duplicate = modules.some(
      (module) =>
        module.name.trim().toLowerCase() ===
        cleanName.toLowerCase()
    );

    if (duplicate) {
      setError(
        "A module with this name already exists in this semester."
      );
      return;
    }

    try {
      setCreating(true);

      const module =
        await createAdminModule({
          name: cleanName,
          specialty_id:
            selectedSpecialtyId,
          semester_id:
            selectedSemesterId,
          year_id: null,
        });

      setModules((current) => [
        ...current,
        module,
      ]);

      setName("");

      setSuccess(
        "Module created successfully."
      );
    } catch (err) {
      console.error(
        "ADMIN MODULE CREATE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create module."
      );
    } finally {
      setCreating(false);
    }
  }

  /* =====================================================
     SELECTED DATA
  ===================================================== */

  const selectedFaculty =
    faculties.find(
      (faculty) =>
        faculty.id === selectedFacultyId
    );

  const selectedSpecialty =
    specialties.find(
      (specialty) =>
        specialty.id === selectedSpecialtyId
    );

  const selectedLevel =
    levels.find(
      (level) =>
        level.id === selectedLevelId
    );

  const selectedSemester =
    semesters.find(
      (semester) =>
        semester.id === selectedSemesterId
    );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-8 p-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Modules Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage academic modules inside each semester.
        </p>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* =================================================
          FACULTY
      ================================================= */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            1. Select Faculty
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose the faculty.
          </p>
        </div>

        <select
          value={selectedFacultyId}
          onChange={(event) =>
            handleFacultyChange(
              event.target.value
            )
          }
          disabled={loadingFaculties}
          className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">
            {loadingFaculties
              ? "Loading faculties..."
              : "Select Faculty"}
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

        {selectedFaculty && (
          <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-400">
              Selected Faculty
            </p>

            <p className="mt-1 font-medium">
              {selectedFaculty.name}
            </p>
          </div>
        )}
      </section>

      {/* =================================================
          SPECIALTY
      ================================================= */}

      {selectedFacultyId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              2. Select Specialty
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the specialty.
            </p>
          </div>

          <select
            value={selectedSpecialtyId}
            onChange={(event) =>
              handleSpecialtyChange(
                event.target.value
              )
            }
            disabled={
              loadingSpecialties
            }
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {loadingSpecialties
                ? "Loading specialties..."
                : specialties.length === 0
                ? "No specialties found"
                : "Select Specialty"}
            </option>

            {specialties.map((specialty) => (
              <option
                key={specialty.id}
                value={specialty.id}
              >
                {specialty.name}
              </option>
            ))}
          </select>

          {selectedSpecialty && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">
                Selected Specialty
              </p>

              <p className="mt-1 font-medium">
                {selectedSpecialty.name}
              </p>
            </div>
          )}
        </section>
      )}

      {/* =================================================
          LEVEL
      ================================================= */}

      {selectedSpecialtyId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              3. Select Level
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the academic level.
            </p>
          </div>

          <select
            value={selectedLevelId}
            onChange={(event) =>
              handleLevelChange(
                event.target.value
              )
            }
            disabled={loadingLevels}
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {loadingLevels
                ? "Loading levels..."
                : levels.length === 0
                ? "No levels found"
                : "Select Level"}
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

          {selectedLevel && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">
                Selected Level
              </p>

              <p className="mt-1 font-medium">
                {selectedLevel.name}
              </p>
            </div>
          )}
        </section>
      )}

      {/* =================================================
          SEMESTER
      ================================================= */}

      {selectedLevelId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              4. Select Semester
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the semester that contains the module.
            </p>
          </div>

          <select
            value={selectedSemesterId}
            onChange={(event) =>
              handleSemesterChange(
                event.target.value
              )
            }
            disabled={loadingSemesters}
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {loadingSemesters
                ? "Loading semesters..."
                : semesters.length === 0
                ? "No semesters found"
                : "Select Semester"}
            </option>

            {semesters.map((semester) => (
              <option
                key={semester.id}
                value={semester.id}
              >
                {semester.name}
                {semester.semester_number
                  ? ` — S${semester.semester_number}`
                  : ""}
              </option>
            ))}
          </select>

          {selectedSemester && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">
                Selected Semester
              </p>

              <p className="mt-1 font-medium">
                {selectedSemester.name}
              </p>
            </div>
          )}
        </section>
      )}

      {/* =================================================
          CREATE MODULE
      ================================================= */}

      {selectedSemesterId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              5. Create Module
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new module to{" "}
              <span className="font-medium text-gray-700">
                {selectedSemester?.name}
              </span>
              .
            </p>
          </div>

          <form
            onSubmit={handleCreateModule}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label
                htmlFor="module-name"
                className="text-sm font-medium"
              >
                Module Name
              </label>

              <input
                id="module-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: Mathematics"
                disabled={creating}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            <div className="rounded-xl border border-dashed bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-600">
                Module Relations
              </p>

              <div className="mt-2 space-y-1 text-xs text-gray-500">
                <p>
                  Specialty:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedSpecialty?.name ??
                      "—"}
                  </span>
                </p>

                <p>
                  Level:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedLevel?.name ??
                      "—"}
                  </span>
                </p>

                <p>
                  Semester:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedSemester?.name ??
                      "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={
                  creating ||
                  !name.trim()
                }
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating
                  ? "Creating..."
                  : "Create Module"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          MODULES LIST
      ================================================= */}

      {selectedSemesterId && (
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Modules
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {modules.length}{" "}
                {modules.length === 1
                  ? "module"
                  : "modules"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadModules(
                  selectedSemesterId
                )
              }
              disabled={loadingModules}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingModules
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>

          {loadingModules ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading modules...
            </div>
          ) : modules.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-gray-500">
                No modules found for this semester.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Create the first module using the form above.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {module.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          Semester
                        </span>

                        {module.year_id && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                            Academic Year
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400">
                      Module ID
                    </p>

                    <p className="mt-1 max-w-[280px] break-all font-mono text-xs text-gray-500">
                      {module.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =================================================
          EMPTY STATES
      ================================================= */}

      {!selectedFacultyId &&
        !loadingFaculties && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-sm text-gray-500">
              Select a faculty to start managing modules.
            </p>
          </div>
        )}

      {selectedFacultyId &&
        !selectedSpecialtyId &&
        !loadingSpecialties && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-sm text-gray-500">
              Select a specialty to continue.
            </p>
          </div>
        )}

      {selectedSpecialtyId &&
        !selectedLevelId &&
        !loadingLevels && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-sm text-gray-500">
              Select a level to continue.
            </p>
          </div>
        )}

      {selectedLevelId &&
        !selectedSemesterId &&
        !loadingSemesters && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-sm text-gray-500">
              Select a semester to continue.
            </p>
          </div>
        )}
    </div>
  );
}