const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  owner: {
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  link: {
    type: String,
    required: true,
    pattern: {
      params: /(http|https):\/\/([\w.]+\/?)\S*/,
      message: 'Должен начинаться с http, https и соответствовать спецификации URL, проверьте правильность формата',
    },
  },
  likes: [{
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
cardSchema.set('versionKey', false);

module.exports = mongoose.model('card', cardSchema);
