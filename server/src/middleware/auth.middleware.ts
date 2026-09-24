import {
  Response,
  NextFunction,
  Request,
  RequestHandler,
} from "express";

import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from "../lib/supabaseAdmin.js";

// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

const supabaseUrl =
  getRequiredEnv("SUPABASE_URL");

const supabaseAnonKey =
  getRequiredEnv("SUPABASE_ANON_KEY");

// =====================================================
// SUPABASE AUTH CLIENT
// =====================================================

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// =====================================================
// AUTHENTICATED REQUEST
// =====================================================

export interface AuthenticatedRequest
  extends Request {
  user: {
    id: string;
    email?: string;
    [key: string]: unknown;
  };
  accessToken: string;
}

// =====================================================
// REQUIRE AUTH
// =====================================================

export const requireAuth: RequestHandler =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authorization =
        req.headers.authorization;

      if (!authorization) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      if (
        !authorization.startsWith(
          "Bearer "
        )
      ) {
        res.status(401).json({
          success: false,
          message:
            "Invalid authorization header",
        });
        return;
      }

      const accessToken =
        authorization
          .substring(7)
          .trim();

      if (!accessToken) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser(
          accessToken
        );

      if (error || !user) {
        console.error(
          "Authentication error:",
          error?.message
        );

        res.status(401).json({
          success: false,
          message:
            "Invalid or expired token",
        });
        return;
      }

      const authenticatedReq =
        req as AuthenticatedRequest;

      authenticatedReq.user = {
        id: user.id,
        email: user.email,
      };

      authenticatedReq.accessToken =
        accessToken;

      next();
    } catch (error) {
      console.error(
        "Auth middleware error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to authenticate request",
      });

      return;
    }
  };

// =====================================================
// REQUIRE ADMIN
// =====================================================

export const requireAdmin: RequestHandler =
  async (
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
          message:
            "Authentication required",
        });
        return;
      }

      // -------------------------------------------------
      // IMPORTANT:
      // Use the service-role admin client here.
      // The normal anon client can be blocked by RLS.
      // -------------------------------------------------

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
          "Admin role check error:",
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
          message:
            "User profile not found",
        });
        return;
      }

      if (profile.role !== "admin") {
        res.status(403).json({
          success: false,
          message:
            "Admin access required",
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