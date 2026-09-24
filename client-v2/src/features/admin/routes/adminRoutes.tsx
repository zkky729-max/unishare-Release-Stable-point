import { Routes, Route } from "react-router-dom";

// =====================================================
// Authentication / Authorization
// =====================================================

import ProtectedRoute from "../../auth/components/ProtectedRoute";

// =====================================================
// Admin Layout
// =====================================================

import AdminLayout from "../components/AdminLayout";

// =====================================================
// Admin Pages
// =====================================================

import AdminDashboardPage from "../pages/AdminDashboardPage";
import UsersManagementPage from "../pages/UsersManagementPage";
import RoleHistoryPage from "../pages/RoleHistoryPage";
import TestAdminPage from "../pages/TestAdminPage";

import UniversitiesPage from "../pages/UniversitiesPage";
import FacultiesManagementPage from "../pages/FacultiesManagementPage";
import DepartmentsManagementPage from "../pages/DepartmentsManagementPage";
import SpecialtiesManagementPage from "../pages/SpecialtiesManagementPage";
import LevelsManagementPage from "../pages/LevelsManagementPage";
import SemestersManagementPage from "../pages/SemestersManagementPage";
import ModulesManagementPage from "../pages/ModulesManagementPage";
import SubjectsManagementPage from "../pages/SubjectsManagementPage";
import LessonsManagementPage from "../pages/LessonsManagementPage";
import PostsManagementPage from "../pages/PostsManagementPage";

// =====================================================
// Admin Routes
// =====================================================

export default function AdminRoutes() {
  return (
    <Routes>
      {/* =================================================
          ADMIN AUTHORIZATION
      ================================================= */}

      <Route
        element={
          <ProtectedRoute roles={["admin"]} />
        }
      >
        {/* =================================================
            ADMIN LAYOUT
        ================================================= */}

        <Route element={<AdminLayout />}>

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            index
            element={<AdminDashboardPage />}
          />

          {/* =================================================
              USERS
          ================================================= */}

          <Route
            path="users"
            element={<UsersManagementPage />}
          />

          {/* =================================================
              ROLE HISTORY
          ================================================= */}

          <Route
            path="role-history"
            element={<RoleHistoryPage />}
          />

          {/* =================================================
              POSTS
          ================================================= */}

          <Route
            path="posts"
            element={<PostsManagementPage />}
          />

          {/* =================================================
              UNIVERSITIES
          ================================================= */}

          <Route
            path="universities"
            element={<UniversitiesPage />}
          />

          {/* =================================================
              FACULTIES
          ================================================= */}

          <Route
            path="faculties"
            element={<FacultiesManagementPage />}
          />

          {/* =================================================
              DEPARTMENTS
          ================================================= */}

          <Route
            path="departments"
            element={<DepartmentsManagementPage />}
          />

          {/* =================================================
              SPECIALTIES
          ================================================= */}

          <Route
            path="specialties"
            element={<SpecialtiesManagementPage />}
          />

          {/* =================================================
              LEVELS
          ================================================= */}

          <Route
            path="levels"
            element={<LevelsManagementPage />}
          />

          {/* =================================================
              SEMESTERS
          ================================================= */}

          <Route
            path="semesters"
            element={<SemestersManagementPage />}
          />

          {/* =================================================
              MODULES
          ================================================= */}

          <Route
            path="modules"
            element={<ModulesManagementPage />}
          />

          {/* =================================================
              SUBJECTS
          ================================================= */}

          <Route
            path="subjects"
            element={<SubjectsManagementPage />}
          />

          {/* =================================================
              LESSONS
          ================================================= */}

          <Route
            path="lessons"
            element={<LessonsManagementPage />}
          />

          {/* =================================================
              TEST
          ================================================= */}

          <Route
            path="test"
            element={<TestAdminPage />}
          />

        </Route>
      </Route>
    </Routes>
  );
}