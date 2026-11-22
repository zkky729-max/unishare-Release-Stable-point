
import {
  Request,
  Response,
  RequestHandler,
} from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

import * as groupChatsService from "../services/groupChats.service.js";

// =====================================================
// TYPES
// =====================================================

type AsyncController = (
  req: AuthenticatedRequest,
  res: Response
) => Promise<void>;

// =====================================================
// ERROR HANDLER
// =====================================================

function handleControllerError(
  res: Response,
  error: unknown,
  message: string
): void {
  console.error(
    `[Group Chats] ${message}:`,
    error
  );

  const errorMessage =
    error instanceof Error
      ? error.message
      : "";

  const status =
    errorMessage.includes("required") ||
    errorMessage.includes("غير صالح") ||
    errorMessage.includes("يجب") ||
    errorMessage.includes("لا يمكنك") ||
    errorMessage.includes("انتهت صلاحية") ||
    errorMessage.includes("أكبر من صفر")
      ? 400
      : 500;

  res.status(status).json({
    success: false,
    message:
      status === 400
        ? errorMessage
        : message,
  });
}

// =====================================================
// CONTROLLER WRAPPER
// =====================================================

function createController(
  handler: AsyncController,
  errorMessage: string
): RequestHandler {
  return async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await handler(
        req as AuthenticatedRequest,
        res
      );
    } catch (error) {
      handleControllerError(
        res,
        error,
        errorMessage
      );
    }
  };
}

// =====================================================
// GET MY GROUP CHATS
// GET /api/group-chats
// =====================================================

export const getMyGroupChatsController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.getMyGroupChats(
          req.accessToken
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to get group chats"
  );

// =====================================================
// GET SEMESTER GROUP CHATS
// GET /api/group-chats/semester?semesterId=...
// =====================================================

