const jwt = require("jsonwebtoken");
require("dotenv").config();
   const generateTokenForUser= (res,userId,userRole)=> {
    const accessToken =jwt.sign(
      {userId, userRole}
        ,process.env.ACCESS_TOKEN,
      {expiresIn: "30d"}
     
    )
        res.cookie('jwt',accessToken,{
          httpOnly:true,
          secure:process.env.NODE_ENV !=="development",
          samSite:'strict',
          maxAge:7* 24 * 60 * 60 *1000
        });
        

    };
    module.exports = generateTokenForUser;