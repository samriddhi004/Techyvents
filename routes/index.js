var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Techyvents' });
});

router.get('/create-event', function(req, res, next) {
  res.render('createEvent');
});

router.post('/create-event',upload.single('image'),async (req,res)=>{
  const imageUrl= req.file ? `/uploads/${req.file.filename}`:req.body.imageUrl;
  try{
    const {
      title, description, startdateTime, enddateTime,
      address, venue, imageUrl, eventMode, category,
      registrationLink, organizer, keywords, pricing,
      ticketPrice
  } = req.body;

  const newEvent = new Event({
    title,
    description,
    startdateTime: new Date(startdateTime),
    enddateTime: new Date(enddateTime),
    address,
    venue,
    imageUrl,
    eventMode,
    category,
    registrationLink,
    organizer,
    keywords: keywords.split(',').map(keyword => keyword.trim()), // Convert string to array
    pricing,
    ticketPrice: pricing === 'paid' ? ticketPrice : undefined
});
await newEvent.save();
res.redirect('/');
  } catch(error){
  console.error(error);
  res.status(500).send('Error creating the event.');
  }
});

module.exports = router;
