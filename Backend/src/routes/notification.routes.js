import { Router } from 'express';
import {
    getUserNotifications,
    markNotificationAsRead,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

// Define notification routes
router.get("/", getUserNotifications); // Get all notifications for the authenticated user
router.patch("/:notificationId/read", markNotificationAsRead); // Mark a specific notification as read

export default router;
