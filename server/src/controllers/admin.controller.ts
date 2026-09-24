import type { Request, Response } from "express";

import { supabaseAdmin } from "../lib/supabaseAdmin.js";
// =====================================================
// HELPERS
// =====================================================

function isNonEmptyString(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

// =====================================================
// USERS
// =====================================================

export async function getUsers(
  req: Request,
  res: Response
) {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("GET USERS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error("GET USERS EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get users.",
    });
  }
}

// =====================================================
// GET USER
// =====================================================

export async function getUser(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.params;

    if (!isNonEmptyString(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId.trim())
      .maybeSingle();

    if (error) {
      console.error("GET USER ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET USER EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get user.",
    });
  }
}

// =====================================================
// STATS
// =====================================================

export async function getStats(
  req: Request,
  res: Response
) {
  try {
    const { count: usersCount, error: usersError } =
      await supabaseAdmin
        .from("profiles")
        .select("id", {
          count: "exact",
          head: true,
        });

    if (usersError) {
      console.error(
        "GET USERS COUNT ERROR:",
        usersError
      );
    }

    const { count: universitiesCount } =
      await supabaseAdmin
        .from("universities")
        .select("id", {
          count: "exact",
          head: true,
        });

    const { count: facultiesCount } =
      await supabaseAdmin
        .from("faculties")
        .select("id", {
          count: "exact",
          head: true,
        });

    const { count: specialtiesCount } =
      await supabaseAdmin
        .from("specialties")
        .select("id", {
          count: "exact",
          head: true,
        });

    const { count: postsCount } =
      await supabaseAdmin
        .from("posts")
        .select("id", {
          count: "exact",
          head: true,
        });

    return res.status(200).json({
      success: true,
      data: {
        users: usersCount ?? 0,
        universities: universitiesCount ?? 0,
        faculties: facultiesCount ?? 0,
        specialties: specialtiesCount ?? 0,
        posts: postsCount ?? 0,
      },
    });
  } catch (error) {
    console.error("GET STATS EXCEPTION:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get statistics.",
    });
  }
}

// =====================================================
// UPDATE USER ROLE
// =====================================================

export async function updateUserRole(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!isNonEmptyString(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    if (!isNonEmptyString(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }

    const allowedRoles = [
      "student",
      "admin",
      "moderator",
    ];

    if (!allowedRoles.includes(role.trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        role: role.trim(),
      })
      .eq("user_id", userId.trim())
      .select("*")
      .maybeSingle();

    if (error) {
      console.error(
        "UPDATE USER ROLE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "UPDATE USER ROLE EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user role.",
    });
  }
}

// =====================================================
// DELETE USER
// =====================================================

export async function deleteUser(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.params;

    if (!isNonEmptyString(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(
        userId.trim()
      );

    if (authError) {
      console.error(
        "DELETE AUTH USER ERROR:",
        authError
      );

      return res.status(500).json({
        success: false,
        message: authError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE USER EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete user.",
    });
  }
}

// =====================================================
// UNIVERSITIES
// =====================================================

export async function createUniversity(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      short_name,
      country_id,
      city,
      slug,
      description,
      logo_url,
      cover_image_url,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "University name is required.",
      });
    }

    if (!isNonEmptyString(slug)) {
      return res.status(400).json({
        success: false,
        message: "University slug is required.",
      });
    }

    const { data, error } =
      await supabaseAdmin
        .from("universities")
        .insert({
          name: name.trim(),
          short_name:
            isNonEmptyString(short_name)
              ? short_name.trim()
              : null,
          country_id:
            isNonEmptyString(country_id)
              ? country_id.trim()
              : null,
          city:
            isNonEmptyString(city)
              ? city.trim()
              : null,
          slug: slug.trim(),
          description:
            isNonEmptyString(description)
              ? description.trim()
              : null,
          logo_url:
            isNonEmptyString(logo_url)
              ? logo_url.trim()
              : null,
          cover_image_url:
            isNonEmptyString(cover_image_url)
              ? cover_image_url.trim()
              : null,
        })
        .select("*")
        .single();

    if (error) {
      console.error(
        "CREATE UNIVERSITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE UNIVERSITY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create university.",
    });
  }
}

// =====================================================
// GET UNIVERSITIES
// =====================================================

export async function getUniversities(
  req: Request,
  res: Response
) {
  try {
    const { data, error } =
      await supabaseAdmin
        .from("universities")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "GET UNIVERSITIES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET UNIVERSITIES EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get universities.",
    });
  }
}

// =====================================================
// UPDATE UNIVERSITY
// =====================================================

export async function updateUniversity(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      name,
      short_name,
      country_id,
      city,
      slug,
      description,
      logo_url,
      cover_image_url,
    } = req.body;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "University ID is required.",
      });
    }

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "University name is required.",
      });
    }

    if (!isNonEmptyString(slug)) {
      return res.status(400).json({
        success: false,
        message: "University slug is required.",
      });
    }

    const { data, error } =
      await supabaseAdmin
        .from("universities")
        .update({
          name: name.trim(),
          short_name:
            isNonEmptyString(short_name)
              ? short_name.trim()
              : null,
          country_id:
            isNonEmptyString(country_id)
              ? country_id.trim()
              : null,
          city:
            isNonEmptyString(city)
              ? city.trim()
              : null,
          slug: slug.trim(),
          description:
            isNonEmptyString(description)
              ? description.trim()
              : null,
          logo_url:
            isNonEmptyString(logo_url)
              ? logo_url.trim()
              : null,
          cover_image_url:
            isNonEmptyString(cover_image_url)
              ? cover_image_url.trim()
              : null,
        })
        .eq("id", id.trim())
        .select("*")
        .maybeSingle();

    if (error) {
      console.error(
        "UPDATE UNIVERSITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "University not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "UPDATE UNIVERSITY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update university.",
    });
  }
}

