const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')
let db = mongoose.connection
db.on('error', function() {
  Console.log('mongodb连接失败')
})
db.on('open', function() {
  Console.log('mongodb连接成功')
})
