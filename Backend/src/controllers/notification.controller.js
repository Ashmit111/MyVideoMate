import {ApiResponse} from "../utils/ApiResponse.js"
import { Notification } from "../models/notification.model.js";

// Function to create and send a notification when a new video is published
export const createAndSendNotification = async (userId, message, videoId, io) => {
    try {
        // Save the notification to the database
        const notification = await Notification.create({
            user: userId,
            message,
            video: videoId,
        });

        // Check if the user is connected to the WebSocket server
        const socketId = connectedUsers[userId];
        if (socketId) {
            // Send the notification in real-time over WebSocket
            io.to(socketId).emit("newNotification", {
                message: notification.message,
                videoId: notification.video,
                notificationId: notification._id,
            });
        }

        return notification;
    } catch (error) {
        console.error("Error creating or sending notification:", error);
    }
};

// Controller to retrieve all notifications for a user
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, notifications, "Notifications retrieved successfully"));
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to retrieve notifications"));
    }
};

// Controller to mark a notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to mark notification as read"));
    }
};
