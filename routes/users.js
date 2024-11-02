const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust path as needed

router.get('/profile', async (req, res) => {
  try {
    if (!res.locals.isAuthenticated) {
      return res.redirect('/login');
    }

    // Fetch user data from database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Render profile page with user data
    res.render('profile', { title: "Your Profile", user });
  } catch (error) {
    console.error('Profile page error:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;