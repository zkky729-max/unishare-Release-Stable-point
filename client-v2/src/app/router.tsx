import { createBrowserRouter } from "react-router-dom";

import HomePage from "../features/home/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import NotFoundPage from "../features/not-found/NotFoundPage";

import GamificationPage from "../features/gamification/pages/GamificationPage";
import MessagesPage from "../features/messages/pages/MessagesPage";

import DepartmentsPage from "../features/departments/pages/DepartmentsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/gamification",
    element: <GamificationPage />,
  },

  {
    path: "/messages",
    element: <MessagesPage />,
  },

  {
    path: "/departments",
    element: <DepartmentsPage />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);