module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("Users", {
      nom: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      prenom: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          required: true,
          unique: true,
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false,
          required: true,
      },
      role: {
          type: Sequelize.ENUM("admin", "Partner", "employee", "RessourceHumaine"),
          allowNull: false,
          defaultValue: "employee",
      },
      picture: {
          type: Sequelize.STRING,
      },
      numTel: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      DateNaissance: {
          type: Sequelize.DATE,
          allowNull: true,
      },
      adresse: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      Domaine: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      DateContrat: {
          type: Sequelize.DATE,
          allowNull: true,
      },
      PasswordReset: {
          type: Sequelize.STRING,
          unique: Sequelize.STRING,
          createdAt: Sequelize.STRING,
          expiredAt: Sequelize.STRING,
      },
      isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
      },
      CompanyName: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      partner_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
              model: 'Users', 
              key: 'id',
          }
      }
  });

  Users.associate = function(models) {
    Users.hasMany(models.Users, { foreignKey: 'partner_id', as: 'employees' });
    Users.belongsTo(models.Users, { foreignKey: 'partner_id', as: 'partner' });
    Users.belongsToMany(models.Project, { through: 'ProjectUser', as: 'Responsables', foreignKey: 'userId' });
  };

  return Users;
};