// =====================================================
// DELETE UNIVERSITY
// =====================================================

export async function deleteUniversity(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "University ID is required.",
      });
    }

    const {
      data: faculties,
      error: facultiesError,
    } = await supabaseAdmin
      .from("faculties")
      .select("id")
      .eq("university_id", id.trim());

    if (facultiesError) {
      return res.status(500).json({
        success: false,
        message: facultiesError.message,
      });
    }

    if (
      faculties &&
      faculties.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete university while faculties are linked to it.",
      });
    }

    const { error } =
      await supabaseAdmin
        .from("universities")
        .delete()
        .eq("id", id.trim());

    if (error) {
      console.error(
        "DELETE UNIVERSITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "University deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE UNIVERSITY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete university.",
    });
  }
}

// =====================================================
// FACULTIES
// =====================================================

export async function createFaculty(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      university_id,
      slug,
      description,
      logo_url,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Faculty name is required.",
      });
    }

    if (!isNonEmptyString(university_id)) {
      return res.status(400).json({
        success: false,
        message: "University ID is required.",
      });
    }

    if (!isNonEmptyString(slug)) {
      return res.status(400).json({
        success: false,
        message: "Faculty slug is required.",
      });
    }

    const { data, error } =
      await supabaseAdmin
        .from("faculties")
        .insert({
          name: name.trim(),
          university_id: university_id.trim(),
          slug: slug.trim(),
          description:
            isNonEmptyString(description)
              ? description.trim()
              : null,
          logo_url:
            isNonEmptyString(logo_url)
              ? logo_url.trim()
              : null,
        })
        .select("*")
        .single();

    if (error) {
      console.error(
        "CREATE FACULTY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE FACULTY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create faculty.",
    });
  }
}

// =====================================================
// GET FACULTIES
// =====================================================

export async function getFaculties(
  req: Request,
  res: Response
) {
  try {
    const { data, error } =
      await supabaseAdmin
        .from("faculties")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "GET FACULTIES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET FACULTIES EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get faculties.",
    });
  }
}

// =====================================================
// DELETE FACULTY
// =====================================================

