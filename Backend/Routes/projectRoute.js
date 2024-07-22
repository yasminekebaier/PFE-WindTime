const express = require ("express");
const projectRouter = express.Router();
const protect =require('../middleware/authMiddleware')
const authorize = require("../middleware/VerifyRole");
const ProjectController= require("../Controllers/ProjectController")
const authenticateToken = require('../middleware/authenticateToken')
projectRouter.post(
    "/createproject",authenticateToken,ProjectController.createProject)
    projectRouter.get("/projects",authenticateToken,ProjectController.getAllProjects)
  projectRouter.delete("/deleteproject/:id",ProjectController.deleteProject)
  module.exports =  projectRouter ;