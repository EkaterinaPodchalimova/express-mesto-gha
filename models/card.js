const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: []
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }

});
cardSchema.set('versionKey', false);

module.exports = mongoose.model('card', cardSchema);
