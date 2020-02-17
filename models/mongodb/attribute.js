const mongoose = require('mongoose')

const attribute = mongoose.Schema({
  create_at: { type: String },
  update_at: { type: String },
  list: [{
    name: String,
    view_name: String,
    value_type: String,
    default_value: Number,
    unit: String
  }]
})
const Attribute = mongoose.model('attribute', attribute)

module.exports = Attribute
