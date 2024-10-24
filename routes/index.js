var express = require('express');
var router = express.Router();
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const Event = require('./models/event'); 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Folder where images will be saved
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Techyvents' });
});

router.get('/create-event', function(req, res, next) {
  res.render('createEvent');
});

router.post('/create-event',upload.single('image'),async (req,res)=>{
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
        imageUrl,
        eventMode,
        pricing,
        ticketPrice: req.body.ticketPrice || null,// Set ticketPrice only if pricing is 'paid'
        registrationLink,
        organizer,
        keywords: keywordArray,

    });

    newEvent.save()
        .then(() => res.redirect('/'))  // Redirect to homepage after successful event creation
        .catch(err => {
            console.error(err);
            res.redirect('/create-event');  // Reload form on error
        });
});

router.get('/find-events', function(req, res, next) {
  res.render('findEvents');
});

module.exports = router;
