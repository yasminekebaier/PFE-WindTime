const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { models } = require("../models/index");

const authorize = (requiredRole) => asyncHandler(async (req, res, next) => {
  
    const token = req.cookies.jwt;
console.log(token)
  
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
        const user = await models.Users.findByPk(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (decoded.userRole !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.userId = decoded.userId;
        req.role = decoded.userRole;
        console.log()
         
        next();
    } catch (error) {
        return res.status(403).json({ message: 'err' });
    }
});

module.exports = authorize;
