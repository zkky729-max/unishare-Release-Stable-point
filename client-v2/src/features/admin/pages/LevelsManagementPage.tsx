import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createAdminLevel,
  getAdminLevelsBySpecialty,
  type AdminLevel,
} from "../api/adminAcademic";

import {
  getAdminFaculties,
  getAdminSpecialtiesByFaculty,
  type AdminFaculty,
  type AdminSpecialty,
} from "../api/adminAcademic";

export default function LevelsManagementPage() {
  const [faculties, setFaculties] = useState<
    AdminFaculty[]
  >([]);

  const [specialties, setSpecialties] = useState<
    AdminSpecialty[]
  >([]);

  const [levels, setLevels] = useState<
    AdminLevel[]
  >([]);

  const [selectedFacultyId, setSelectedFacultyId] =
    useState("");

  const [selectedSpecialtyId, setSelectedSpecialtyId] =
    useState("");

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [loadingFaculties, setLoadingFaculties] =
    useState(true);

  const [loadingSpecialties, setLoadingSpecialties] =
    useState(false);

  const [loadingLevels, setLoadingLevels] =
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
     FACULTY CHANGE
  ===================================================== */

  function handleFacultyChange(
    facultyId: string
  ) {
    setSelectedFacultyId(facultyId);

    setSelectedSpecialtyId("");

    setSpecialties([]);
    setLevels([]);

    setName("");
    setDescription("");

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

    setLevels([]);

    setName("");
    setDescription("");

    setError("");
    setSuccess("");

    if (!specialtyId) {
      return;
    }

    loadLevels(specialtyId);
  }

  /* =====================================================
     CREATE LEVEL
  ===================================================== */

  async function handleCreateLevel(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanDescription =
      description.trim();

    if (!selectedFacultyId) {
      setError("Please select a faculty.");
      return;
    }

    if (!selectedSpecialtyId) {
      setError("Please select a specialty.");
      return;
    }

    if (!cleanName) {
      setError("Level name is required.");
      return;
    }

    try {
      setCreating(true);

      const level =
        await createAdminLevel({
          specialty_id:
            selectedSpecialtyId,
          name: cleanName,
          description:
            cleanDescription || null,
          education_type_id: null,
          year_id: null,
        });

      setLevels((current) => [
        level,
        ...current,
      ]);

      setName("");
      setDescription("");

      setSuccess(
        "Level created successfully."
      );
    } catch (err) {
      console.error(
        "ADMIN LEVEL CREATE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create level."
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
          Levels Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage academic levels inside each specialty.
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
          FACULTY SELECTOR
      ================================================= */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Select Faculty
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
          SPECIALTY SELECTOR
      ================================================= */}

      {selectedFacultyId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Select Specialty
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the specialty where the level belongs.
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
          CREATE LEVEL
      ================================================= */}

      {selectedSpecialtyId && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Create Level
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add a new academic level to{" "}
              <span className="font-medium text-gray-700">
                {selectedSpecialty?.name}
              </span>
              .
            </p>
          </div>

          <form
            onSubmit={handleCreateLevel}
            className="space-y-5"
          >
            {/* Name */}

            <div className="space-y-2">
              <label
                htmlFor="level-name"
                className="text-sm font-medium"
              >
                Level Name
              </label>

              <input
                id="level-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: Licence 1"
                disabled={creating}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* Description */}

            <div className="space-y-2">
              <label
                htmlFor="level-description"
                className="text-sm font-medium"
              >
                Description
                <span className="ml-2 text-xs font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                id="level-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Level description..."
                rows={4}
                disabled={creating}
                className="w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>

            {/* Future relations */}

            <div className="rounded-xl border border-dashed bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-600">
                Education Type & Year
              </p>

              <p className="mt-1 text-xs text-gray-500">
                These relationships are currently optional.
                They will be connected to their dedicated
                management selectors later.
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
                  : "Create Level"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =================================================
          LEVELS LIST
      ================================================= */}

      {selectedSpecialtyId && (
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Levels
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {levels.length}{" "}
                {levels.length === 1
                  ? "level"
                  : "levels"}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadLevels(
                  selectedSpecialtyId
                )
              }
              disabled={loadingLevels}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingLevels
                ? "Loading..."
                : "Refresh"}
            </button>
          </div>

          {/* Loading */}

          {loadingLevels ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading levels...
            </div>
          ) : levels.length === 0 ? (
            /* Empty */

            <div className="p-10 text-center">
              <p className="text-sm text-gray-500">
                No levels found for this specialty.
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Create the first level using the form above.
              </p>
            </div>
          ) : (
            /* List */

            <div className="divide-y">
              {levels.map((level) => (
                <div
                  key={level.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold">
                      {level.name}
                    </h3>

                    {level.description && (
                      <p className="mt-2 max-w-2xl text-sm text-gray-500">
                        {level.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {level.education_type_id && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                          Education Type
                        </span>
                      )}

                      {level.year_id && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                          Academic Year
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400">
                      Level ID
                    </p>

                    <p className="mt-1 max-w-[280px] break-all font-mono text-xs text-gray-500">
                      {level.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =================================================
          NO SELECTION
      ================================================= */}

      {!selectedFacultyId &&
        !loadingFaculties && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-sm text-gray-500">
              Select a faculty to start managing levels.
            </p>
          </div>
        )}

      {selectedFacultyId &&
        !selectedSpecialtyId &&
        !loadingSpecialties && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="text-sm text-gray-500">
              Select a specialty to manage its levels.
            </p>
          </div>
        )}
    </div>
  );
}