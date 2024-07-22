const express = require ("express");
const authrouter = express.Router();
const authcontroller = require("../Controllers/authController");
const authenticateToken = require('../middleware/authenticateToken')
authrouter.post(
    "/register",authenticateToken,
   authcontroller.register
  ); 
  authrouter.post(
    "/login",
    authcontroller.login
  ); 
  authrouter.get(
    "/refresh",
    authcontroller.refresh
  ); 
  authrouter.post(
    "/logout",
    authcontroller.logout
  ); 
  authrouter.post(
    "/forgot_password",
    authcontroller.forgot_password
  );
  authrouter.post(
    "/reset_password",
    authcontroller.reset_password
  );
  authrouter.post(
    "/SendEmail",
    authcontroller.SendComptetoNewUser
  );
  authrouter.post(
    "/registerPartner",
    authcontroller.registerPartner
  );
module.exports=authrouter