export const getSemesterGroupChatsController =
  createController(
    async (req, res) => {
      const semesterId = req.query.semesterId;

      if (
        typeof semesterId !== "string" ||
        !semesterId.trim()
      ) {
        throw new Error("semesterId is required");
      }

      const data =
        await groupChatsService.getSemesterGroupChats(
          req.accessToken,
          semesterId
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to get semester group chats"
  );

// =====================================================
// GET GROUP DETAILS
// GET /api/group-chats/:groupId
// =====================================================

export const getGroupChatDetailsController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.getGroupChatDetails(
          req.accessToken,
          req.params.groupId
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to get group details"
  );

// =====================================================
// CREATE GROUP CHAT
// POST /api/group-chats
// =====================================================

export const createGroupChatController =
  createController(
    async (req, res) => {
      const {
        name,
        description,
        groupType,
        semesterId,
        isPrivate,
      } = req.body ?? {};

      const groupId =
        await groupChatsService.createGroupChat(
          req.accessToken,
          {
            name,
            description,
            groupType,
            semesterId,
            isPrivate,
          }
        );

      res.status(201).json({
        success: true,
        data: {
          groupId,
        },
      });
    },
    "Failed to create group chat"
  );

// =====================================================
// GET GROUP MEMBERS
// GET /api/group-chats/:groupId/members
// =====================================================

export const getGroupChatMembersController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.getGroupChatMembers(
          req.accessToken,
          req.params.groupId
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to get group members"
  );

// =====================================================
// GET GROUP MESSAGES
// GET /api/group-chats/:groupId/messages
// =====================================================

export const getGroupChatMessagesController =
  createController(
    async (req, res) => {
      const rawLimit = req.query.limit;

      const parsedLimit =
        rawLimit === undefined
          ? 50
          : Number(rawLimit);

      const limit =
        Number.isFinite(parsedLimit)
          ? parsedLimit
          : 50;

      const data =
        await groupChatsService.getGroupChatMessages(
          req.accessToken,
          req.params.groupId,
          limit
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to get group messages"
  );

// =====================================================
// SEND GROUP MESSAGE
// POST /api/group-chats/:groupId/messages
// =====================================================

export const sendGroupChatMessageController =
  createController(
    async (req, res) => {
      const {
        content,
        replyTo,
        attachmentUrl,
        attachmentName,
        attachmentType,
      } = req.body ?? {};

      const data =
        await groupChatsService.sendGroupChatMessage(
          req.accessToken,
          req.params.groupId,
          {
            content,
            replyTo,
            attachmentUrl,
            attachmentName,
            attachmentType,
          }
        );

      res.status(201).json({
        success: true,
        data,
      });
    },
    "Failed to send group message"
  );

// =====================================================
// EDIT GROUP MESSAGE
// PATCH /api/group-chats/messages/:messageId
// =====================================================

export const editGroupChatMessageController =
  createController(
    async (req, res) => {
      const { content } = req.body ?? {};

      const data =
        await groupChatsService.manageGroupChatMessage(
          req.accessToken,
          req.params.messageId,
          "edit",
          content
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to edit group message"
  );

// =====================================================
// DELETE GROUP MESSAGE
// DELETE /api/group-chats/messages/:messageId
// =====================================================

export const deleteGroupChatMessageController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.manageGroupChatMessage(
          req.accessToken,
          req.params.messageId,
          "delete"
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to delete group message"
  );

// =====================================================
// CREATE DIRECT INVITATION
// POST /api/group-chats/:groupId/invitations
// =====================================================

export const createDirectGroupInvitationController =
  createController(
    async (req, res) => {
      const { invitedProfileId } = req.body ?? {};

      const invitationId =
        await groupChatsService.createDirectGroupInvitation(
          req.accessToken,
          req.params.groupId,
          invitedProfileId
        );

      res.status(201).json({
        success: true,
        data: {
          invitationId,
        },
      });
    },
    "Failed to create group invitation"
  );

// =====================================================
// CREATE GROUP INVITATION LINK
// POST /api/group-chats/:groupId/invitations/link
// =====================================================

export const createGroupChatLinkInvitationController =
  createController(
    async (req, res) => {
      const {
        maxUses,
        expiresAt,
      } = req.body ?? {};

      const data =
        await groupChatsService.createGroupChatLinkInvitation(
          req.accessToken,
          req.params.groupId,
          {
            maxUses,
            expiresAt,
          }
        );

      res.status(201).json({
        success: true,
        data: {
          invitationId: data.invitationId,
          token: data.token,
        },
      });
    },
    "Failed to create group invitation link"
  );

// =====================================================
// GET MY GROUP INVITATIONS
// GET /api/group-chats/invitations
// =====================================================

export const getMyGroupInvitationsController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.getMyGroupInvitations(
          req.accessToken
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to get group invitations"
  );

// =====================================================
// ACCEPT INVITATION
// POST /api/group-chats/invitations/:invitationId/accept
// =====================================================

export const acceptGroupChatInvitationController =
  createController(
    async (req, res) => {
      const groupId =
        await groupChatsService.acceptGroupChatInvitation(
          req.accessToken,
          req.params.invitationId
        );

      res.status(200).json({
        success: true,
        data: {
          groupId,
        },
      });
    },
    "Failed to accept group invitation"
  );

// =====================================================
// ACCEPT INVITATION BY LINK TOKEN
// POST /api/group-chats/invitations/accept-link
// =====================================================

export const acceptGroupChatInvitationByTokenController =
  createController(
    async (req, res) => {
      const { token } = req.body ?? {};

      const groupId =
        await groupChatsService.acceptGroupChatInvitationByToken(
          req.accessToken,
          token
        );

      res.status(200).json({
        success: true,
        data: {
          groupId,
        },
      });
    },
    "Failed to accept group invitation link"
  );

// =====================================================
// REJECT INVITATION
// POST /api/group-chats/invitations/:invitationId/reject
// =====================================================

export const rejectGroupChatInvitationController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.rejectGroupChatInvitation(
          req.accessToken,
          req.params.invitationId
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to reject group invitation"
  );

// =====================================================
// LEAVE GROUP
// DELETE /api/group-chats/:groupId/members/me
// =====================================================

export const leaveGroupChatController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.leaveGroupChat(
          req.accessToken,
          req.params.groupId
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to leave group"
  );

// =====================================================
// REMOVE GROUP MEMBER
// DELETE /api/group-chats/:groupId/members/:profileId
// =====================================================

export const removeGroupChatMemberController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.removeGroupChatMember(
          req.accessToken,
          req.params.groupId,
          req.params.profileId
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to remove group member"
  );

// =====================================================
// UPDATE MEMBER ROLE
// PATCH /api/group-chats/:groupId/members/:profileId/role
// =====================================================

export const updateGroupChatMemberRoleController =
  createController(
    async (req, res) => {
      const { role } = req.body ?? {};

      const data =
        await groupChatsService.updateGroupChatMemberRole(
          req.accessToken,
          req.params.groupId,
          req.params.profileId,
          role
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to update member role"
  );

// =====================================================
// TRANSFER GROUP OWNERSHIP
// POST /api/group-chats/:groupId/transfer-ownership
// =====================================================

export const transferGroupChatOwnershipController =
  createController(
    async (req, res) => {
      const { newOwnerProfileId } = req.body ?? {};

      const data =
        await groupChatsService.transferGroupChatOwnership(
          req.accessToken,
          req.params.groupId,
          newOwnerProfileId
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to transfer group ownership"
  );

// =====================================================
// UPDATE GROUP DETAILS
// PATCH /api/group-chats/:groupId
// =====================================================

export const updateGroupChatController =
  createController(
    async (req, res) => {
      const {
        name,
        description,
        avatarUrl,
        isPrivate,
      } = req.body ?? {};

      const data =
        await groupChatsService.updateGroupChat(
          req.accessToken,
          req.params.groupId,
          {
            name,
            description,
            avatarUrl,
            isPrivate,
          }
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to update group"
  );

// =====================================================
// PIN GROUP MESSAGE
// POST /api/group-chats/:groupId/messages/:messageId/pin
// =====================================================

export const pinGroupChatMessageController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.manageGroupChatPin(
          req.accessToken,
          req.params.groupId,
          req.params.messageId,
          "pin"
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to pin group message"
  );

// =====================================================
// UNPIN GROUP MESSAGE
// DELETE /api/group-chats/:groupId/messages/:messageId/pin
// =====================================================

export const unpinGroupChatMessageController =
  createController(
    async (req, res) => {
      const data =
        await groupChatsService.manageGroupChatPin(
          req.accessToken,
          req.params.groupId,
          req.params.messageId,
          "unpin"
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to unpin group message"
  );

// =====================================================
// TOGGLE MESSAGE REACTION
// POST /api/group-chats/messages/:messageId/reactions
// =====================================================

export const toggleGroupChatReactionController =
  createController(
    async (req, res) => {
      const { reaction } = req.body ?? {};

      const data =
        await groupChatsService.toggleGroupChatReaction(
          req.accessToken,
          req.params.messageId,
          reaction
        );

      res.status(200).json({
        success: true,
        data,
      });
    },
    "Failed to toggle message reaction"
  );
