const mongoose = require('mongoose')

const rule = mongoose.Schema({
  created_at: { type: String },
  updated_at: { type: String },
  list: [
    {
      name: String,
      condition: String, // $gt大于; $gte 大于等于; $lt 小于; $lte 小于等于; $ne 不等于; $eq 等于
      notice_leven: Number
    }
  ]
})
// , { strict: false }
const Rule = mongoose.model('rule', rule)

module.exports = Rule
