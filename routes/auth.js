const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt'); //hashes when saving and verifies when logging
const jwt = require('jsonwebtoken'); //create tokens for authenticated sessions


router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Sign Up' });
  });
router.post('/auth/signup', async (req, res) => {
    try {
    const {
        username,
        email,
        password,
        interests,
    } = req.body;
    console.log('Received form data:', { username, email, password, interests });
    if (!username || !email || !password) {
        return res.status(400).render('signup', { 
          error: 'Please fill in all required fields', 
          title: 'Sign Up' 
        });
      }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser =
        new User({
            username,
            email,
            password: hashedPassword,
            interests
        });
    await newUser.save();
    // res.status(201).json({ message: 'User registered successfully' });
    res.redirect('/login');
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).render('signup', { 
          error: 'Registration failed: ' + error.message, 
          title: 'Sign Up' 
        });
      }
    });


  router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Log In' });
  });
  router.post('/login',async (req,res)=>{
    try{
        const {
            email,
            password,
        } = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId :user._id}, process.env.JWT_SECRET,{
            expiresIn:'11h',
        });
        console.log('Setting token:', token);
        res.cookie('token', token, { httpOnly: true, maxAge: 11 * 60 * 60 * 1000 }); // 11 hours
        res.redirect('/');
    } catch(error){
        res.status(500).json({ error: 'Login failed' });
    }
  })


  router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
  });
  module.exports = router;