export async function deleteFaculty(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required.",
      });
    }

    const {
      data: specialties,
      error: specialtiesError,
    } = await supabaseAdmin
      .from("specialties")
      .select("id")
      .eq("faculty_id", id.trim());

    if (specialtiesError) {
      return res.status(500).json({
        success: false,
        message: specialtiesError.message,
      });
    }

    const specialtyIds =
      specialties?.map(
        (item) => item.id
      ) ?? [];

    let levelIds: string[] = [];

    if (specialtyIds.length > 0) {
      const {
        data: levels,
        error: levelsError,
      } = await supabaseAdmin
        .from("levels")
        .select("id")
        .in(
          "specialty_id",
          specialtyIds
        );

      if (levelsError) {
        return res.status(500).json({
          success: false,
          message: levelsError.message,
        });
      }

      levelIds =
        levels?.map(
          (item) => item.id
        ) ?? [];
    }

    let semesterIds: string[] = [];

    if (levelIds.length > 0) {
      const {
        data: semesters,
        error: semestersError,
      } = await supabaseAdmin
        .from("semesters")
        .select("id")
        .in(
          "level_id",
          levelIds
        );

      if (semestersError) {
        return res.status(500).json({
          success: false,
          message:
            semestersError.message,
        });
      }

      semesterIds =
        semesters?.map(
          (item) => item.id
        ) ?? [];
    }

    let moduleIds: string[] = [];

    if (
      semesterIds.length > 0 ||
      specialtyIds.length > 0
    ) {
      const queries = [];

      if (semesterIds.length > 0) {
        queries.push(
          supabaseAdmin
            .from("modules")
            .select("id")
            .in(
              "semester_id",
              semesterIds
            )
        );
      }

      if (specialtyIds.length > 0) {
        queries.push(
          supabaseAdmin
            .from("modules")
            .select("id")
            .in(
              "specialty_id",
              specialtyIds
            )
        );
      }

      for (const query of queries) {
        const {
          data: modules,
          error: modulesError,
        } = await query;

        if (modulesError) {
          return res.status(500).json({
            success: false,
            message:
              modulesError.message,
          });
        }

        for (const module of modules ?? []) {
          if (
            !moduleIds.includes(
              module.id
            )
          ) {
            moduleIds.push(
              module.id
            );
          }
        }
      }
    }

    let subjectIds: string[] = [];

    if (moduleIds.length > 0) {
      const {
        data: subjects,
        error: subjectsError,
      } = await supabaseAdmin
        .from("subjects")
        .select("id")
        .in(
          "module_id",
          moduleIds
        );

      if (subjectsError) {
        return res.status(500).json({
          success: false,
          message:
            subjectsError.message,
        });
      }

      subjectIds =
        subjects?.map(
          (item) => item.id
        ) ?? [];
    }

    if (subjectIds.length > 0) {
      const {
        data: lessons,
        error: lessonsError,
      } = await supabaseAdmin
        .from("lessons")
        .select("id")
        .in(
          "subject_id",
          subjectIds
        );

      if (lessonsError) {
        return res.status(500).json({
          success: false,
          message:
            lessonsError.message,
        });
      }

      const lessonIds =
        lessons?.map(
          (item) => item.id
        ) ?? [];

      if (lessonIds.length > 0) {
        const {
          error: filesError,
        } = await supabaseAdmin
          .from("files")
          .delete()
          .in(
            "lesson_id",
            lessonIds
          );

        if (filesError) {
          return res.status(500).json({
            success: false,
            message: filesError.message,
          });
        }

        const {
          error: deleteLessonsError,
        } = await supabaseAdmin
          .from("lessons")
          .delete()
          .in(
            "id",
            lessonIds
          );

        if (deleteLessonsError) {
          return res.status(500).json({
            success: false,
            message:
              deleteLessonsError.message,
          });
        }
      }
    }

    if (moduleIds.length > 0) {
      const {
        error: moduleFilesError,
      } = await supabaseAdmin
        .from("files")
        .delete()
        .in(
          "module_id",
          moduleIds
        );

      if (moduleFilesError) {
        return res.status(500).json({
          success: false,
          message:
            moduleFilesError.message,
        });
      }
    }

    if (subjectIds.length > 0) {
      const {
        error: subjectFilesError,
      } = await supabaseAdmin
        .from("files")
        .delete()
        .in(
          "subject_id",
          subjectIds
        );

      if (subjectFilesError) {
        return res.status(500).json({
          success: false,
          message:
            subjectFilesError.message,
        });
      }
    }

    if (specialtyIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          specialty_id: null,
          level_id: null,
          semester_id: null,
          module_id: null,
        })
        .in(
          "specialty_id",
          specialtyIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (levelIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          level_id: null,
          semester_id: null,
          module_id: null,
        })
        .in(
          "level_id",
          levelIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (semesterIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          semester_id: null,
          module_id: null,
        })
        .in(
          "semester_id",
          semesterIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (moduleIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          module_id: null,
        })
        .in(
          "module_id",
          moduleIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    const {
      error: facultyPostsError,
    } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq(
        "faculty_id",
        id.trim()
      );

    if (facultyPostsError) {
      return res.status(500).json({
        success: false,
        message: facultyPostsError.message,
      });
    }

    if (specialtyIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("posts")
        .delete()
        .in(
          "specialty_id",
          specialtyIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (levelIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("posts")
        .delete()
        .in(
          "level_id",
          levelIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (semesterIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("posts")
        .delete()
        .in(
          "semester_id",
          semesterIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (moduleIds.length > 0) {
      const {
        error,
      } = await supabaseAdmin
        .from("posts")
        .delete()
        .in(
          "module_id",
          moduleIds
        );

      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    if (subjectIds.length > 0) {
      const {
        error: deleteSubjectsError,
      } = await supabaseAdmin
        .from("subjects")
        .delete()
        .in(
          "id",
          subjectIds
        );

      if (deleteSubjectsError) {
        return res.status(500).json({
          success: false,
          message:
            deleteSubjectsError.message,
        });
      }
    }

    if (moduleIds.length > 0) {
      const {
        error: deleteModulesError,
      } = await supabaseAdmin
        .from("modules")
        .delete()
        .in(
          "id",
          moduleIds
        );

      if (deleteModulesError) {
        return res.status(500).json({
          success: false,
          message:
            deleteModulesError.message,
        });
      }
    }

    if (semesterIds.length > 0) {
      const {
        error: deleteSemestersError,
      } = await supabaseAdmin
        .from("semesters")
        .delete()
        .in(
          "id",
          semesterIds
        );

      if (deleteSemestersError) {
        return res.status(500).json({
          success: false,
          message:
            deleteSemestersError.message,
        });
      }
    }

    if (levelIds.length > 0) {
      const {
        error: deleteLevelsError,
      } = await supabaseAdmin
        .from("levels")
        .delete()
        .in(
          "id",
          levelIds
        );

      if (deleteLevelsError) {
        return res.status(500).json({
          success: false,
          message:
            deleteLevelsError.message,
        });
      }
    }

    if (specialtyIds.length > 0) {
      const {
        error: deleteSpecialtiesError,
      } = await supabaseAdmin
        .from("specialties")
        .delete()
        .in(
          "id",
          specialtyIds
        );

      if (deleteSpecialtiesError) {
        return res.status(500).json({
          success: false,
          message:
            deleteSpecialtiesError.message,
        });
      }
    }

    const {
      error: deleteFacultyError,
    } = await supabaseAdmin
      .from("faculties")
      .delete()
      .eq(
        "id",
        id.trim()
      );

    if (deleteFacultyError) {
      console.error(
        "DELETE FACULTY ERROR:",
        deleteFacultyError
      );

      return res.status(500).json({
        success: false,
        message:
          deleteFacultyError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Faculty and related academic data deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE FACULTY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete faculty.",
    });
  }
}

// =====================================================
// DEPARTMENTS
// =====================================================

export async function createDepartment(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      faculty_id,
      slug,
      description,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Department name is required.",
      });
    }

    if (!isNonEmptyString(faculty_id)) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required.",
      });
    }

    const {
      data: faculty,
      error: facultyError,
    } = await supabaseAdmin
      .from("faculties")
      .select("id")
      .eq(
        "id",
        faculty_id.trim()
      )
      .maybeSingle();

    if (facultyError) {
      console.error(
        "CHECK DEPARTMENT FACULTY ERROR:",
        facultyError
      );

      return res.status(500).json({
        success: false,
        message: facultyError.message,
      });
    }

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("departments")
      .insert({
        name: name.trim(),
        faculty_id: faculty_id.trim(),
        slug:
          isNonEmptyString(slug)
            ? slug.trim()
            : null,
        description:
          isNonEmptyString(description)
            ? description.trim()
            : null,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "CREATE DEPARTMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE DEPARTMENT EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create department.",
    });
  }
}

// =====================================================
// GET DEPARTMENTS BY FACULTY
// =====================================================

export async function getDepartmentsByFaculty(
  req: Request,
  res: Response
) {
  try {
    const { faculty_id } = req.params;

    if (!isNonEmptyString(faculty_id)) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("departments")
      .select("*")
      .eq(
        "faculty_id",
        faculty_id.trim()
      )
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET DEPARTMENTS BY FACULTY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET DEPARTMENTS BY FACULTY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get departments.",
    });
  }
}

