import express from "express";

import {
  createFriendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getFriendsController,
  searchUsersController,
} from "../controllers/friends.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// FRIENDS LIST
// =====================================================

router.get(
  "/",
  requireAuth,
  getFriendsController
);

// =====================================================
// SEARCH USERS
// =====================================================
//
// البحث العام عن المستخدمين داخل UniShare.
//
// مثال:
// GET /api/friends/users/search?q=ahmed
// =====================================================

router.get(
  "/users/search",
  requireAuth,
  searchUsersController
);

// =====================================================
// FRIEND REQUESTS
// =====================================================

router.get(
  "/requests",
  requireAuth,
  getRequests
);

// =====================================================
// SEND FRIEND REQUEST
// =====================================================

router.post(
  "/requests",
  requireAuth,
  createFriendRequest
);

// =====================================================
// ACCEPT FRIEND REQUEST
// =====================================================

router.patch(
  "/requests/:friendshipId/accept",
  requireAuth,
  acceptRequest
);

// =====================================================
// REJECT FRIEND REQUEST
// =====================================================

router.patch(
  "/requests/:friendshipId/reject",
  requireAuth,
  rejectRequest
);

// =====================================================
// CANCEL FRIEND REQUEST
// =====================================================

router.delete(
  "/requests/:friendshipId",
  requireAuth,
  cancelRequest
);

export default router;
