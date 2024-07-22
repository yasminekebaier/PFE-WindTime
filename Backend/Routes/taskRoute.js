const express = require ("express");
const TaskRouter = express.Router();
const protect =require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const TaskController= require("../Controllers/TaskController");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads') 
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+ path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

TaskRouter.post(
    "/createTask",TaskController.createTask);
    TaskRouter.get("/Tasks",TaskController.getAllTaches);
    TaskRouter.post("/import", upload.single('file'),TaskController.ImportTask); 
    TaskRouter.delete("/deleteTask/:id" ,TaskController.deleteTache);
    TaskRouter.put("/updateTask/:taskId" ,TaskController.updateTask);
    module.exports = TaskRouter;