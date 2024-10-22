const express = require('express');
const Notification = require('../models/notificationModel');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Create Notification
router.post('/notification', authenticateToken, async (req, res) => {
  const { postId } = req.body;
  const notification = new Notification({ user: req.user.userId, post: postId });
  await notification.save();
  res.status(201).send(notification);
});

// Get notifications
router.get('/notification', authenticateToken, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.userId }).populate('post');
  res.send(notifications);
});

module.exports = router;
