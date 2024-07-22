
const { models } = require("../models/index")
const dayjs = require('dayjs');


//creation de l'evenement 
let onlineUsers = []
const addNewUser =(nom,socketId) =>{
  !onlineUsers.some((user) => user.nom === nom)&&
  onlineUsers.push({nom,socketId})
}
const removeUser =(socketId) =>{
  onlineUsers = onlineUsers.filter((user)=> user.socketId !== socketId)
}
const getUser =(nom) =>{
  return onlineUsers.find((user)=>user.nom ===nom)
}
const createEvent = async (req, res) => {
  try {
    const partnerId = req.user.id; // Récupérer l'ID du partenaire connecté
    const event = await models.Calendrier.create({
      Titre: req.body.Titre,
      HeureDebut: req.body.HeureDebut,
      HeureFin: req.body.HeureFin,
      Description: req.body.Description,
      Type: req.body.Type,
      partner_id: partnerId 
    });
    
    const userIds = req.body.utilisateurs.map(id => parseInt(id));
    await event.addUtilisateurs(userIds);

    const io = req.app.get('io');
    io.emit('newEvent', `Un nouvel événement a été ajouté: ${req.body.Titre}`);

    const formattedStart = dayjs(req.body.HeureDebut).format('YYYY-MM-DD (HH:mm)');
    const formattedEnd = dayjs(req.body.HeureFin).format('YYYY-MM-DD (HH:mm)');

    const notification = await models.Notification.create({
      Description: `${req.body.Titre} a été ajouté: De ${formattedStart} à ${formattedEnd}`,
      Status: 'unread'
    });

    await notification.addUsers(userIds);

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating event" });
  }
};
const { Op } = require('sequelize');

const getAllEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let events = [];

    if (userRole === 'Partner') {
      // Récupérer les IDs des utilisateurs associés au partenaire
      const associatedUsers = await models.Users.findAll({
        where: { partner_id: userId },
        attributes: ['id']
      });

      const associatedUserIds = associatedUsers.map(user => user.id);
      console.log('associatedUserIds:', associatedUserIds); // Ajouter un log pour vérifier les IDs associés

      if (associatedUserIds.length > 0) {
        // Récupérer les événements créés par le partenaire ou liés aux utilisateurs associés
        events = await models.Calendrier.findAll({
          where: {
            [Op.or]: [
              { partner_id: userId },
              { '$Utilisateurs.id$': { [Op.in]: associatedUserIds } }
            ]
          },
          include: [{
            model: models.Users,
            as: 'Utilisateurs',
            attributes: ['nom'],
            through: { attributes: [] }
          }]
        });
      } else {
        // Si aucun utilisateur associé, ne récupérer que les événements créés par le partenaire
        events = await models.Calendrier.findAll({
          where: { partner_id: userId },
          include: [{
            model: models.Users,
            as: 'Utilisateurs',
            attributes: ['nom'],
            through: { attributes: [] }
          }]
        });
      }

    } else if (userRole === 'employee') {
      // Récupérer les événements liés à l'employé connecté
      events = await models.Calendrier.findAll({
        include: [{
          model: models.Users,
          as: 'Utilisateurs',
          where: { id: userId },
          attributes: ['nom'],
          through: { attributes: [] }
        }]
      });
    }

    const formattedEvents = events.map(event => ({
      id: event.id,
      Titre: event.Titre,
      HeureDebut: event.HeureDebut,
      HeureFin: event.HeureFin,
      Description: event.Description,
      Type: event.Type, // Ajout du Type dans la réponse
      Utilisateurs: event.Utilisateurs.map(user => user.nom).join(', ')
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving events" });
  }
};




 const  updateEvent = async (req, res) => {       
    try {
            const {Titre, HeureDebut, HeureFin,Description} = req.body;
            const { id } = req.params;
        
            const event = await models.Calendrier.findByPk(id);
        
            if (!event) {
              return res.status(404).json({ message: "event not found." });
            }
            await event.update({
              Titre:Titre,
              HeureDebut:HeureDebut,
              HeureFin:HeureFin,
              Description:Description,
            })
        
        
            res.status(200).json(event);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error updating event." });
          }
}
        const deleteEvent = async (req, res) => {
          try {
            const { id } = req.params;
        
            const event = await models.Calendrier.findByPk(id);
        
            if (!event) {
              return res.status(404).json({ message: "event not found." });
            }
        
            await event.destroy();
        
            res.status(200).json({ message: "event deleted successfully." });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error deleting event." });
          }
        }
      
module.exports = {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent
};