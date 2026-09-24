import { Request, Response } from "express";

import {
  ALLOWED_ROLES,
  deleteAdminUser,
  getAdminUserById,
  getAdminStats,
  getAdminUsers,
  updateAdminUserRole,
} from "../services/admin-users.service";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

/**
 * GET /api/admin/users
 * جلب جميع المستخدمين
 */
export const getUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAdminUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(
      "GET ADMIN USERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch users",
    });
  }
};

/**
 * GET /api/admin/stats
 * جلب إحصائيات لوحة الإدارة
 */
export const getStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await getAdminStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "GET ADMIN STATS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch admin statistics",
    });
  }
};

/**
 * GET /api/admin/users/:userId
 * جلب مستخدم واحد
 */
export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });

      return;
    }

    const user =
      await getAdminUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "GET ADMIN USER ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch user";

    res.status(
      message === "Invalid user ID"
        ? 400
        : 500
    ).json({
      success: false,
      message,
    });
  }
};

/**
 * PATCH /api/admin/users/:userId/role
 * تغيير دور المستخدم
 */
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });

      return;
    }

    if (
      typeof role !== "string" ||
      !role.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Role is required",
        allowedRoles: ALLOWED_ROLES,
      });

      return;
    }

    const authenticatedReq =
      req as AuthenticatedRequest;

    /**
     * منع الأدمن من إزالة صلاحية الأدمن
     * من حسابه الشخصي
     */
    if (
      authenticatedReq.user.id === userId &&
      role.trim() !== "admin"
    ) {
      res.status(400).json({
        success: false,
        message:
          "You cannot remove your own admin role",
      });

      return;
    }

    const updatedUser =
      await updateAdminUserRole(
        userId,
        role.trim()
      );

    res.status(200).json({
      success: true,
      message:
        "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(
      "UPDATE USER ROLE ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update user role";

    let status = 500;

    if (
      message === "Invalid user ID" ||
      message.startsWith("Invalid role")
    ) {
      status = 400;
    }

    if (
      message === "User not found" ||
      message === "User profile not found"
    ) {
      status = 404;
    }

    res.status(status).json({
      success: false,
      message,
      allowedRoles: ALLOWED_ROLES,
    });
  }
};

/**
 * DELETE /api/admin/users/:userId
 * حذف المستخدم
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });

      return;
    }

    const authenticatedReq =
      req as AuthenticatedRequest;

    /**
     * منع الأدمن من حذف حسابه الشخصي
     */
    if (
      authenticatedReq.user.id === userId
    ) {
      res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account",
      });

      return;
    }

    await deleteAdminUser(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ADMIN USER ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete user";

    let status = 500;

    if (
      message === "Invalid user ID"
    ) {
      status = 400;
    }

    if (
      message === "User not found"
    ) {
      status = 404;
    }

    res.status(status).json({
      success: false,
      message,
    });
  }
};