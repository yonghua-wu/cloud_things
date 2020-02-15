// const IotDeviceModel = require('../models/IotDevice')

class IotDevice {
  /**
   * 查询用户创建的所有设备
   * @param {*} ctx 
   */
  static async list(ctx) {
    // let info = await IotDeviceModel.selectById(1)
    Console.log(ctx.params)
    ctx.status = 200
    ctx.body = {}
  }
  /**
   * 查询设备详情
   * @param {*} ctx 
   */
  static async details(ctx) {

  }
  /**
   * 创建设备
   * @param {*} ctx 
   */
  static async create(ctx) {
    
  }
  /**
   * 修改设备
   * @param {*} ctx 
   */
  static async update(ctx) {
    
  }
  /**
   * 重新生成key
   * @param {*} ctx 
   */
  static async updateKey(ctx) {
    
  }
  /**
   * 删除设备
   * @param {*} ctx 
   */
  static async del(ctx) {
    
  }
}

module.exports = IotDevice
