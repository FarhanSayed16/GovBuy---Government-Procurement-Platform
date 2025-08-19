import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// GET    /api/notifications        → fetch all for current user
// PATCH  /api/notifications/read-all → mark all read
// PATCH  /api/notifications/:notificationId/read → mark one read

router
  .route("/")
  .get(verifyJWT, getNotifications)
  .post(verifyJWT, createNotification)

router
  .route("/read-all")
  .patch(verifyJWT, markAllAsRead);

router
  .route("/:notificationId/read")
  .patch(verifyJWT, markAsRead);

export default router;
