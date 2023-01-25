const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();
const Room = require('../models/Room');
const roomData = require('../data/rooms');

mongoose.connect(process.env.MONGO_URL)
  .then(x => {
    console.log(`Connected to ${x.connection.name}`);
    return Room.deleteMany();
  })
  .then(() => {
    return Room.create(roomData);
  })
  .then(() => {
    mongoose.disconnect();
    //mongoose.connection.close
  })
  .catch((error) => {
    console.error('SEED Error connecting tot the database', error)
  });