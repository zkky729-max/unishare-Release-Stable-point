
import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import friendsRoutes from "./routes/friends.routes.js";
import groupChatsRoutes from "./routes/groupChats.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/admin", adminRoutes);

app.use("/api/messages", messagesRoutes);

app.use("/api/friends", friendsRoutes);

app.use("/api/group-chats", groupChatsRoutes);

// =====================================================
// VOLUNTEER APPLICATIONS
// =====================================================

app.use("/api/volunteer", volunteerRoutes);

export default app;
