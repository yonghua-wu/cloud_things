const crypto = require('crypto')
const IotDeviceModel = require('../models/IotDevice')
const ruleModel = require('../models/mongodb/rule')
const detailsModel = require('../models/mongodb/detail')
const utils = require('../utils/utils')

class IotDevice {
  /**
   * 查询用户创建的所有设备
   * @param {*} ctx 
   */
  static async list(ctx) {
    let userInfo = utils.jwtDecode(ctx.header.Authorization || ctx.header.authorization)
    let res = await IotDeviceModel.selectByUserId(userInfo.id)
    let list = res.map( item => {
      let {id, name, description, createdAt, updatedAt} = item
      return {id, name, description, createdAt, updatedAt}
    })
    ctx.body = {
      list
    }
    ctx.status = 200
  }
  /**
   * 查询设备详情
   * @param {*} ctx 
   */
  static async details(ctx) {
    let deviceId = ctx.params.id
    let device = await IotDeviceModel.selectById(deviceId)
    if (device && device.id) {
      let res = {
        id: device.id,
        userId: device.userId,
        modelId: device.modelId,
        rules: [],
        details: [],
        name: device.name,
        key: device.key,
        description: device.description,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt
      }
      if (device.rulesId) {
        res.rules = (await ruleModel.findOne({_id: device.rulesId})).list.map( item => {
          return {
            name: item.name,
            condition: item.condition,
            notice_leven: item.notice_leven
          }
        })
      }
      if (device.detailsId) {
        res.details = (await detailsModel.findOne({_id: device.detailsId})).list.map( item => {
          return {
            name: item.name,
            value: item.value
          }
        })
      }
      ctx.body = res
      ctx.status = 200
    } else {
      throw new HttpError(404)
    }
  }
  /**
   * 创建设备
   * @param {*} ctx 
   */
  static async create(ctx) {
    let req = ctx.request.body
    let userInfo = utils.jwtDecode(ctx.header.Authorization || ctx.header.authorization)
    utils.checkParams(req, {
      name: true,
      modelId: true,
      description: false,
      rules: false,
      details: false
    })
    let row = {
      userId: userInfo.id,
      name: req.name,
      modelId: req.modelId,
      description: req.description || '',
      rulesId: '',
      detailsId: '',
      key: (crypto.createHash('md5').update((new Date()).getTime() + '').digest('hex')).slice(0, 10)
    }
    let ruleRes = { list: []}
    if ('rules' in req) { // 如果添加了规则
      req.rules.map( item => {
        utils.checkParams(item, {
          name: true,
          condition: true,
          notice_leven: true
        })
      })
      ruleRes = await ruleModel.create({
        created_at: Date.now(),
        updated_at: Date.now(),
        list: req.rules
      })
      row.rulesId = ruleRes.id
    }
    if ('details' in req) { // 如果添加了详情，检查参数是否符合规范
      req.details.map( item => {
        utils.checkParams(item, {
          name: true,
          value: true
        })
      })
    }
    let detailsRes = await detailsModel.create({ // 插入
      created_at: Date.now(),
      updated_at: Date.now(),
      list: req.details || [] // 用户没有添加详情插入空数组
    })
    row.detailsId = detailsRes.id
    let dbResult = await IotDeviceModel.create(row)

    ctx.body = {
      id: dbResult.id,
      userId: dbResult.userId,
      modelId: dbResult.modelId,
      rules: ruleRes.list.map( item => {
        return {
          name: item.name,
          condition: item.condition,
          notice_leven: item.notice_leven
        }
      }),
      details: detailsRes.list.map( item => {
        return {
          name: item.name,
          value: item.value
        }
      }),
      name: dbResult.name,
      key: dbResult.key,
      description: dbResult.description,
      createdAt: dbResult.createdAt,
      updatedAt: dbResult.updatedAt
    }
    ctx.status = 201
  }
  /**
   * 修改设备
   * @param {*} ctx 
   */
  static async update(ctx) {
    let deviceId = ctx.params.id
    let req = ctx.request.body
    utils.checkParams(req, {
      name: false,
      modelId: false,
      description: false,
      rules: false,
      details: false
    })
    let device = await IotDeviceModel.selectById(deviceId)
    if (device && device.id) {
      if ('rules' in req) {
        req.rules.map( item => {
          utils.checkParams(item, {
            name: true,
            condition: true,
            notice_leven: true
          })
        })
        await ruleModel.update({_id: device.rulesId}, {
          updated_at: Date.now(),
          list: req.rules
        })
      }
      if ('details' in req) {
        req.details.map( item => {
          utils.checkParams(item, {
            name: true,
            value: true
          })
        })
        await detailsModel.update({_id: device.detailsId}, {
          updated_at: Date.now(),
          list: req.details
        })
      }
      delete req.rules
      delete req.details
      let dbResult = await IotDeviceModel.updateById(device.id, req)
      let res = JSON.parse(JSON.stringify(dbResult))
      if (device.rulesId) {
        res.rules = (await ruleModel.findOne({_id: device.rulesId})).list.map( item => {
          return {
            name: item.name,
            condition: item.condition,
            notice_leven: item.notice_leven
          }
        })
      }
      if (device.detailsId) {
        res.details = (await detailsModel.findOne({_id: device.detailsId})).list.map( item => {
          return {
            name: item.name,
            value: item.value
          }
        })
      }
      delete res.rulesId
      delete res.detailsId
      ctx.body = res
      ctx.status = 201
    } else {
      throw new HttpError(404)
    }
  }
  /**
   * 重新生成key
   * @param {*} ctx 
   */
  static async updateKey(ctx) {
    let deviceId = ctx.params.id
    let device = await IotDeviceModel.selectById(deviceId)
    if (device && device.id) {
      let key = (crypto.createHash('md5').update((new Date()).getTime() + '').digest('hex')).slice(0, 10)
      let dbResult = await IotDeviceModel.updateById(device.id, { key })
      ctx.body = {
        key: dbResult.key
      }
      ctx.status = 201
    } else {
      throw new HttpError(404)
    }
  }
  /**
   * 删除设备
   * @param {*} ctx 
   */
  static async del(ctx) {
    let deviceId = ctx.params.id
    let device = await IotDeviceModel.selectById(deviceId)
    if (device && device.id) {
      await ruleModel.remove({_id: device.rulesId})
      await detailsModel.remove({_id: device.detailsId})
      await IotDeviceModel.deleteById(device.id)
      ctx.status = 204
      ctx.body = {}
    } else {
      throw new HttpError(404)
    }
  }
}

module.exports = IotDevice
