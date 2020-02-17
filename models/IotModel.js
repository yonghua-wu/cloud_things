const db = require('../config/db.js')
const Sequelize = require('sequelize')
const Model = Sequelize.Model

class IotModel extends Model {}

IotModel.init({
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
  name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(200),
    defaultValue: null,
    allowNull: true
  },
  attributeId: {
    type: Sequelize.STRING(50),
    field: 'attribute_id',
    allowNull: false
  },
  createAt: {
    field: 'create_at',
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return new Date(this.getDataValue('createAt')).getTime()
    }
  },
  updateAt: {
    field: 'update_at',
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
    get() {
      return new Date(this.getDataValue('updateAt')).getTime()
    }
  }
},{
  sequelize: db,
  modelName: 'iot_models',
  indexes: [
    {
      fields: ['user_id']
    }
  ]
})

if (process.env.NODE_ENV === 'development') { // 开发模式开启同步
  db.sync({ force: true })
  // db.sync()
}

class IotModelModel {
  /**
   * 新增一条记录
   * @param {Object} row 新增的记录
   * @return {Object}
   */
  static async create(row) {
    let result
    result = await IotModel.create(row)
    return result
  }
  /**
   * 根据id查询记录
   * @param {Number} id id
   * @return {Object}
   */
  static async selectById(id) {
    return await IotModel.findByPk(id)
  }
  /**
   * 根据用户id查询记录
   * @param {Object} userId 用户id
   * @return {Number}
   */
  static async selectByUserId(userId) {
    let result = await IotModel.findAll({
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
    await IotModel.destroy({
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
    await IotModel.update(data, {
      where: {
        id: id
      }
    })
  }
}

module.exports = IotModelModel
