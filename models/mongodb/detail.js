const mongoose = require('mongoose')

const detail = mongoose.Schema({
  create_at: { type: String },
  update_at: { type: String },
  connected: { type: Boolean, default: false}
}, { strict: false })
const Detail = mongoose.model('detail', detail)

module.exports = Detail