// =====================================================
// UPDATE DEPARTMENT
// =====================================================

export async function updateDepartment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      name,
      faculty_id,
      slug,
      description,
    } = req.body;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required.",
      });
    }

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Department name is required.",
      });
    }

    if (!isNonEmptyString(faculty_id)) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required.",
      });
    }

    const {
      data: faculty,
      error: facultyError,
    } = await supabaseAdmin
      .from("faculties")
      .select("id")
      .eq(
        "id",
        faculty_id.trim()
      )
      .maybeSingle();

    if (facultyError) {
      console.error(
        "CHECK UPDATE DEPARTMENT FACULTY ERROR:",
        facultyError
      );

      return res.status(500).json({
        success: false,
        message: facultyError.message,
      });
    }

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("departments")
      .update({
        name: name.trim(),
        faculty_id: faculty_id.trim(),
        slug:
          isNonEmptyString(slug)
            ? slug.trim()
            : null,
        description:
          isNonEmptyString(description)
            ? description.trim()
            : null,
      })
      .eq(
        "id",
        id.trim()
      )
      .select("*")
      .maybeSingle();

    if (error) {
      console.error(
        "UPDATE DEPARTMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "UPDATE DEPARTMENT EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update department.",
    });
  }
}

// =====================================================
// DELETE DEPARTMENT
// =====================================================

export async function deleteDepartment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required.",
      });
    }

    const {
      data: department,
      error: departmentError,
    } = await supabaseAdmin
      .from("departments")
      .select("id")
      .eq(
        "id",
        id.trim()
      )
      .maybeSingle();

    if (departmentError) {
      console.error(
        "CHECK DELETE DEPARTMENT ERROR:",
        departmentError
      );

      return res.status(500).json({
        success: false,
        message: departmentError.message,
      });
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    const {
      data: specialties,
      error: specialtiesError,
    } = await supabaseAdmin
      .from("specialties")
      .select("id")
      .eq(
        "department_id",
        id.trim()
      );

    if (specialtiesError) {
      console.error(
        "GET DEPARTMENT SPECIALTIES ERROR:",
        specialtiesError
      );

      return res.status(500).json({
        success: false,
        message: specialtiesError.message,
      });
    }

    if (
      specialties &&
      specialties.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete department while specialties are linked to it.",
      });
    }

    const { error } =
      await supabaseAdmin
        .from("departments")
        .delete()
        .eq(
          "id",
          id.trim()
        );

    if (error) {
      console.error(
        "DELETE DEPARTMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Department deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE DEPARTMENT EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete department.",
    });
  }
}

// =====================================================
// SPECIALTIES
// =====================================================

export async function createSpecialty(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      faculty_id,
      department_id,
      slug,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Specialty name is required.",
      });
    }

    if (!isNonEmptyString(faculty_id)) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required.",
      });
    }

    if (!isNonEmptyString(department_id)) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required.",
      });
    }

    if (!isNonEmptyString(slug)) {
      return res.status(400).json({
        success: false,
        message: "Specialty slug is required.",
      });
    }

    const {
      data: faculty,
      error: facultyError,
    } = await supabaseAdmin
      .from("faculties")
      .select("id")
      .eq(
        "id",
        faculty_id.trim()
      )
      .maybeSingle();

    if (facultyError) {
      console.error(
        "CHECK SPECIALTY FACULTY ERROR:",
        facultyError
      );

      return res.status(500).json({
        success: false,
        message: facultyError.message,
      });
    }

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found.",
      });
    }

    const {
      data: department,
      error: departmentError,
    } = await supabaseAdmin
      .from("departments")
      .select("id,faculty_id")
      .eq(
        "id",
        department_id.trim()
      )
      .maybeSingle();

    if (departmentError) {
      console.error(
        "CHECK SPECIALTY DEPARTMENT ERROR:",
        departmentError
      );

      return res.status(500).json({
        success: false,
        message: departmentError.message,
      });
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    if (
      department.faculty_id !==
      faculty_id.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Department does not belong to the selected faculty.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("specialties")
      .insert({
        name: name.trim(),
        faculty_id: faculty_id.trim(),
        department_id:
          department_id.trim(),
        slug: slug.trim(),
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "CREATE SPECIALTY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE SPECIALTY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create specialty.",
    });
  }
}

// =====================================================
// GET SPECIALTIES
// =====================================================

export async function getSpecialties(
  req: Request,
  res: Response
) {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("specialties")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "GET SPECIALTIES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET SPECIALTIES EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get specialties.",
    });
  }
}

// =====================================================
// GET SPECIALTIES BY FACULTY
// =====================================================

export async function getSpecialtiesByFaculty(
  req: Request,
  res: Response
) {
  try {
    const { faculty_id } = req.params;

    if (!isNonEmptyString(faculty_id)) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("specialties")
      .select("*")
      .eq(
        "faculty_id",
        faculty_id.trim()
      )
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET SPECIALTIES BY FACULTY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET SPECIALTIES BY FACULTY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get specialties.",
    });
  }
}

// =====================================================
// DELETE SPECIALTY
// =====================================================

