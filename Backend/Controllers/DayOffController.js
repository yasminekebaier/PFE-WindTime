const { models } = require("../models/index");
const { Op } = require('sequelize');

async function createDayOff(req, res) {
  const { EndDate, StartDate, Description, Type, UserId } = req.body;
  
  try {
      const DayOffRequest = await models.Leave.create({ EndDate, StartDate,Description, Type, UserId });
      
      res.status(200).json({
          success: true,
          message: 'DayOffRequest Created successfully',
          DayOffRequest,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Failed to create DayOffRequest',
          error: error.message,
      });
  }
}

const getAllDayOff = async (req, res) => {
  try {
    const partnerId = req.user.id; // Récupérer l'ID du partenaire connecté
    console.log(`Partner ID: ${partnerId}`);

    // Récupérer les employés associés à ce partenaire
    const associatedUsers = await models.Users.findAll({
      where: { partner_id: partnerId },
      attributes: ['id']
    });

    console.log(`Associated Users: ${JSON.stringify(associatedUsers)}`);

    const associatedUserIds = associatedUsers.map(user => user.id);

    // Ajouter l'ID du partenaire connecté aux IDs des utilisateurs associés
    associatedUserIds.push(partnerId);

    if (associatedUserIds.length === 0) {
      console.log('No associated users found');
      return res.status(404).json({ error: "No associated users found" });
    }

    console.log(`Associated User IDs: ${JSON.stringify(associatedUserIds)}`);

    // Récupérer les demandes de congé pour ces employés (y compris le partenaire)
    const dayOffs = await models.Leave.findAll({
      where: {
        userId: {
          [Op.in]: associatedUserIds
        }
      },
      include: [{
        model: models.Users,
        attributes: ['nom'] // Inclure le nom de l'utilisateur dans les résultats
      }]
    });

    console.log(`Day Offs: ${JSON.stringify(dayOffs)}`);

    const limits = models.Leave.Limits;

    const formattedDayOffs = dayOffs.map(dayOff => ({
      ...dayOff.dataValues,
      limit: limits[dayOff.Type],
      userName: dayOff.User.nom // Ajouter le nom de l'utilisateur au formatage
    }));

    res.status(200).json({
      dayOffs: formattedDayOffs,
      limits: limits
    });
  } catch (error) {
    console.error("Error retrieving DayOff:", error);
    res.status(500).json({ error: "Error retrieving DayOff" });
  }
};

/* const updateDayOff = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status, Reason } = req.body; 
    const Leave = await models.Leave.findByPk(id);

    if (!Leave) {
      return res.status(404).json({ message: "DayOff not found." });
    }

    if (Leave.Status === 'pending') {
      Leave.Status = Status;
      Leave.Reason = Reason; 
      await Leave.save();

      res.status(200).json({
        success: true,
        message: "DayOff status updated successfully",
        Leave: Leave,
      });
    } else {
      res.status(400).json({ message: "Cannot update DayOff status. Status is not pending." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating DayOff status" });
  }
}; */
const updateDayOff = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status, Reason } = req.body; 
    const Leave = await models.Leave.findByPk(id);

    if (!Leave) {
      return res.status(404).json({ message: "DayOff not found." });
    }

    if (Leave.Status === 'pending') {
      Leave.Status = Status;
      Leave.Reason = Reason; 
      await Leave.save();

      // Envoi de la notification à l'employé concerné
      const employee = await models.Users.findByPk(Leave.UserId);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }
      
      const notification = await models.Notification.create({
        Status: 'unread',
        Description: 'Votre demande de congé a été mise à jour '
      });
      await models.UserNotifications.create({
        UserId: employee.id,
        NotificationId: notification.id
      })
      const io = req.app.get('io');
      // Émettez un événement websocket pour l'employé
      io.to(employee.id).emit('notification', { message: 'Une nouvelle notification' });

      res.status(200).json({
        success: true,
        message: "DayOff status updated successfully",
        Leave: Leave,
      });
    } else {
      res.status(400).json({ message: "Cannot update DayOff status. Status is not pending." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating DayOff status" });
  }
};
const TypeLimitconfig=async(req,res)=>{
  const { type } = req.params;
  const { limit } = req.body;

  if (!Leave.Limits.hasOwnProperty(type)) {
      return res.status(400).json({ error: 'Invalid leave type' });
  }

  Leave.Limits[type] = limit;

  res.json({ success: true, message: 'Leave limit updated successfully', limits: Leave.Limits });
}

module.exports = {
    createDayOff,
    getAllDayOff,
    updateDayOff,
    TypeLimitconfig };