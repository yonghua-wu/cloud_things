const db = require('../config/db.js')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class IotDevice extends Model {}

IotDevice.init({
  id: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    field: 'user_id',
    allowNull: false
  },
  modelId: {
    type: Sequelize.INTEGER(11).UNSIGNED,
    field: 'model_id',
    allowNull: false
  },
  rulesId: {
    type: Sequelize.STRING(50),
    field: 'rules_id',
    allowNull: true
  },
  detailsId: {
    type: Sequelize.STRING(50),
    field: 'details_id',
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  key: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(200),
    defaultValue: null,
    allowNull: true
  },
  createdAt: {
    field: 'created_At',
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return new Date(this.getDataValue('createdAt')).getTime()
    }
  },
  updatedAt: {
    field: 'updated_At',
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return new Date(this.getDataValue('updatedAt')).getTime()
    }
  }
},{
  sequelize: db,
  modelName: 'iot_devices',
  indexes: [
    {
      fields: ['user_id']
    }
  ]
})

if (process.env.NODE_ENV === 'development') { // 开发模式开启同步
  // db.sync({ force: true })
  // db.sync()
}

class IotDevicesModel {
  /**
   * 新增一条记录
   * @param {Object} row 新增的记录
   * @return {Object}
   */
  static async create(row) {
    let result
    result = await IotDevice.create(row)
    return result
  }
  /**
   * 根据id查询记录
   * @param {Number} id id
   * @return {Object}
   */
  static async selectById(id) {
    return await IotDevice.findByPk(id)
  }
  /**
   * 根据用户id查询记录
   * @param {Object} userId 用户id
   * @return {Number}
   */
  static async selectByUserId(userId) {
    let result = await IotDevice.findAll({
      where: {
        userId
      }
    })
    return result
  }
  /**
   * 根据id删除记录
   * @param {Number} id id
   */
  static async deleteById(id) {
    await IotDevice.destroy({
      where: {
        id: id
      }
    })
  }
  /**
   * 根据id更新数据
   * @param {Number} id id
   * @param {Object} data 更新的数据
   */
  static async updateById(id, data) {
    await IotDevice.update(data, {
      where: {
        id: id
      }
    })
    return await this.selectById(id)
  }
}

module.exports = IotDevicesModel
