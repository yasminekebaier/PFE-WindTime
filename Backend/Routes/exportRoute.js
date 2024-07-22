const express = require ("express");
const exportRouter = express.Router();
const exportcontroller =require("../Controllers/ExportController");
exportRouter.get("/export", exportcontroller.exportTache)
exportRouter.get("/exportAll", exportcontroller.exportAllTache);

  exportRouter.get(
    "/exportTaskparprojectparuser/:ProjectId",
    exportcontroller.exportTacheByProjectByUser
  );
  exportRouter.get(
  "/exportTaskparproject/:ProjectId",
  exportcontroller.exportTacheByProject
);

module.exports=exportRouter  