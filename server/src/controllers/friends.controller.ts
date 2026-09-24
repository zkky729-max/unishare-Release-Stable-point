import {
  Request,
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getFriends,
  searchUsers,
} from "../services/friends.service.js";

// =====================================================
// SEND FRIEND REQUEST
// =====================================================

export const createFriendRequest =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const authenticatedReq =
        req as AuthenticatedRequest;

      const {
        targetUserId,
      } = req.body;

      if (
        typeof targetUserId !==
          "string" ||
        !targetUserId.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "targetUserId is required",
        });
      }

      const friendship =
        await sendFriendRequest(
          authenticatedReq.accessToken,
          authenticatedReq.user.id,
          targetUserId
        );

      return res.status(201).json({
        success: true,
        data: friendship,
      });
    } catch (error: any) {
      console.error(
        "Create friend request error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Failed to send friend request",
      });
    }
  };

// =====================================================
// GET FRIEND REQUESTS
// =====================================================

export const getRequests =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const authenticatedReq =
        req as AuthenticatedRequest;

      const requests =
        await getFriendRequests(
          authenticatedReq.accessToken,
          authenticatedReq.user.id
        );

      return res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      console.error(
        "Get friend requests error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to load friend requests",
      });
    }
  };

// =====================================================
// ACCEPT FRIEND REQUEST
// =====================================================

export const acceptRequest =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const authenticatedReq =
        req as AuthenticatedRequest;

      const friendshipId =
        typeof req.params.friendshipId ===
        "string"
          ? req.params.friendshipId.trim()
          : "";

      if (!friendshipId) {
        return res.status(400).json({
          success: false,
          message:
            "friendshipId is required",
        });
      }

      const friendship =
        await acceptFriendRequest(
          authenticatedReq.accessToken,
          authenticatedReq.user.id,
          friendshipId
        );

      return res.status(200).json({
        success: true,
        data: friendship,
      });
    } catch (error: any) {
      console.error(
        "Accept friend request error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Failed to accept friend request",
      });
    }
  };

// =====================================================
// REJECT FRIEND REQUEST
// =====================================================

export const rejectRequest =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const authenticatedReq =
        req as AuthenticatedRequest;

      const friendshipId =
        typeof req.params.friendshipId ===
        "string"
          ? req.params.friendshipId.trim()
          : "";

      if (!friendshipId) {
        return res.status(400).json({
          success: false,
          message:
            "friendshipId is required",
        });
      }

      const friendship =
        await rejectFriendRequest(
          authenticatedReq.accessToken,
          authenticatedReq.user.id,
          friendshipId
        );

      return res.status(200).json({
        success: true,
        data: friendship,
      });
    } catch (error: any) {
      console.error(
        "Reject friend request error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Failed to reject friend request",
      });
    }
  };

// =====================================================
// CANCEL FRIEND REQUEST
// =====================================================

export const cancelRequest =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const authenticatedReq =
        req as AuthenticatedRequest;

      const friendshipId =
        typeof req.params.friendshipId ===
        "string"
          ? req.params.friendshipId.trim()
          : "";

      if (!friendshipId) {
        return res.status(400).json({
          success: false,
          message:
            "friendshipId is required",
        });
      }

      const result =
        await cancelFriendRequest(
          authenticatedReq.accessToken,
          authenticatedReq.user.id,
          friendshipId
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error(
        "Cancel friend request error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Failed to cancel friend request",
      });
    }
  };

// =====================================================
// GET FRIENDS
// =====================================================

export const getFriendsController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const authenticatedReq =
        req as AuthenticatedRequest;

      const friends =
        await getFriends(
          authenticatedReq.accessToken,
          authenticatedReq.user.id
        );

      return res.status(200).json({
        success: true,
        data: friends,
      });
    } catch (error: any) {
      console.error(
        "Get friends error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to load friends",
      });
    }
  };

// =====================================================
// SEARCH USERS
// =====================================================

export const searchUsersController =
  async (
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

      if (!q) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      const users =
        await searchUsers(
          authenticatedReq.accessToken,
          authenticatedReq.user.id,
          q
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
