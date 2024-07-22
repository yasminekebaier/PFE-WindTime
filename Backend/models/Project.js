module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("Project", {
     Name: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      Description: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
      },
      partner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id',
        }
     } 
    });
  
    Project.associate = function(models) {
      Project.belongsTo(models.Users, { foreignKey: 'partner_id', as: 'partner' });
      Project.belongsToMany(models.Users, { through: 'ProjectUser', as: 'Responsables', foreignKey: 'projectId' });
    };
  
    return Project;
  };