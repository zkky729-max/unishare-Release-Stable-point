import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getSubjectsByModule,
  deleteSubject,
} from "../api/subjects";

interface Subject {
  id: string;
  name: string;
  description?: string | null;
}

export default function Subjects() {
  const { moduleId } =
    useParams<{ moduleId: string }>();

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function load() {
    if (!moduleId) {
      setError("Module ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const data =
        await getSubjectsByModule(moduleId);

      setSubjects(data || []);
    } catch (err) {
      console.error(
        "LOAD SUBJECTS ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subjects."
      );
    }
  }

  useEffect(() => {
    setLoading(true);

    load().finally(() => {
      setLoading(false);
    });
  }, [moduleId]);

  async function handleDelete(
    subjectId: string
  ) {
    try {
      await deleteSubject(subjectId);

      await load();
    } catch (err) {
      console.error(
        "DELETE SUBJECT ERROR:",
        err
      );
    }
  }

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            Loading subjects...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // Error
  // ===================================================

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h2 className="mb-2 text-lg font-semibold text-red-700">
            Error loading subjects
          </h2>

          <p className="text-sm text-red-600">
            {error}
          </p>

          <p className="mt-4 break-all text-xs text-gray-500">
            Module ID:{" "}
            {moduleId ?? "missing"}
          </p>

        </div>
      </div>
    );
  }

  // ===================================================
  // Main
  // ===================================================

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Subjects 📘
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Module ID: {moduleId}
        </p>
      </div>

      {/* Subjects */}

      {subjects.length === 0 ? (

        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">

          <h2 className="text-lg font-semibold text-gray-700">
            No subjects found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There are no subjects associated
            with this module.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

          {subjects.map((subject) => (

            <div
              key={subject.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >

              <h2 className="text-lg font-semibold text-gray-800">
                {subject.name}
              </h2>

              {subject.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {subject.description}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  handleDelete(subject.id)
                }
                className="mt-4 text-sm text-red-500 hover:underline"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}