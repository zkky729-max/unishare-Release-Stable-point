import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createAdminSemester,
  getAdminSemestersByLevel,
  type AdminSemester,
} from "../api/adminAcademic";

import {
  getAdminFaculties,
  getAdminSpecialtiesByFaculty,
  getAdminLevelsBySpecialty,
  type AdminFaculty,
  type AdminSpecialty,
  type AdminLevel,
} from "../api/adminAcademic";

export default function SemestersManagementPage() {
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

  const [selectedFacultyId, setSelectedFacultyId] =
    useState("");

  const [selectedSpecialtyId, setSelectedSpecialtyId] =
    useState("");

  const [selectedLevelId, setSelectedLevelId] =
    useState("");

  const [name, setName] = useState("");
  const [semesterNumber, setSemesterNumber] =
    useState("1");

  const [loadingFaculties, setLoadingFaculties] =
    useState(true);

  const [loadingSpecialties, setLoadingSpecialties] =
    useState(false);

  const [loadingLevels, setLoadingLevels] =
    useState(false);

  const [loadingSemesters, setLoadingSemesters] =
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

      setSemesters(data);
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
     FACULTY CHANGE
  ===================================================== */

  function handleFacultyChange(
    facultyId: string
  ) {
    setSelectedFacultyId(facultyId);

    setSelectedSpecialtyId("");
    setSelectedLevelId("");

    setSpecialties([]);
    setLevels([]);
    setSemesters([]);

    setName("");
    setSemesterNumber("1");

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

    setLevels([]);
    setSemesters([]);

    setName("");
    setSemesterNumber("1");

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

    setSemesters([]);

    setName("");

    setError("");
    setSuccess("");

    if (!levelId) {
      return;
    }

    loadSemesters(levelId);
  }

  /* =====================================================
     CREATE SEMESTER
  ===================================================== */

  async function handleCreateSemester(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();

    const parsedNumber =
      Number(semesterNumber);

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

    if (!cleanName) {
      setError("Semester name is required.");
      return;
    }

    if (
      !Number.isInteger(parsedNumber) ||
      parsedNumber <= 0
    ) {
      setError(
        "Semester number must be a positive integer."
      );
      return;
    }

    const alreadyExists =
      semesters.some(
        (semester) =>
          semester.semester_number ===
          parsedNumber
      );

    if (alreadyExists) {
      setError(
        `Semester ${parsedNumber} already exists for this level.`
      );
      return;
    }

    try {
      setCreating(true);

      const semester =
        await createAdminSemester({
          name: cleanName,
          level_id: selectedLevelId,
          semester_number: parsedNumber,
        });

      setSemesters((current) =>
        [...current, semester].sort(
          (a, b) =>
            (a.semester_number ?? 0) -
            (b.semester_number ?? 0)
        )
      );

      setName("");

      setSemesterNumber(
        String(parsedNumber + 1)
      );

      setSuccess(
        "Semester created successfully."
      );
    } catch (err) {
      console.error(
        "ADMIN SEMESTER CREATE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create semester."
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
          Semesters Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage semesters inside each academic level.
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
            Choose the faculty that contains the specialty.
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
              loadingSpecialties ||
              !selectedFacultyId
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
              Choose the academic level that contains the
              semester.
            </p>
          </div>

          <select
            value={selectedLevelId}
            onChange={(event) =>
              handleLevelChange(
                event.target.value
              )
            }
            disabled={
              loadingLevels ||
              !selectedSpecialtyId
            }
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
          CREATE SEMESTER
      ================================================= */}

      {selectedLevelId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              4. Create Semester
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a semester to{" "}
              <span className="font-medium text-gray-700">
                {selectedLevel?.name}
              </span>
              .
            </p>
          </div>

          <form
            onSubmit={handleCreateSemester}
            className="space-y-5"
          >
            {/* Semester Name */}

            <div className="space-y-2">
              <label
                htmlFor="semester-name"
                className="text-sm font-medium"
              >
                Semester Name
              </label>

              <input
                id="semester-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: Semester 1"
                disabled={creating}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* Semester Number */}

            <div className="space-y-2">
              <label
                htmlFor="semester-number"
                className="text-sm font-medium"
              >
                Semester Number
              </label>

              <input
                id="semester-number"
                type="number"
                min="1"
                step="1"
                value={semesterNumber}
                onChange={(event) =>
                  setSemesterNumber(
                    event.target.value
                  )
                }
                disabled={creating}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />

              <p className="text-xs text-gray-400">
                Example: 1 for Semester 1, 2 for Semester 2.
              </p>
            </div>

            {/* Submit */}

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
                  : "Create Semester"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          SEMESTERS LIST
      ================================================= */}

      {selectedLevelId && (
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Semesters
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {semesters.length}{" "}
                {semesters.length === 1
                  ? "semester"
                  : "semesters"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadSemesters(
                  selectedLevelId
                )
              }
              disabled={loadingSemesters}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingSemesters
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>

          {/* Loading */}

          {loadingSemesters ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading semesters...
            </div>
          ) : semesters.length === 0 ? (
            /* Empty */

            <div className="p-10 text-center">
              <p className="text-sm text-gray-500">
                No semesters found for this level.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Create the first semester using the form above.
              </p>
            </div>
          ) : (
            /* List */

            <div className="divide-y">
              {semesters
                .slice()
                .sort(
                  (a, b) =>
                    (a.semester_number ?? 0) -
                    (b.semester_number ?? 0)
                )
                .map((semester) => (
                  <div
                    key={semester.id}
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                        {semester.semester_number ??
                          "—"}
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {semester.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Semester{" "}
                          {semester.semester_number ??
                            "—"}
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-400">
                        Semester ID
                      </p>

                      <p className="mt-1 max-w-[280px] break-all font-mono text-xs text-gray-500">
                        {semester.id}
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
              Select a faculty to start managing semesters.
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
    </div>
  );
}