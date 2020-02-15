const CONFIG = require('../config/config')
const Router = require('koa-router')
const routers = new Router({
  prefix: CONFIG.SERVER_PREFIX,
})

const IotModel = require('../controllers/IotModel')
routers.get('/models', IotModel.list)
routers.get('/models/:id', IotModel.details)
routers.post('/models', IotModel.create)
routers.patch('/models/:id', IotModel.update)
routers.delete('/models/:id', IotModel.del)

const IotDevice = require('../controllers/IotDevice')
routers.get('/devices', IotDevice.list)
routers.get('/devices/:id', IotDevice.details)
routers.post('/devices', IotDevice.create)
routers.patch('/devices/:id', IotDevice.update)
routers.patch('/devices/:id/key', IotDevice.updateKey)
routers.delete('/devices/:id', IotDevice.del)

module.exports = routers
