const IotModelModel = require('../models/IotModel')
const attributeModel = require('../models/mongodb/attribute')
const utils = require('../utils/utils')

class IotModel {
  /**
   * 查询用户创建的所有模型
   * @param {*} ctx 
   */
  static async list(ctx) {
    let userInfo = utils.jwtDecode(ctx.header.Authorization || ctx.header.authorization)
    let res = await IotModelModel.selectByUserId(userInfo.id)
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
   * 查询某个模型详情
   * @param {*} ctx 
   */
  static async details(ctx) {
    let modelId = ctx.params.id
    let model = await IotModelModel.selectById(modelId)
    if (model && model.attributeId) {
      let attributes = await attributeModel.findOne({_id: model.attributeId}, {_id: 0})
      let list = attributes.list.map( item => {
        let {name, view_name, value_type, default_value, unit} = item
        return {
          name,
          view_name,
          value_type,
          default_value,
          unit
        }
      })
      ctx.body = {
        id: model.id,
        name: model.name,
        description: model.description,
        attributes: list,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
      }
      ctx.status = 200
    } else {
      throw new HttpError(404)
    }
  }
  /**
   * 创建设备模型
   * @param {*} ctx 
   */
  static async create(ctx) {
    let req = ctx.request.body
    let userInfo = utils.jwtDecode(ctx.header.Authorization || ctx.header.authorization)
    utils.checkParams(req, {
      name: true,
      description: false,
      attributes: true
    })
    req.attributes.map( item => {
      utils.checkParams(item, {
        name: true,
        view_name: true,
        value_type: true,
        default_value: true,
        unit: true
      })
    })
    let res = await attributeModel.create({
      created_at: Date.now(),
      updated_at: Date.now(),
      list: req.attributes
    })
    let row = {
      userId: userInfo.id,
      name: req.name,
      description: req.description || '',
      attributeId: res.id
    }
    res = {}
    res = await IotModelModel.create(row)
    ctx.status = 201
    ctx.body = res
  }
  /**
   * 修改模型
   * @param {*} ctx 
   */
  static async update(ctx) {
    let modelId = ctx.params.id
    let req = ctx.request.body
    let model = await IotModelModel.selectById(modelId)
    if (model && model.id) {
      utils.checkParams(req, {
        description: false,
        attributes: false
      })
      if ('attributes' in req) {
        req.attributes.map( item => {
          utils.checkParams(item, {
            name: true,
            view_name: true,
            value_type: true,
            default_value: true,
            unit: true
          })
        })
        
        await attributeModel.update({_id: model.attributeId}, {
          updated_at: Date.now(),
          list: req.attributes
        })
      }
      delete req.attributes
      let newModel = await IotModelModel.updateById(modelId, req)
      ctx.body = newModel
      ctx.status = 201
    } else {
      throw new HttpError(404)
    }
  }
  /**
   * 删除模型
   * @param {*} ctx 
   */
  static async del(ctx) {
    let modelId = ctx.params.id
    let model = await IotModelModel.selectById(modelId)
    if (model && model.id) {
      await attributeModel.remove({_id: model.attributeId})
      await IotModelModel.deleteById(modelId)
      ctx.status = 204
      ctx.body = {}
    } else {
      throw new HttpError(404)
    }
  }
}

module.exports = IotModel
