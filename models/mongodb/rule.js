const mongoose = require('mongoose')

const rule = mongoose.Schema({
  created_at: { type: String },
  updated_at: { type: String }
}, { strict: false })
const Rule = mongoose.model('rule', rule)

module.exports = Rule
