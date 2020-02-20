const mongoose = require('mongoose')

const detail = mongoose.Schema({
  created_at: { type: String },
  updated_at: { type: String },
  connected: { type: Boolean, default: false}
}, { strict: false })
const Detail = mongoose.model('detail', detail)

module.exports = Detail
