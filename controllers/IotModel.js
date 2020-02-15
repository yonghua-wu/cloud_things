// const IotModelModel = require('../models/IotModel')

class IotModel {
  /**
   * 查询用户创建的所有模型
   * @param {*} ctx 
   */
  static async list(ctx) {
    // let info = await IotModelModel.selectById(1)
    Console.log(ctx.params)
    ctx.status = 200
    ctx.body = {}
  }
  /**
   * 查询某个模型详情
   * @param {*} ctx 
   */
  static async details(ctx) {

  }
  /**
   * 创建设备模型
   * @param {*} ctx 
   */
  static async create(ctx) {
    
  }
  /**
   * 修改模型
   * @param {*} ctx 
   */
  static async update(ctx) {
    
  }
  /**
   * 删除模型
   * @param {*} ctx 
   */
  static async del(ctx) {
    
  }
}

module.exports = IotModel
