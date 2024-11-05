const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authRouter = require('./auth');
const verifyToken = require('../middleware/authMiddleware');

// const upload = multer({ dest: 'uploads/' });
const Event = require('../models/event'); 
const User = require('../models/user');
const { title } = require('process');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });



/* GET home page. */
router.get('/',verifyToken, async function(req, res, next) {
  console.log('Auth status:', res.locals.isAuthenticated); // Debug log
  if(!res.locals.isAuthenticated){
    res.render('landing',{title:'TechyVents'});
  } else{
  try {
    const events = await Event.find(); // Fetch all events from the database
    events.forEach(event =>{
      event.descriptionPreview = event.description.substring(0,150);
      event.description =event.description;
    })
    res.render('index', { events, title: 'Techyvents', userId: res.locals.userId });
} catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Internal Server Error");
}}
});

router.get('/aboutUs', function(req, res, next) {
  res.render('aboutUs', { title: 'Techyvents' });
});

router.get('/faq', function(req, res, next) {
  res.render('faq', { title: 'Techyvents' });
});

router.use('/auth', authRouter);
router.get('/create-event',verifyToken, function(req, res, next) {
  res.render('createEvent',{title:'Create Event'});
});

router.post('/create-event',verifyToken, upload.single('image'), async (req, res) => {
  const { title, description, category, startdateTime, enddateTime, address, venue, eventMode, pricing, registrationLink, organizer, keywords } = req.body;
  
  let imageUrl = req.file ? req.file.path : null;
  let keywordArray = keywords.split(',').map(kw => kw.trim());  // Convert keywords to array
  
  const newEvent = new Event({
      title,
      description,
      category,
      startdateTime,
      enddateTime,
      address,
      venue,
      image:imageUrl,
      eventMode,
      pricing,
      ticketPrice: pricing === 'paid' ? req.body.ticketPrice : null, // Set ticketPrice only if pricing is 'paid'
      registrationLink,
      organizer,
      keywords: keywordArray,
  });

  newEvent.save()
      .then(() => {
          console.log("Successfully added to db");
          res.redirect('/');  // Redirect to homepage after successful event creation
      })
      .catch(err => {
          console.error(err);
          res.redirect('/create-event');  // Reload form on error
      });
});


// router.get('/find-events', function(req, res, next) {
//   res.render('findEvents',{title:"Find Events"});
// });


  // const dummyEvents = [
  //     {
  //         title: "AI Conference 2024",
  //         description: "A deep dive into the latest AI trends and technologies.",
  //         category: "AI/ML",
  //         startdateTime: new Date('2024-11-12T09:00:00'),
  //         enddateTime: new Date('2024-11-12T17:00:00'),
  //         address: "123 AI St, Tech City",
  //         venue: "Tech Conference Hall",
  //         imageUrl: "https://via.placeholder.com/400x200",
  //         eventMode: "on-site",
  //         pricing: "paid",
  //         ticketPrice: 100,
  //         registrationLink: "https://example.com/ai-conference-2024",
  //         organizer: "Tech Innovators",
  //         keywords: ["AI", "Machine Learning", "Conference"]
  //     },
  //     {
  //         title: "Web Dev Bootcamp",
  //         description: "Learn the fundamentals of web development in this intensive bootcamp.",
  //         category: "Web Development",
  //         startdateTime: new Date('2024-11-20T10:00:00'),
  //         enddateTime: new Date('2024-11-20T18:00:00'),
  //         address: "456 Code Blvd, Dev City",
  //         venue: "Dev Workshop Center",
  //         imageUrl: "https://via.placeholder.com/400x200",
  //         eventMode: "on-site",
  //         pricing: "free",
  //         registrationLink: "https://example.com/web-dev-bootcamp",
  //         organizer: "Dev Masters",
  //         keywords: ["Web Development", "HTML", "CSS", "JavaScript"]
  //     },
  //     {
  //         title: "Cloud Computing Webinar",
  //         description: "An online webinar exploring cloud computing technologies.",
  //         category: "Cloud",
  //         startdateTime: new Date('2024-12-01T14:00:00'),
  //         enddateTime: new Date('2024-12-01T16:00:00'),
  //         address: "Online",
  //         venue: "Zoom Webinar",
  //         imageUrl: "https://via.placeholder.com/400x200",
  //         eventMode: "online",
  //         pricing: "free",
  //         registrationLink: "https://example.com/cloud-computing-webinar",
  //         organizer: "Cloud Gurus",
  //         keywords: ["Cloud", "AWS", "Azure", "GCP"]
  //     }
  // ];
  
  // res.render('findEvents', { events: dummyEvents, title:'Find Events'});


router.get('/find-events', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events from the database
        res.render('findEvents', { events, title: 'Find Events' });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId); // Fetch event from the database
    if (!event) {
      return res.status(404).send('Event not found');
    }
    res.render('eventDetails', { event }); // Render the event details page
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.get('/my-events', verifyToken, async (req, res) => {
  try {
    // Fetch the authenticated user
    const user = await User.findById(res.locals.userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Fetch the bookmarked events from the database
    const bookmarkedEvents = await Event.find({ _id: { $in: user.bookmarkedEvents } });

    res.render('my-events', {
      title: 'My Bookmarked Events',
      bookmarkedEvents,
      userId: res.locals.userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching bookmarked events');
  }
});

router.post('/api/bookmark', verifyToken, async (req, res) => {
  const { eventId, isBookmarked } = req.body;
  const userId = res.locals.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isBookmarked) {
      user.bookmarkedEvents.push(eventId);
    } else {
      user.bookmarkedEvents = user.bookmarkedEvents.filter(id => id !== eventId);
    }

    await user.save();
    res.json({ success: true, bookmarkedEvents: user.bookmarkedEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error saving bookmark' });
  }
});
module.exports = router;
