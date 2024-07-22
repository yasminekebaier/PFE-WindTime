const { models } = require("../models/index");

const getAllNotifications = async (req, res) => {
    try {
        const { UserId } = req.params;
        const notifications = await models.Notification.findAll({
            include: [
                {
                    model: models.Users,
                    as: 'users', 
                    where: { id: UserId }
                }
            ]
        });
        res.status(200).json({ notifications});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error retrieving notifications" });
    }
}
const markAllNotificationsAsReadForUser = async (req, res) => {
    try {
        const { UserId } = req.params;
const userNotifications = await models.UserNotifications.findAll({
            where: { UserId }
        })
        for (const userNotification of userNotifications) {
            const { NotificationId } = userNotification;
            await models.Notification.update({ Status: 'read' }, {
                where: { id: NotificationId }
            });
        }

        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error marking notifications as read" });
    }
};


module.exports = {
    getAllNotifications,
    markAllNotificationsAsReadForUser
    
}
