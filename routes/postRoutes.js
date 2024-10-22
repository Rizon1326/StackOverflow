const express = require('express');
const Post = require('../models/postModel');
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

// Create Post
router.post('/post', authenticateToken, async (req, res) => {
  const { content } = req.body;
  const post = new Post({ user: req.user.userId, content });
  await post.save();
  res.status(201).send(post);
});

// Get posts of other users
router.get('/post', authenticateToken, async (req, res) => {
  const posts = await Post.find({ user: { $ne: req.user.userId } }).populate('user');
  res.send(posts);
});

module.exports = router;
