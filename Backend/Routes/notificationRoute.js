const express = require ("express");
const notificationRouter = express.Router()
const notificationController=require("../Controllers/NotificationController")
notificationRouter.get("/notifications/:UserId",notificationController.getAllNotifications)
notificationRouter.put('/notificationStatus/:UserId', notificationController.markAllNotificationsAsReadForUser);
module.exports = notificationRouter ;