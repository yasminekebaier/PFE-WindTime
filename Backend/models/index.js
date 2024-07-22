const fs = require('fs');
const path = require('path'); 
const Sequelize = require("sequelize");
const config = require("../config/config");
const models = {};

require("dotenv").config();

const sequelizeConfig = {
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT_DB,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};
const sequelizeConnection = new Sequelize(sequelizeConfig);


fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== "index.js")
  .forEach((file) => {
    let model = require("./"+ file)(sequelizeConnection, Sequelize);
    models[model.name] = model;
  });

models.Users.hasMany(models.Tache)

models.Tache.belongsTo(models.Users)
models.Users.hasMany(models.Leave)
models.Leave.belongsTo(models.Users)
models.Project.hasMany(models.Tache)
models.Tache.belongsTo(models.Project)
models.Calendrier.belongsToMany(models.Users, { through: 'CalendrierUser',as: 'Utilisateurs' });
models.Users.belongsToMany(models.Calendrier, { through: 'CalendrierUser' });
models.Project.belongsToMany(models.Users, { through: 'ProjectUser',as: 'Responsables' });
models.Users.belongsToMany(models.Project, { through: 'ProjectUser' })
models.Notification.belongsToMany(models.Users, { through: 'UserNotifications', as: 'users' });

models.Users.belongsToMany(models.Notification, { through: 'UserNotifications' });

models.sequelize = sequelizeConnection;
models.Sequelize=Sequelize;

module.exports = {
  models,
  sequelizeConnection,
};