const { models } = require("../models/index")
const bcrypt =require('bcrypt')
const jwt = require ('jsonwebtoken')
const jwtUtils = require("../utils/jwt")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")
const { v4: uuidv4 } = require('uuid')
const generateTokenForUser = require("../utils/jwt")

const authcontroller = {
  register: async (req, res) => {
    try {
      const { nom, prenom, password, email, role, Domaine, numTel, DateNaissance, picture } = req.body;
      const partnerId = req.user.id; // ID de l'utilisateur connecté
  
      const userFound = await models.Users.findOne({ where: { email } });
      if (userFound) {
        return res.status(409).json({ error: "User already exists" });
      }
  
      const newPassword = password || crypto.randomBytes(4).toString('hex');
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
      const user = await models.Users.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
        Domaine,
        numTel,
        DateNaissance,
        picture,
        partner_id: partnerId
      });
  
      const htmlMessage = `<h2>Hello ${prenom} ${nom}</h2>
        <p>Welcome To WindTime. This is your email and password to login to our application:</p>
        <p>Email: ${email}</p>
        <p>Password: ${newPassword}</p>`;
      const subject = "New Account";
  
      const emailResult = await sendEmail(email, htmlMessage, subject);
      if (emailResult) {
        console.log("Email sent successfully.");
        res.status(200).json({ success: true, message: "User registered successfully. Email sent successfully." });
      } else {
        console.log("Failed to send email.");
        res.status(500).json({ success: false, message: "Failed to send email." });
      }
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },

  
      login: async (req, res, next) => {
        const { email, password,Domaine ,DateNaissance,picture,partner_id } = req.body;
        try {
            const user = await models.Users.findOne({ where: { email: email } });
            if (!user) {
                return res.status(404).json("User not found");
            }
            
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json("Wrong password");
            }
            
           const token= generateTokenForUser(res,user.id,user.role);
             // Pass user.id to generateTokenForUser
              return res.status(200).json({
                accessToken:token,
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role:user.role,
                Domaine:user.Domaine,
                picture:user.picture,
                DateNaissance:user.DateNaissance,
                partner_id:user.partner_id
            }); 
        } catch (err) {
            console.error(err);
            return res.status(500).json({ err: "Cannot log in user" });
        }
    },
    
    refresh: async (req, res) => {
      const cookies = req.cookies;
      if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const refreshtoken = cookies.jwt;
      try {
        // Vérifiez le jeton de rafraîchissement
        const decoded = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN);
        // Générez un nouveau jeton d'accès
        const accessToken = jwt.sign(
          { userId: decoded.userId }, // Remplacez userId par la valeur appropriée
          process.env.ACCESS_TOKEN,
          { expiresIn: '50min' }
        );
        res.json({ accessToken });
      } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Erreur lors de la génération du jeton d\'accès' });
      }
    },
    
    logout:async(req ,res)=>{
      res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0),
      })
res.status(200).json({message:'Logout User'})
    },
    
  //Forget Password
  forgot_password: async (req, res) => {
    const { email } = req.body;
    console.log("Email received:", email); 
    const user = await models.Users.findOne({ where: { email: email } });
    console.log("User found:", user);
    if (!user) {
        return res.status(404).json({ error: "User with email does not exist" });
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN,
        { expiresIn: "30d" }
    );
    user.resetToken = token;
    await user.update({ PasswordReset: token });

    const redirectUrl = `http://localhost:3000/reset-password/${user.id}/${token}`;
    // Send EMAIL
    const htmlMessage = `<h2>Hello ${user.nom}</h2>
      <p>Please use the URL below to reset your password:</p>
      <a href="${redirectUrl}">${redirectUrl}</a>
      <p>Regards...</p>`;
    const subject = "Reset Password";
    const emailSent = await sendEmail(user.email, htmlMessage, subject);
    if (emailSent) {
        console.log("Email sent successfully.");
        return res.status(200).json({ success: true, message: "Reset Email Sent successfully" });
    } else {
        console.log("Failed to send email.");
        return res.status(500).json({ success: false, message: "Failed to send reset email" });
    }
},

reset_password: async (req, res) => {
  try {
    const { id, newPassword, token } = req.body;

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    } catch (error) {
        return res.status(400).json({ error: "Invalid token" });
    }

    if (decoded.id !== parseInt(id)) {
        return res.status(400).json({ error: "Invalid token" });
    }

    const user = await models.Users.findOne({ where: { id } });
    if (!user) {
        console.log("User not found");
        return res.status(404).json({ error: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Updating password for user:", user.email);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password reset successful" });
} catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "An error occurred" });
}
},


 SendComptetoNewUser : async (req, res) => {
  const { email, password, nom, prenom } = req.body;
  //Send EMAIL
  const htmlMessage = `<h2>Hello ${prenom} ${nom}</h2>
      <p>Welcome To WindTime. This is your email and password to login to our application:</p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>`;
      const subject ="New Compte "
  
      try {
        const emailResult = await sendEmail(email, htmlMessage,subject);
        if (emailResult) {
            console.log("Email sent successfully.");
            res.status(200).json({ success: true, message: "Email sent successfully." });
        } else {
            console.log("Failed to send email.");
            res.status(500).json({ success: false, message: "Failed to send email." });
        }
    } catch (error) {
        console.error("Error in SendComptetoNewUser:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
},
//Partner register
 registerPartner : async (req, res) => {
  try {
    const { password, email, picture,CompanyName,numTel,adresse } = req.body;
    const userFound = await models.Users.findOne({ where: { email } });
    if (userFound) {
      return res.status(409).json({ error: "User already exists" });
    }
    const newPassword = password || crypto.randomBytes(4).toString('hex');
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const partner = await models.Users.create({
      email,
      password: hashedPassword,
      role: 'Partner',
      picture,
      CompanyName,
      numTel,
      adresse
    });

    const htmlMessage = `<h2>Hello ${CompanyName}</h2>
      <p>Welcome To WindTime. This is your email and password to login to our application:</p>
      <p>Email: ${email}</p>
      <p>Password: ${newPassword}</p>`;
    const subject = "New Account";

    const emailResult = await sendEmail(email, htmlMessage, subject);
    if (emailResult) {
      console.log("Email sent successfully.");
      res.status(200).json({ success: true, message: "User registered successfully. Email sent successfully." });
    } else {
      console.log("Failed to send email.");
      res.status(500).json({ success: false, message: "Failed to send email." });
    }
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}
}

module.exports =authcontroller;