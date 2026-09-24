import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import {
  AuthenticatedRequest,
} from "./auth.middleware.js";
import {
  supabaseAdmin,
} from "../lib/supabaseAdmin.js";

export const requireAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedReq =
      req as AuthenticatedRequest;

    const userId =
      authenticatedReq.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const {
      data: profile,
      error,
    } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "Admin role lookup error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to verify admin permissions",
      });

      return;
    }

    if (!profile) {
      res.status(403).json({
        success: false,
        message: "Admin access required",
      });

      return;
    }

    if (profile.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Admin access required",
      });

      return;
    }

    next();
  } catch (error) {
    console.error(
      "Admin middleware error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to verify admin permissions",
    });

    return;
  }
};