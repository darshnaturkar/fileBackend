const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = 'darshnaTurkar10112025';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.sendStatus(401);
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, secret, (err, user) => {
    if(err) return res.status(200).json({error: 'token expired'});
    req.user = User;
    next();
  });
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if(!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authenticateJWT, authorizeRoles, secret };