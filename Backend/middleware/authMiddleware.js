const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { models } = require("../models/index");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;
    console.log("Request Headers:", req.headers);
    console.log(req.cookies.jwt)
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            console.log(decoded)
            // Modification : Utilisation de l'ID utilisateur décodé pour récupérer l'utilisateur
            const user = await models.Users.findByPk(decoded.userId); // Utilisation de 'userId' au lieu de 'id'
            console.log(user);
            if (!user) {
                res.status(404);
                throw new Error('User not found');
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized,invalid token');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = protect;
