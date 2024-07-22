
module.exports = (sequelize,Sequelize) => {
    const Leave= sequelize.define("Leave", {

          StartDate:{
            type:Sequelize.DATE,
            allowNull:true,
          },
          EndDate:{
            type:Sequelize.DATE,
            allowNull:true,
          },
         Description:{
          type:Sequelize.STRING,
          allowNull:true,
         },
         Reason:{
            type:Sequelize.STRING,
            allowNull:true,
          },
          Status: {
            type: Sequelize.STRING,
            defaultValue: 'pending'  
        },
        Type: {
          type: Sequelize.ENUM,
          values: ['Sick Leave', 'Regular Leave', 'Unpaid Leave', 'maternity leave', 'paternity leave'],
          allowNull: false
      }
      
    
        
    })
      Leave.Limits = {
        'Sick Leave':3,
        'Regular Leave': 21,
        'Unpaid Leave': 0,
        'maternity leave': 60,
        'paternity leave': 3
    };

    return Leave;
};