import { Router } from "express";

import {
  requireAdmin,
  requireAuth,
} from "../middleware/auth.middleware.js";

import {
  // =====================================================
  // USERS
  // =====================================================

  getUsers,
  getUser,
  getStats,
  updateUserRole,
  deleteUser,

  // =====================================================
  // POSTS
  // =====================================================

  getAdminPosts,
  deletePost,

  // =====================================================
  // UNIVERSITIES
  // =====================================================

  createUniversity,
  getUniversities,
  updateUniversity,
  deleteUniversity,

  // =====================================================
  // FACULTIES
  // =====================================================

  createFaculty,
  getFaculties,
  deleteFaculty,

  // =====================================================
  // DEPARTMENTS
  // =====================================================

  createDepartment,
  getDepartmentsByFaculty,
  updateDepartment,
  deleteDepartment,

  // =====================================================
  // SPECIALTIES
  // =====================================================

  createSpecialty,
  getSpecialties,
  getSpecialtiesByFaculty,
  deleteSpecialty,

  // =====================================================
  // LEVELS
  // =====================================================

  createLevel,
  getLevelsBySpecialty,

  // =====================================================
  // SEMESTERS
  // =====================================================

  createSemester,
  getSemestersByLevel,

  // =====================================================
  // MODULES
  // =====================================================

  createModule,
  getModules,
  getModulesBySemester,

  // =====================================================
  // SUBJECTS
  // =====================================================

  createSubject,
  getSubjects,
  getSubjectsByModule,

  // =====================================================
  // LESSONS
  // =====================================================

  createLesson,
  getLessonsBySubject,
  updateLesson,
  deleteLesson,
} from "../controllers/admin.controller.js";

const router = Router();

// =====================================================
// ADMIN AUTHENTICATION
// =====================================================

router.use(requireAuth);
router.use(requireAdmin);

// =====================================================
// USERS
// =====================================================

router.get(
  "/users",
  getUsers
);

router.get(
  "/users/:userId",
  getUser
);

router.get(
  "/stats",
  getStats
);

router.put(
  "/users/:userId/role",
  updateUserRole
);

router.delete(
  "/users/:userId",
  deleteUser
);

// =====================================================
// POSTS
// =====================================================

// GET all posts for admin
// /api/admin/posts

router.get(
  "/posts",
  getAdminPosts
);

// DELETE post
// /api/admin/posts/:id

router.delete(
  "/posts/:id",
  deletePost
);

// =====================================================
// UNIVERSITIES
// =====================================================

router.post(
  "/universities",
  createUniversity
);

router.get(
  "/universities",
  getUniversities
);

router.put(
  "/universities/:id",
  updateUniversity
);

router.delete(
  "/universities/:id",
  deleteUniversity
);

// =====================================================
// FACULTIES
// =====================================================

router.post(
  "/faculties",
  createFaculty
);

router.get(
  "/faculties",
  getFaculties
);

router.delete(
  "/faculties/:id",
  deleteFaculty
);

// =====================================================
// DEPARTMENTS
// =====================================================

// GET departments by faculty
// /api/admin/departments/faculty/:faculty_id

router.get(
  "/departments/faculty/:faculty_id",
  getDepartmentsByFaculty
);

// CREATE department
// /api/admin/departments

router.post(
  "/departments",
  createDepartment
);

// UPDATE department
// /api/admin/departments/:id

router.put(
  "/departments/:id",
  updateDepartment
);

// DELETE department
// /api/admin/departments/:id

router.delete(
  "/departments/:id",
  deleteDepartment
);

// =====================================================
// SPECIALTIES
// =====================================================

// CREATE specialty
// /api/admin/specialties

router.post(
  "/specialties",
  createSpecialty
);

// GET all specialties
// /api/admin/specialties

router.get(
  "/specialties",
  getSpecialties
);

// GET specialties by faculty
// /api/admin/specialties/faculty/:faculty_id

router.get(
  "/specialties/faculty/:faculty_id",
  getSpecialtiesByFaculty
);

// DELETE specialty
// /api/admin/specialties/:id

router.delete(
  "/specialties/:id",
  deleteSpecialty
);

// =====================================================
// LEVELS
// =====================================================

router.post(
  "/levels",
  createLevel
);

router.get(
  "/levels/specialty/:specialty_id",
  getLevelsBySpecialty
);

// =====================================================
// SEMESTERS
// =====================================================

router.post(
  "/semesters",
  createSemester
);

router.get(
  "/semesters/level/:level_id",
  getSemestersByLevel
);

// =====================================================
// MODULES
// =====================================================

router.post(
  "/modules",
  createModule
);

router.get(
  "/modules",
  getModules
);

router.get(
  "/modules/semester/:semester_id",
  getModulesBySemester
);

// =====================================================
// SUBJECTS
// =====================================================

router.post(
  "/subjects",
  createSubject
);

router.get(
  "/subjects",
  getSubjects
);

router.get(
  "/subjects/module/:module_id",
  getSubjectsByModule
);

// =====================================================
// LESSONS
// =====================================================

router.post(
  "/lessons",
  createLesson
);

router.get(
  "/lessons/subject/:subject_id",
  getLessonsBySubject
);

router.put(
  "/lessons/:id",
  updateLesson
);

router.delete(
  "/lessons/:id",
  deleteLesson
);

export default router;