import { Request, Response } from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

import {
  getUserConversations,
  createOrOpenDirectConversation,
  searchUsers,
  getConversationMessages,
  sendMessage,
} from "../services/messages.service.js";

// =====================================================
// GET Conversations
// =====================================================

export const getConversations = async (
  req: Request,
  res: Response
) => {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const conversations =
      await getUserConversations(
        authenticatedReq.accessToken
      );

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error: any) {
    console.error(
      "Get conversations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to load conversations",
    });
  }
};

// =====================================================
// CREATE / OPEN Direct Conversation
// =====================================================

export const createConversation = async (
  req: Request,
  res: Response
) => {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const { otherUserId } = req.body;

    if (
      typeof otherUserId !== "string" ||
      !otherUserId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "otherUserId is required",
      });
    }

    const conversationId =
      await createOrOpenDirectConversation(
        authenticatedReq.accessToken,
        otherUserId.trim()
      );

    return res.status(200).json({
      success: true,
      data: {
        conversationId,
      },
    });
  } catch (error: any) {
    console.error(
      "Create conversation error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Failed to create conversation",
    });
  }
};

// =====================================================
// SEARCH USERS
// =====================================================

export const searchUsersController = async (
  req: Request,
  res: Response
) => {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const q =
      typeof req.query.q === "string"
        ? req.query.q.trim()
        : "";

    if (q.length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const users = await searchUsers(
      authenticatedReq.accessToken,
      q,
      authenticatedReq.user.id
    );

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error(
      "Search users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to search users",
    });
  }
};

// =====================================================
// GET CONVERSATION MESSAGES
// =====================================================

export const getMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const conversationId =
      typeof req.params.conversationId === "string"
        ? req.params.conversationId.trim()
        : "";

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    const messages =
      await getConversationMessages(
        authenticatedReq.accessToken,
        conversationId
      );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    console.error(
      "Get messages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to load messages",
    });
  }
};

// =====================================================
// SEND MESSAGE
// =====================================================

export const createMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const conversationId =
      typeof req.params.conversationId === "string"
        ? req.params.conversationId.trim()
        : "";

    const { content } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const message =
      await sendMessage(
        authenticatedReq.accessToken,
        conversationId,
        authenticatedReq.user.id,
        content
      );

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error(
      "Send message error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Failed to send message",
    });
  }
};