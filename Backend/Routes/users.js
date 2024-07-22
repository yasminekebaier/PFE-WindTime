const express = require ("express");
const user_router = express.Router();
const multer = require('multer');
const protect =require('../middleware/authMiddleware')
const userController = require("../Controllers/UserController");
const authorize = require("../middleware/VerifyRole");
const exportcontroller =require("../Controllers/ExportController");
user_router.get("/users",userController.getUsers);
user_router.get("/Partners",userController.getAllPartners);
//update-user-profile
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads') 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) 
  }
});
const upload = multer({ storage: storage });
user_router.put("/updateUser/:userId",protect,upload.single('file'),userController.updateUserProfile
  );
  user_router.delete("/deleteUser/:id", userController.DeleteUser); 
  user_router.get("/userProfile/:userId",protect, userController.getUserProfile);
  user_router.post('/exportemployees', exportcontroller.exportEmployeesByIds);
  user_router.put("/updatePartner/:id", userController.updatePartnerProfile);


  
module.exports=user_router 