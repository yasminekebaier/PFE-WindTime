module.exports = (sequelize, Sequelize) => {
    const Calendrier = sequelize.define("Calendrier", {
        Titre: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        HeureDebut: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        HeureFin: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        Description:{
          type: Sequelize.STRING,
          allowNull: true,
        },
        Type: {
          type: Sequelize.ENUM,
          values: ['Anniversaire', 'Réunion', 'Event','others'],
          allowNull: false,
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
     Calendrier.associate = models => {
      Calendrier.belongsTo(models.Users, { foreignKey: 'partner_id', as: 'partner' }) 
     } 
      
    
      return Calendrier;
    };
    
