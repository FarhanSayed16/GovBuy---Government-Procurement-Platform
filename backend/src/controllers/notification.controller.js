import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";

// Get all notifications for the logged-in user
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

// Mark a single notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: req.user.id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

// Mark all notifications as read for the logged-in user
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "All notifications marked as read"));
});

// (Optional) Internal helper to create notifications
const createNotification = async ({ userId, message }) => {
  try {
    const note = await Notification.create({ user: userId, message });
    return note;
  } catch (err) {
    console.error("Notification creation error:", err);
    throw err;
  }
};

export {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
};
