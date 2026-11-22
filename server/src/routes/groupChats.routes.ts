
import express from "express";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

import {
  getMyGroupChatsController,
  getSemesterGroupChatsController,
  getGroupChatDetailsController,
  createGroupChatController,
  getGroupChatMembersController,
  getGroupChatMessagesController,
  sendGroupChatMessageController,
  editGroupChatMessageController,
  deleteGroupChatMessageController,
  createDirectGroupInvitationController,
  createGroupChatLinkInvitationController,
  getMyGroupInvitationsController,
  acceptGroupChatInvitationController,
  acceptGroupChatInvitationByTokenController,
  rejectGroupChatInvitationController,
  leaveGroupChatController,
  removeGroupChatMemberController,
  updateGroupChatMemberRoleController,
  transferGroupChatOwnershipController,
  updateGroupChatController,
  pinGroupChatMessageController,
  unpinGroupChatMessageController,
  toggleGroupChatReactionController,
} from "../controllers/groupChats.controller.js";

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(requireAuth);

// =====================================================
// GROUP INVITATIONS
// =====================================================

router.get(
  "/invitations",
  getMyGroupInvitationsController
);

router.post(
  "/invitations/accept-link",
  acceptGroupChatInvitationByTokenController
);

router.post(
  "/invitations/:invitationId/accept",
  acceptGroupChatInvitationController
);

router.post(
  "/invitations/:invitationId/reject",
  rejectGroupChatInvitationController
);

// =====================================================
// GROUP LIST AND CREATION
// =====================================================

router.get(
  "/",
  getMyGroupChatsController
);

router.get(
  "/semester",
  getSemesterGroupChatsController
);

router.post(
  "/",
  createGroupChatController
);

// =====================================================
// MESSAGE OPERATIONS
// =====================================================

router.patch(
  "/messages/:messageId",
  editGroupChatMessageController
);

router.delete(
  "/messages/:messageId",
  deleteGroupChatMessageController
);

router.post(
  "/messages/:messageId/reactions",
  toggleGroupChatReactionController
);

// =====================================================
// GROUP DETAILS
// =====================================================

router.get(
  "/:groupId",
  getGroupChatDetailsController
);

router.patch(
  "/:groupId",
  updateGroupChatController
);

// =====================================================
// GROUP MEMBERS
// =====================================================

router.get(
  "/:groupId/members",
  getGroupChatMembersController
);

router.delete(
  "/:groupId/members/me",
  leaveGroupChatController
);

router.delete(
  "/:groupId/members/:profileId",
  removeGroupChatMemberController
);

router.patch(
  "/:groupId/members/:profileId/role",
  updateGroupChatMemberRoleController
);

// =====================================================
// GROUP MESSAGES
// =====================================================

router.get(
  "/:groupId/messages",
  getGroupChatMessagesController
);

router.post(
  "/:groupId/messages",
  sendGroupChatMessageController
);

// =====================================================
// GROUP INVITATION CREATION
// =====================================================

router.post(
  "/:groupId/invitations",
  createDirectGroupInvitationController
);

router.post(
  "/:groupId/invitations/link",
  createGroupChatLinkInvitationController
);

// =====================================================
// OWNERSHIP
// =====================================================

router.post(
  "/:groupId/transfer-ownership",
  transferGroupChatOwnershipController
);

// =====================================================
// PINNED MESSAGES
// =====================================================

router.post(
  "/:groupId/messages/:messageId/pin",
  pinGroupChatMessageController
);

router.delete(
  "/:groupId/messages/:messageId/pin",
  unpinGroupChatMessageController
);

// =====================================================
// EXPORT
// =====================================================

export default router;
