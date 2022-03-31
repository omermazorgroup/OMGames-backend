const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  now: {
    type: Boolean,
    default: false
  },
  turbo: {
    type:String
  },
  title: {
    type:String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    // required: true
  }
});

module.exports = mongoose.model('Post', postSchema);
