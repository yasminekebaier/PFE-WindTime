const express = require ("express");
const calendrierRouter = express.Router();
const calendrierController= require ("../Controllers/calendrierController")
const authenticateToken = require('../middleware/authenticateToken')
calendrierRouter.post(
    "/createCalendrier",authenticateToken,
    calendrierController.createEvent
  );
calendrierRouter.get("/Events",authenticateToken,calendrierController.getAllEvents);
calendrierRouter.delete(
  "/deleteEvent/:id",
 calendrierController.deleteEvent
);
calendrierRouter.put("/updateEvent/:id",  calendrierController.updateEvent);

module.exports = calendrierRouter;