export async function deleteSpecialty(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "Specialty ID is required.",
      });
    }

    const specialtyId = id.trim();

    const {
      data: specialty,
      error: specialtyError,
    } = await supabaseAdmin
      .from("specialties")
      .select("id")
      .eq("id", specialtyId)
      .maybeSingle();

    if (specialtyError) {
      console.error(
        "CHECK DELETE SPECIALTY ERROR:",
        specialtyError
      );

      return res.status(500).json({
        success: false,
        message: specialtyError.message,
      });
    }

    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: "Specialty not found.",
      });
    }

    const {
      data: levels,
      error: levelsError,
    } = await supabaseAdmin
      .from("levels")
      .select("id")
      .eq(
        "specialty_id",
        specialtyId
      );

    if (levelsError) {
      console.error(
        "GET SPECIALTY LEVELS ERROR:",
        levelsError
      );

      return res.status(500).json({
        success: false,
        message: levelsError.message,
      });
    }

    const levelIds =
      levels?.map(
        (item) => item.id
      ) ?? [];

    let semesterIds: string[] = [];

    if (levelIds.length > 0) {
      const {
        data: semesters,
        error: semestersError,
      } = await supabaseAdmin
        .from("semesters")
        .select("id")
        .in(
          "level_id",
          levelIds
        );

      if (semestersError) {
        console.error(
          "GET SPECIALTY SEMESTERS ERROR:",
          semestersError
        );

        return res.status(500).json({
          success: false,
          message:
            semestersError.message,
        });
      }

      semesterIds =
        semesters?.map(
          (item) => item.id
        ) ?? [];
    }

    const moduleIdsSet =
      new Set<string>();

    if (semesterIds.length > 0) {
      const {
        data: semesterModules,
        error: semesterModulesError,
      } = await supabaseAdmin
        .from("modules")
        .select("id")
        .in(
          "semester_id",
          semesterIds
        );

      if (semesterModulesError) {
        console.error(
          "GET SPECIALTY SEMESTER MODULES ERROR:",
          semesterModulesError
        );

        return res.status(500).json({
          success: false,
          message:
            semesterModulesError.message,
        });
      }

      for (
        const module
        of semesterModules ?? []
      ) {
        moduleIdsSet.add(
          module.id
        );
      }
    }

    const {
      data: specialtyModules,
      error: specialtyModulesError,
    } = await supabaseAdmin
      .from("modules")
      .select("id")
      .eq(
        "specialty_id",
        specialtyId
      );

    if (specialtyModulesError) {
      console.error(
        "GET SPECIALTY MODULES ERROR:",
        specialtyModulesError
      );

      return res.status(500).json({
        success: false,
        message:
          specialtyModulesError.message,
      });
    }

    for (
      const module
      of specialtyModules ?? []
    ) {
      moduleIdsSet.add(
        module.id
      );
    }

    const moduleIds =
      Array.from(moduleIdsSet);

    let subjectIds: string[] = [];

    if (moduleIds.length > 0) {
      const {
        data: subjects,
        error: subjectsError,
      } = await supabaseAdmin
        .from("subjects")
        .select("id")
        .in(
          "module_id",
          moduleIds
        );

      if (subjectsError) {
        console.error(
          "GET SPECIALTY SUBJECTS ERROR:",
          subjectsError
        );

        return res.status(500).json({
          success: false,
          message:
            subjectsError.message,
        });
      }

      subjectIds =
        subjects?.map(
          (item) => item.id
        ) ?? [];
    }

    let lessonIds: string[] = [];

    if (subjectIds.length > 0) {
      const {
        data: lessons,
        error: lessonsError,
      } = await supabaseAdmin
        .from("lessons")
        .select("id")
        .in(
          "subject_id",
          subjectIds
        );

      if (lessonsError) {
        console.error(
          "GET SPECIALTY LESSONS ERROR:",
          lessonsError
        );

        return res.status(500).json({
          success: false,
          message:
            lessonsError.message,
        });
      }

      lessonIds =
        lessons?.map(
          (item) => item.id
        ) ?? [];
    }

    if (lessonIds.length > 0) {
      const {
        error: lessonFilesError,
      } = await supabaseAdmin
        .from("files")
        .delete()
        .in(
          "lesson_id",
          lessonIds
        );

      if (lessonFilesError) {
        console.error(
          "DELETE SPECIALTY LESSON FILES ERROR:",
          lessonFilesError
        );

        return res.status(500).json({
          success: false,
          message:
            lessonFilesError.message,
        });
      }
    }

    if (moduleIds.length > 0) {
      const {
        error: moduleFilesError,
      } = await supabaseAdmin
        .from("files")
        .delete()
        .in(
          "module_id",
          moduleIds
        );

      if (moduleFilesError) {
        console.error(
          "DELETE SPECIALTY MODULE FILES ERROR:",
          moduleFilesError
        );

        return res.status(500).json({
          success: false,
          message:
            moduleFilesError.message,
        });
      }
    }

    if (subjectIds.length > 0) {
      const {
        error: subjectFilesError,
      } = await supabaseAdmin
        .from("files")
        .delete()
        .in(
          "subject_id",
          subjectIds
        );

      if (subjectFilesError) {
        console.error(
          "DELETE SPECIALTY SUBJECT FILES ERROR:",
          subjectFilesError
        );

        return res.status(500).json({
          success: false,
          message:
            subjectFilesError.message,
        });
      }
    }

    if (lessonIds.length > 0) {
      const {
        error: deleteLessonsError,
      } = await supabaseAdmin
        .from("lessons")
        .delete()
        .in(
          "id",
          lessonIds
        );

      if (deleteLessonsError) {
        console.error(
          "DELETE SPECIALTY LESSONS ERROR:",
          deleteLessonsError
        );

        return res.status(500).json({
          success: false,
          message:
            deleteLessonsError.message,
        });
      }
    }

    const {
      error: specialtyProfilesError,
    } = await supabaseAdmin
      .from("profiles")
      .update({
        specialty_id: null,
        level_id: null,
        semester_id: null,
        module_id: null,
      })
      .eq(
        "specialty_id",
        specialtyId
      );

    if (specialtyProfilesError) {
      console.error(
        "CLEAR SPECIALTY PROFILES ERROR:",
        specialtyProfilesError
      );

      return res.status(500).json({
        success: false,
        message:
          specialtyProfilesError.message,
      });
    }

    if (levelIds.length > 0) {
      const {
        error: levelProfilesError,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          level_id: null,
          semester_id: null,
          module_id: null,
        })
        .in(
          "level_id",
          levelIds
        );

      if (levelProfilesError) {
        console.error(
          "CLEAR SPECIALTY LEVEL PROFILES ERROR:",
          levelProfilesError
        );

        return res.status(500).json({
          success: false,
          message:
            levelProfilesError.message,
        });
      }
    }

    if (semesterIds.length > 0) {
      const {
        error: semesterProfilesError,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          semester_id: null,
          module_id: null,
        })
        .in(
          "semester_id",
          semesterIds
        );

      if (semesterProfilesError) {
        console.error(
          "CLEAR SPECIALTY SEMESTER PROFILES ERROR:",
          semesterProfilesError
        );

        return res.status(500).json({
          success: false,
          message:
            semesterProfilesError.message,
        });
      }
    }

    if (moduleIds.length > 0) {
      const {
        error: moduleProfilesError,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          module_id: null,
        })
        .in(
          "module_id",
          moduleIds
        );

      if (moduleProfilesError) {
        console.error(
          "CLEAR SPECIALTY MODULE PROFILES ERROR:",
          moduleProfilesError
        );

        return res.status(500).json({
          success: false,
          message:
            moduleProfilesError.message,
        });
      }
    }

    const {
      error: specialtyPostsError,
    } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq(
        "specialty_id",
        specialtyId
      );

    if (specialtyPostsError) {
      console.error(
        "DELETE SPECIALTY POSTS ERROR:",
        specialtyPostsError
      );

      return res.status(500).json({
        success: false,
        message:
          specialtyPostsError.message,
      });
    }

    if (levelIds.length > 0) {
      const {
        error: levelPostsError,
      } = await supabaseAdmin
        .from("posts")
        .delete()
        .in(
          "level_id",
          levelIds
        );

      if (levelPostsError) {
        console.error(
          "DELETE SPECIALTY LEVEL POSTS ERROR:",
          levelPostsError
        );

        return res.status(500).json({
          success: false,
          message:
            levelPostsError.message,
        });
      }
    }

    if (semesterIds.length > 0) {
      const {
        error: semesterPostsError,
      } = await supabaseAdmin
        .from("posts")
        .delete()
        .in(
          "semester_id",
          semesterIds
        );

      if (semesterPostsError) {
        console.error(
          "DELETE SPECIALTY SEMESTER POSTS ERROR:",
          semesterPostsError
        );

        return res.status(500).json({
          success: false,
          message:
            semesterPostsError.message,
        });
      }
    }

    if (moduleIds.length > 0) {
      const {
        error: modulePostsError,
      } = await supabaseAdmin
        .from("posts")
        .delete()
        .in(
          "module_id",
          moduleIds
        );

      if (modulePostsError) {
        console.error(
          "DELETE SPECIALTY MODULE POSTS ERROR:",
          modulePostsError
        );

        return res.status(500).json({
          success: false,
          message:
            modulePostsError.message,
        });
      }
    }

    if (subjectIds.length > 0) {
      const {
        error: deleteSubjectsError,
      } = await supabaseAdmin
        .from("subjects")
        .delete()
        .in(
          "id",
          subjectIds
        );

      if (deleteSubjectsError) {
        console.error(
          "DELETE SPECIALTY SUBJECTS ERROR:",
          deleteSubjectsError
        );

        return res.status(500).json({
          success: false,
          message:
            deleteSubjectsError.message,
        });
      }
    }

    if (moduleIds.length > 0) {
      const {
        error: deleteModulesError,
      } = await supabaseAdmin
        .from("modules")
        .delete()
        .in(
          "id",
          moduleIds
        );

      if (deleteModulesError) {
        console.error(
          "DELETE SPECIALTY MODULES ERROR:",
          deleteModulesError
        );

        return res.status(500).json({
          success: false,
          message:
            deleteModulesError.message,
        });
      }
    }

    if (semesterIds.length > 0) {
      const {
        error: deleteSemestersError,
      } = await supabaseAdmin
        .from("semesters")
        .delete()
        .in(
          "id",
          semesterIds
        );

      if (deleteSemestersError) {
        console.error(
          "DELETE SPECIALTY SEMESTERS ERROR:",
          deleteSemestersError
        );

        return res.status(500).json({
          success: false,
          message:
            deleteSemestersError.message,
        });
      }
    }

    if (levelIds.length > 0) {
      const {
        error: deleteLevelsError,
      } = await supabaseAdmin
        .from("levels")
        .delete()
        .in(
          "id",
          levelIds
        );

      if (deleteLevelsError) {
        console.error(
          "DELETE SPECIALTY LEVELS ERROR:",
          deleteLevelsError
        );

        return res.status(500).json({
          success: false,
          message:
            deleteLevelsError.message,
        });
      }
    }

    const {
      error: deleteSpecialtyError,
    } = await supabaseAdmin
      .from("specialties")
      .delete()
      .eq(
        "id",
        specialtyId
      );

    if (deleteSpecialtyError) {
      console.error(
        "DELETE SPECIALTY ERROR:",
        deleteSpecialtyError
      );

      return res.status(500).json({
        success: false,
        message:
          deleteSpecialtyError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Specialty and related academic data deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE SPECIALTY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete specialty.",
    });
  }
}

