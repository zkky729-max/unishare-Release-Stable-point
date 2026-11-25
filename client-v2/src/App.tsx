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
import UniversitySpacePage from "./features/universities/pages/UniversitySpacePage";

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
// GROUP CHATS
// =====================================================

import GroupChatPage from "./features/groupChats/pages/GroupChatPage";

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

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        <Route path="/create-avatar" element={<CreateAvatar />} />

        {/* PUBLIC ACADEMIC AREA */}

        <Route path="/countries" element={<CountriesPage />} />

        <Route path="/countries/:countryId" element={<CountryDetailsPage />} />

        {/* UNIVERSITIES */}

        <Route path="/universities" element={<UniversitiesPage />} />

        <Route path="/universities/:slug" element={<UniversitySpacePage />} />

        {/* FACULTIES */}

        <Route path="/faculties" element={<Faculties />} />

        <Route
          path="/faculties/:id/specialties"
          element={<FacultySpacePage />}
        />

        {/* DEPARTMENTS */}

        <Route path="/departments" element={<DepartmentsPage />} />

        <Route path="/departments/:id" element={<DepartmentDetailsPage />} />

        {/* SEMESTERS */}

        <Route path="/levels/:levelId/semesters" element={<Semesters />} />

        <Route path="/semesters/:semesterId" element={<SemesterSpacePage />} />

        {/* LESSONS */}

        <Route path="/subjects/:subjectId/lessons" element={<LessonsPage />} />

        <Route path="/lessons/:id" element={<LessonDetailsPage />} />

        {/* ADMIN */}

        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* PROTECTED AREA */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/profile/:userId" element={<Profile />} />

            <Route path="/profile/edit" element={<EditProfile />} />

            <Route path="/messages" element={<MessagesPage />} />

            <Route
              path="/messages/:conversationId"
              element={<ConversationPage />}
            />

            <Route
              path="/group-chats/:groupId"
              element={<GroupChatPage />}
            />

            <Route path="/friends" element={<FriendsPage />} />

            <Route path="/people" element={<PeoplePage />} />

            <Route path="/gems" element={<GamificationPage />} />

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

        {/* FALLBACK */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}