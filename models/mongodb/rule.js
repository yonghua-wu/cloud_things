const mongoose = require('mongoose')

const rule = mongoose.Schema({
  create_at: { type: String },
  update_at: { type: String }
}, { strict: false })
const Rule = mongoose.model('rule', rule)

module.exports = Rule