// =====================================================
// LEVELS
// =====================================================

export async function createLevel(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      specialty_id,
      description,
      education_type_id,
      year_id,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Level name is required.",
      });
    }

    if (!isNonEmptyString(specialty_id)) {
      return res.status(400).json({
        success: false,
        message: "Specialty ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("levels")
      .insert({
        name: name.trim(),
        specialty_id: specialty_id.trim(),
        description:
          isNonEmptyString(description)
            ? description.trim()
            : null,
        education_type_id:
          isNonEmptyString(
            education_type_id
          )
            ? education_type_id.trim()
            : null,
        year_id:
          isNonEmptyString(year_id)
            ? year_id.trim()
            : null,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "CREATE LEVEL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE LEVEL EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create level.",
    });
  }
}

// =====================================================
// GET LEVELS BY SPECIALTY
// =====================================================

export async function getLevelsBySpecialty(
  req: Request,
  res: Response
) {
  try {
    const { specialty_id } = req.params;

    if (!isNonEmptyString(specialty_id)) {
      return res.status(400).json({
        success: false,
        message: "Specialty ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("levels")
      .select("*")
      .eq(
        "specialty_id",
        specialty_id.trim()
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET LEVELS BY SPECIALTY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET LEVELS BY SPECIALTY EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get levels.",
    });
  }
}

// =====================================================
// SEMESTERS
// =====================================================

export async function createSemester(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      level_id,
      semester_number,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Semester name is required.",
      });
    }

    if (!isNonEmptyString(level_id)) {
      return res.status(400).json({
        success: false,
        message: "Level ID is required.",
      });
    }

    const insertData: Record<
      string,
      unknown
    > = {
      name: name.trim(),
      level_id: level_id.trim(),
    };

    if (
      semester_number !== undefined &&
      semester_number !== null
    ) {
      const numberValue =
        Number(semester_number);

      if (
        !Number.isInteger(numberValue) ||
        numberValue <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Semester number must be a positive integer.",
        });
      }

      insertData.semester_number =
        numberValue;
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("semesters")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error(
        "CREATE SEMESTER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE SEMESTER EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create semester.",
    });
  }
}

