const { models } = require("../models/index");
const bcrypt = require('bcrypt');
const path = require('path');

const getUsers = async (req, res) => {
  try {
    const { partner_id } = req.query;

    if (!partner_id) {
      return res.status(400).json({ error: "Partner ID is required" });
    }
    const users = await models.Users.findAll({
      where: {
        isDeleted: false,
        partner_id: partner_id
      }
    });

    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Error retrieving users" });
  }
}
//delete User
  const DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await models.Users.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User inexistant" });
      }
      await user.update({ isDeleted: true });
      res.json({ message: "User marqué comme supprimé" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
}
//getuserprofile
  const getUserProfile = async (req, res) => {
    try {
      const {userId} = req.params;
   const user = await models.Users.findOne({
        attributes: ["id","nom", "prenom", "email", "password", "role","picture", "numTel","DateNaissance",
        "adresse",
        "Domaine"],
        where: {id:userId },
      });
  
      if (!user) {
        console.log(error);
        return res.status(404).json({ error: "user not found" });
      }
  
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: "cannot fetch user" });
    }
  }
 //update user 
  const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const { nom, prenom, email, password, numTel, adresse, Domaine,DateNaissance } = req.body;
        const user = await models.Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        let picture = user.picture;
        if (req.file && req.file.path) {
            const fileName = path.basename(req.file.path);
            picture = fileName;
        }

        const updatedUser = await user.update({
            nom, prenom, email, password, picture, numTel, adresse, Domaine,DateNaissance
        });

        return res.status(200).json(updatedUser);

    } catch (error) {
        return res.status(500).json({ error: "Cannot update user profile" });
    }
}
const getAllPartners = async (req, res) => {
  try {
    const partners = await models.Users.findAll({
      where: {
        role: 'Partner',
        isDeleted: false
      }
    });

    res.json(partners);
  } catch (error) {
    console.error("Error retrieving partners:", error);
    res.status(500).json({ error: "Error retrieving partners" });
  }
}
const updatePartnerProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const { email, numTel, adresse } = req.body;
    const partner = await models.Users.findByPk(id);
    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    const updatedPartner = await partner.update({
      email, numTel, adresse
    });

    return res.status(200).json(updatedPartner);
  } catch (error) {
    return res.status(500).json({ error: "Cannot update partner profile" });
  }
};

  

module.exports = {
    getUsers,
    updateUserProfile,
    getUserProfile,
    DeleteUser,
    getAllPartners,
    updatePartnerProfile
  };