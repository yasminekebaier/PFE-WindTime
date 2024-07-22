
module.exports = (sequelize,Sequelize) => {
    const Tache = sequelize.define("Tache", {
       Title: {
            type: Sequelize.STRING,
            allowNull: true,},
          Description:{
            type:Sequelize.STRING,
            allowNull:true,
          },
          HoursNumber:{
            type: Sequelize.INTEGER,
            allowNull:false,
          }  
         
    });

    return Tache;
};