// =====================================================
// GET SEMESTERS BY LEVEL
// =====================================================

export async function getSemestersByLevel(
  req: Request,
  res: Response
) {
  try {
    const { level_id } = req.params;

    if (!isNonEmptyString(level_id)) {
      return res.status(400).json({
        success: false,
        message: "Level ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("semesters")
      .select("*")
      .eq(
        "level_id",
        level_id.trim()
      )
      .order("semester_number", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET SEMESTERS BY LEVEL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET SEMESTERS BY LEVEL EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get semesters.",
    });
  }
}

// =====================================================
// MODULES
// =====================================================

export async function createModule(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      semester_id,
      specialty_id,
      year_id,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Module name is required.",
      });
    }

    if (!isNonEmptyString(semester_id)) {
      return res.status(400).json({
        success: false,
        message: "Semester ID is required.",
      });
    }

    const insertData: Record<
      string,
      unknown
    > = {
      name: name.trim(),
      semester_id: semester_id.trim(),
      specialty_id:
        isNonEmptyString(specialty_id)
          ? specialty_id.trim()
          : null,
      year_id:
        isNonEmptyString(year_id)
          ? year_id.trim()
          : null,
    };

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("modules")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error(
        "CREATE MODULE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE MODULE EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create module.",
    });
  }
}

// =====================================================
// GET MODULES
// =====================================================

export async function getModules(
  req: Request,
  res: Response
) {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("modules")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "GET MODULES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET MODULES EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get modules.",
    });
  }
}

// =====================================================
// GET MODULES BY SEMESTER
// =====================================================

export async function getModulesBySemester(
  req: Request,
  res: Response
) {
  try {
    const { semester_id } = req.params;

    if (!isNonEmptyString(semester_id)) {
      return res.status(400).json({
        success: false,
        message: "Semester ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("modules")
      .select("*")
      .eq(
        "semester_id",
        semester_id.trim()
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET MODULES BY SEMESTER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET MODULES BY SEMESTER EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get modules.",
    });
  }
}

// =====================================================
// SUBJECTS
// =====================================================

export async function createSubject(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      module_id,
      specialty_id,
      description,
    } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required.",
      });
    }

    if (!isNonEmptyString(module_id)) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required.",
      });
    }

    const insertData: Record<
      string,
      unknown
    > = {
      name: name.trim(),
      module_id: module_id.trim(),
      specialty_id:
        isNonEmptyString(specialty_id)
          ? specialty_id.trim()
          : null,
      description:
        isNonEmptyString(description)
          ? description.trim()
          : null,
    };

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("subjects")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error(
        "CREATE SUBJECT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE SUBJECT EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create subject.",
    });
  }
}

// =====================================================
// GET SUBJECTS
// =====================================================

export async function getSubjects(
  req: Request,
  res: Response
) {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("subjects")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "GET SUBJECTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET SUBJECTS EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get subjects.",
    });
  }
}

// =====================================================
// GET SUBJECTS BY MODULE
// =====================================================

export async function getSubjectsByModule(
  req: Request,
  res: Response
) {
  try {
    const { module_id } = req.params;

    if (!isNonEmptyString(module_id)) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("subjects")
      .select("*")
      .eq(
        "module_id",
        module_id.trim()
      )
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET SUBJECTS BY MODULE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET SUBJECTS BY MODULE EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get subjects.",
    });
  }
}

// =====================================================
// LESSONS
// =====================================================

