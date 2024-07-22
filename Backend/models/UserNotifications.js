module.exports = (sequelize, Sequelize) => {
    const UserNotifications = sequelize.define("UserNotifications", {
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        NotificationId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Notification',
                key: 'id'
            }
        }
    });
    return UserNotifications;
};
