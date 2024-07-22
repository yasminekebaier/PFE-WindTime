module.exports = (sequelize,Sequelize) => {
    const notification = sequelize.define("Notification", {
        Description: {
            type: Sequelize.STRING,
            allowNull: false,},
            Status: {
                type: Sequelize.STRING,
                defaultValue: 'unread'
            }

    })
    
    return notification;
}