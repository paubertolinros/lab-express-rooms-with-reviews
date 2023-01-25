const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL)
  .then(res => console.log(`Connected to the database ${res.connection.name}`))
  .catch(err => console.error(err))