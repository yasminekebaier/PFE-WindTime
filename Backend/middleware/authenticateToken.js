const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Accès non autorisé, token invalide' });
    }
    
    req.user = {
      id: decoded.userId,
      role: decoded.userRole
    };
    
    next();
  });
}

module.exports = authenticateToken;
