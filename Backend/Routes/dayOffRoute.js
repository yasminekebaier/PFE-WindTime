const express = require ("express");
const DayOffRouter = express.Router();
const protect =require('../middleware/authMiddleware')
const authorize = require("../middleware/VerifyRole");
const DayOffController= require("../Controllers/DayOffController");
const authenticateToken = require('../middleware/authenticateToken')
DayOffRouter.post(
    "/createDayOff",DayOffController.createDayOff);
    DayOffRouter.get("/DayOffs",authenticateToken,DayOffController.getAllDayOff);
    DayOffRouter.put("/UpdateDayOff/:id",DayOffController.updateDayOff );
    DayOffRouter.put("/TypeConfig/:type",DayOffController.TypeLimitconfig );


module.exports =  DayOffRouter ;