const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');
const loggedIn = require('../middlewares');


/* GET all Rooms view */
/* ROUTE rooms/ */
router.get('/', async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const allRooms = await Room.find({}).populate('owner');
    console.log(allRooms)
    res.render('rooms/rooms', { user, allRooms })
    
  } catch (error) {
    next(error)
  }
});

/* GET create new Room view */
/* ROUTE rooms/create */
router.get('/create', loggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('rooms/createRoom', { user }) 
});

/* POST form new Room data */
/* ROUTE rooms/create */
router.post('/create', loggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { name, description, imageUrl } = req.body;
  try {
    const newRoom = await Room.create({name, description, imageUrl, owner: user})
    res.redirect('/rooms')
  } catch (error) {
    next(error)
  }
});

/* get edit Room */
/* ROUTE rooms/edit/:roomId */
router.get('/edit/:roomId', loggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  console.log(user)
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId).populate('owner');
    console.log(`This is room owner Id: ${room.owner._id}`)
    console.log(`This is current User Id: ${user._id}`)
    if (room.owner._id == user._id) {
      res.render('rooms/editRoom', {room, user})
    } else {
      res.redirect('/rooms')
      //res.render('rooms/rooms', {error: 'You are not allow to edit'})
    }
  } catch (error) {
    next(error)
  }
});


/* POST edit Room */
/* ROUTE rooms/edit/:roomId */
router.post('/edit/:roomId', loggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { roomId } = req.params;
  const { name, description, imageUrl } = req.body;
  try {
    const editRoom = await Room.findByIdAndUpdate(roomId, { name, description, imageUrl, owner: user }, {new:true})
    res.redirect('/rooms')
  } catch (error) {
    next(error)
  }
});

/* GET delete Room */
/* ROUTE rooms/delete/:roomId */
router.get('/delete/:roomId', loggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId).populate('owner');
    if (room.owner._id == user._id) {
      await Room.findByIdAndRemove(roomId);
      res.redirect('/rooms')
    } else {
      res.redirect('/rooms')
      //res.render('rooms/rooms', {error: 'You are not allow to edit'})
    }
  } catch (error) {
    next(error)
  }
});


module.exports = router;