const { Schema, model } = require('mongoose')

const course = new Schema({
  title: {
    type: String,
    required: true
  },
  price: Number,
  img: String
})

module.exports = model('Course', course)
