const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateJWT, secret } = require('../middlewares/auth');

const router = express.Router();

// Register (for demo, no validation)
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  
  try {
    const user = new User({username: 'admin', passwordHash:'$2a$10$Rn0i/7tyQBnBFrVhHhCbpuQif1nESg88H.JfZrP0SqOGEl7YyWiE6', role:'admin'});
    await user.save();
    res.json({ message: 'User created' });
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if(!user) return res.status(400).json({ message: 'Invalid user' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, secret, { expiresIn: '1d' });
  res.json({ token });
});

router.post('/reg', async (res) => {
  // const { username, password } = req.body;
  const user = await User.create({username: 'admin', passwordHash:'$2a$10$Rn0i/7tyQBnBFrVhHhCbpuQif1nESg88H.JfZrP0SqOGEl7YyWiE6', role:'admin'});
  console.log(user);

  // bcrypt.hash();

});

router.get('/me', authenticateJWT, (req, res) => {
  res.json(req.user);

});

module.exports = router;