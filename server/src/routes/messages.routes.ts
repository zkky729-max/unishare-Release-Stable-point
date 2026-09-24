import express from "express";

import {
  createConversation,
  getConversations,
  searchUsersController,
  getMessages,
  createMessage,
} from "../controllers/messages.controller.js";
import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// SEARCH USERS
// =====================================================

router.get(
  "/users/search",
  requireAuth,
  searchUsersController
);

// =====================================================
// CONVERSATIONS
// =====================================================

router.get(
  "/conversations",
  requireAuth,
  getConversations
);

router.post(
  "/conversations",
  requireAuth,
  createConversation
);

// =====================================================
// MESSAGES
// =====================================================

router.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  getMessages
);

router.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  createMessage
);

export default router;