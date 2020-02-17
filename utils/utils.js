const crypto = require('crypto')
const CONFIG = require('../config/config')
const jwt = require('jsonwebtoken')

module.exports = {
  /**
   * 检查请求的参数
   * @param {Object} req 请求参数
   * @param {Array} params 参数列表
   */
  checkParams(req, params) {
    let keys = Object.keys(params)
    
    for(let key in req) {
      if (keys.indexOf(key) === -1) {
        throw new HttpError(400)
      }
    }
    for(let key in params) {
      if(params[key] && !(key in req)) {
        throw new HttpError(400)
      }
    }
    return true
  },
  /**
   * 将密码md5加密
   * @param {String} password 明文密码
   */
  maskPassword(password) {
    return crypto.createHash('md5').update(CONFIG.PW_SECRET + password).digest('hex')
  },
  jwtDecode(token) {
    if (!token) {
      throw new HttpError(401)
    }
    let tokenInfo = jwt.decode(token)
    if (!tokenInfo) {
      throw new HttpError(400)
    } else {
      return tokenInfo
    }
  }
}
