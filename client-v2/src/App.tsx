import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// =====================================================
// HOME
// =====================================================

import HomePage from "./features/home/pages/HomePage";

// =====================================================
// AUTH
// =====================================================

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

// =====================================================
// LAYOUT
// =====================================================

import DashboardLayout from "./layouts/DashboardLayout";

// =====================================================
// DASHBOARD / PROFILE
// =====================================================

import Dashboard from "./features/dashboard/pages/Dashboard";
import Profile from "./features/profile/pages/Profile";
import CompleteProfilePage from "./features/profile/pages/CompleteProfilePage";
import EditProfile from "./features/profile/pages/EditProfile";

// =====================================================
// AVATAR
// =====================================================

import CreateAvatar from "./features/avatar/pages/CreateAvatar";

// =====================================================
// POSTS / FEED
// =====================================================

import PostsPage from "./features/posts/pages/PostsPage";
import { FeedProvider } from "./features/posts/context/FeedContext";

// =====================================================
// GAMIFICATION
// =====================================================

import GamificationPage from "./features/gamification/pages/GamificationPage";

// =====================================================
// COUNTRIES
// =====================================================

import CountriesPage from "./features/countries/pages/CountriesPage";
import CountryDetailsPage from "./features/countries/pages/CountryDetailsPage";

// =====================================================
// UNIVERSITIES
// =====================================================

import UniversitiesPage from "./features/universities/pages/UniversitiesPage";
import UniversityDetailsPage from "./features/universities/pages/UniversityDetailsPage";

// =====================================================
// ACADEMIC
// =====================================================

import Faculties from "./features/faculties/pages/Faculties";
import FacultySpacePage from "./features/faculties/pages/FacultySpacePage";

import DepartmentsPage from "./features/departments/pages/DepartmentsPage";
import DepartmentDetailsPage from "./features/departments/pages/DepartmentDetailsPage";

import Semesters from "./features/semesters/pages/Semesters";
import SemesterSpacePage from "./features/semesters/pages/SemesterSpacePage";

// =====================================================
// LESSONS
// =====================================================

import LessonsPage from "./features/lessons/pages/LessonsPage";
import LessonDetailsPage from "./features/lessons/pages/LessonDetailsPage";

// =====================================================
// MESSAGES
// =====================================================

import MessagesPage from "./features/messages/pages/MessagesPage";
import ConversationPage from "./features/messages/pages/ConversationPage";

// =====================================================
// FRIENDS
// =====================================================

import FriendsPage from "./features/friends/pages/FriendsPage";
import PeoplePage from "./features/friends/pages/PeoplePage";

// =====================================================
// ADMIN
// =====================================================

import AdminRoutes from "./features/admin/routes/adminRoutes";

// =====================================================
// APP
// =====================================================

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* استرجاع كلمة المرور */}

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        {/* إعادة تعيين كلمة المرور */}

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/complete-profile"
          element={<CompleteProfilePage />}
        />

        <Route
          path="/create-avatar"
          element={<CreateAvatar />}
        />

        {/* =================================================
            PUBLIC ACADEMIC AREA
            متاح للزائر بدون تسجيل
        ================================================= */}

        {/* البلدان */}

        <Route
          path="/countries"
          element={<CountriesPage />}
        />

        <Route
          path="/countries/:countryId"
          element={<CountryDetailsPage />}
        />

        {/* الجامعات */}

        <Route
          path="/universities"
          element={<UniversitiesPage />}
        />

        <Route
          path="/universities/:slug"
          element={<UniversityDetailsPage />}
        />

        {/* الكليات */}

        <Route
          path="/faculties"
          element={<Faculties />}
        />

        {/* المسار القديم يبقى موجودًا حاليًا
            حتى لا نكسر أي جزء آخر من التطبيق */}

        <Route
          path="/faculties/:id/specialties"
          element={<FacultySpacePage />}
        />

        {/* الأقسام */}

        <Route
          path="/departments"
          element={<DepartmentsPage />}
        />

        <Route
          path="/departments/:id"
          element={<DepartmentDetailsPage />}
        />

        {/* السداسيات */}

        <Route
          path="/levels/:levelId/semesters"
          element={<Semesters />}
        />

        <Route
          path="/semesters/:semesterId"
          element={<SemesterSpacePage />}
        />

        {/* الدروس */}

        <Route
          path="/subjects/:subjectId/lessons"
          element={<LessonsPage />}
        />

        <Route
          path="/lessons/:id"
          element={<LessonDetailsPage />}
        />

        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route
          path="/admin/*"
          element={<AdminRoutes />}
        />

        {/* =================================================
            PROTECTED AREA
            الصفحات التي تحتاج حسابًا
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            {/* =============================================
                DASHBOARD
            ============================================= */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* =============================================
                PROFILE
            ============================================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* بروفايل مستخدم آخر */}

            <Route
              path="/profile/:userId"
              element={<Profile />}
            />

            <Route
              path="/profile/edit"
              element={<EditProfile />}
            />

            {/* =============================================
                MESSAGES
            ============================================= */}

            <Route
              path="/messages"
              element={<MessagesPage />}
            />

            <Route
              path="/messages/:conversationId"
              element={<ConversationPage />}
            />

            {/* =============================================
                FRIENDS
            ============================================= */}

            <Route
              path="/friends"
              element={<FriendsPage />}
            />

            <Route
              path="/people"
              element={<PeoplePage />}
            />

            {/* =============================================
                GAMIFICATION
            ============================================= */}

            <Route
              path="/gems"
              element={<GamificationPage />}
            />

            {/* =============================================
                POSTS / FEED
            ============================================= */}

            <Route
              path="/posts"
              element={
                <FeedProvider>
                  <PostsPage />
                </FeedProvider>
              }
            />

          </Route>

        </Route>

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}