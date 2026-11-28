
import express from "express";

import {
  submitVolunteerApplication,
} from "../controllers/volunteer.controller.js";

const router = express.Router();

// =====================================================
// SUBMIT VOLUNTEER APPLICATION
// =====================================================

router.post(
  "/",
  submitVolunteerApplication
);

export default router;
