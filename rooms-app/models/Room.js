const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please add a room description'],
    },
    imageUrl: {
      type: String,
      default: 'https://www.genius100visions.com/wp-content/uploads/2017/09/placeholder-vertical.jpg',
      required: [true, 'Please add a image'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review"
    }]
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;