export async function createLesson(
  req: Request,
  res: Response
) {
  try {
    const {
      subject_id,
      title,
      description,
      content,
    } = req.body;

    if (!isNonEmptyString(subject_id)) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required.",
      });
    }

    if (!isNonEmptyString(title)) {
      return res.status(400).json({
        success: false,
        message: "Lesson title is required.",
      });
    }

    const {
      data: subject,
      error: subjectError,
    } = await supabaseAdmin
      .from("subjects")
      .select("id")
      .eq(
        "id",
        subject_id.trim()
      )
      .maybeSingle();

    if (subjectError) {
      console.error(
        "CHECK LESSON SUBJECT ERROR:",
        subjectError
      );

      return res.status(500).json({
        success: false,
        message: subjectError.message,
      });
    }

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    const insertData = {
      subject_id:
        subject_id.trim(),
      title: title.trim(),
      description:
        isNonEmptyString(description)
          ? description.trim()
          : null,
      content:
        isNonEmptyString(content)
          ? content.trim()
          : null,
    };

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("lessons")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error(
        "CREATE LESSON ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "CREATE LESSON EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create lesson.",
    });
  }
}

// =====================================================
// GET LESSONS BY SUBJECT
// =====================================================

export async function getLessonsBySubject(
  req: Request,
  res: Response
) {
  try {
    const { subject_id } = req.params;

    if (!isNonEmptyString(subject_id)) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required.",
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("lessons")
      .select("*")
      .eq(
        "subject_id",
        subject_id.trim()
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET LESSONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET LESSONS BY SUBJECT EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get lessons.",
    });
  }
}

// =====================================================
// UPDATE LESSON
// =====================================================

export async function updateLesson(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      subject_id,
      title,
      description,
      content,
    } = req.body;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required.",
      });
    }

    if (!isNonEmptyString(title)) {
      return res.status(400).json({
        success: false,
        message: "Lesson title is required.",
      });
    }

    const updateData: Record<
      string,
      unknown
    > = {
      title: title.trim(),
      description:
        isNonEmptyString(description)
          ? description.trim()
          : null,
      content:
        isNonEmptyString(content)
          ? content.trim()
          : null,
      updated_at:
        new Date().toISOString(),
    };

    if (
      subject_id !== undefined
    ) {
      if (!isNonEmptyString(subject_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subject ID.",
        });
      }

      const {
        data: subject,
        error: subjectError,
      } = await supabaseAdmin
        .from("subjects")
        .select("id")
        .eq(
          "id",
          subject_id.trim()
        )
        .maybeSingle();

      if (subjectError) {
        console.error(
          "CHECK UPDATE LESSON SUBJECT ERROR:",
          subjectError
        );

        return res.status(500).json({
          success: false,
          message:
            subjectError.message,
        });
      }

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }

      updateData.subject_id =
        subject_id.trim();
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("lessons")
      .update(updateData)
      .eq(
        "id",
        id.trim()
      )
      .select("*")
      .maybeSingle();

    if (error) {
      console.error(
        "UPDATE LESSON ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "UPDATE LESSON EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update lesson.",
    });
  }
}

// =====================================================
// DELETE LESSON
// =====================================================

export async function deleteLesson(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "Lesson ID is required.",
      });
    }

    const {
      data: lesson,
      error: lessonError,
    } = await supabaseAdmin
      .from("lessons")
      .select("id")
      .eq(
        "id",
        id.trim()
      )
      .maybeSingle();

    if (lessonError) {
      console.error(
        "CHECK DELETE LESSON ERROR:",
        lessonError
      );

      return res.status(500).json({
        success: false,
        message: lessonError.message,
      });
    }

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });
    }

    const {
      error: filesError,
    } = await supabaseAdmin
      .from("files")
      .delete()
      .eq(
        "lesson_id",
        id.trim()
      );

    if (filesError) {
      console.error(
        "DELETE LESSON FILES ERROR:",
        filesError
      );

      return res.status(500).json({
        success: false,
        message: filesError.message,
      });
    }

    const { error } =
      await supabaseAdmin
        .from("lessons")
        .delete()
        .eq(
          "id",
          id.trim()
        );

    if (error) {
      console.error(
        "DELETE LESSON ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Lesson deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE LESSON EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete lesson.",
    });
  }
}

// =====================================================
// GET ALL POSTS FOR ADMIN
// =====================================================

export async function getAdminPosts(
  req: Request,
  res: Response
) {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("posts")
      .select(`
        id,
        user_id,
        content,
        pdf_url,
        pdf_name,
        images_urls,
        created_at,
        visibility_type,
        audience_type,
        university_id,
        faculty_id,
        specialty_id,
        level_id,
        semester_id,
        module_id,
        teacher_name,
        academic_type,
        subject_name,
        academic_year
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "GET ADMIN POSTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(
      "GET ADMIN POSTS EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get admin posts.",
    });
  }
}

// =====================================================
// DELETE POST
// =====================================================

export async function deletePost(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!isNonEmptyString(id)) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required.",
      });
    }

    const postId = id.trim();

    const {
      data: post,
      error: postError,
    } = await supabaseAdmin
      .from("posts")
      .select("id")
      .eq("id", postId)
      .maybeSingle();

    if (postError) {
      console.error(
        "CHECK DELETE POST ERROR:",
        postError
      );

      return res.status(500).json({
        success: false,
        message: postError.message,
      });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const {
      error: likesError,
    } = await supabaseAdmin
      .from("post_likes")
      .delete()
      .eq("post_id", postId);

    if (likesError) {
      console.error(
        "DELETE POST LIKES ERROR:",
        likesError
      );

      return res.status(500).json({
        success: false,
        message: likesError.message,
      });
    }

    const {
      error: commentsError,
    } = await supabaseAdmin
      .from("comments")
      .delete()
      .eq("post_id", postId);

    if (commentsError) {
      console.error(
        "DELETE POST COMMENTS ERROR:",
        commentsError
      );

      return res.status(500).json({
        success: false,
        message: commentsError.message,
      });
    }

    const {
      error: deletePostError,
    } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deletePostError) {
      console.error(
        "DELETE POST ERROR:",
        deletePostError
      );

      return res.status(500).json({
        success: false,
        message: deletePostError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE POST EXCEPTION:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete post.",
    });
  }
}