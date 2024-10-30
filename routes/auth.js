const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    const {
        userName,
        email,
        password,
        interests,
    } = req.body;
    const newUser =
        User({
            userName,
            email,
            password,
            interests
        });
    try {
        await newUser.save();
    } catch (error) {
      console.error(error);
      res.status(500).render('signup', { error: 'Something went wrong. Please try again.' });
    }
  });