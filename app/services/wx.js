// 微信小程序服务端业务逻辑
const util = require('util')
const axios = require('axios')
const {User} = require('../models/user')
const {generateToken} = require('../../core/util')
const {Auth} = require('../../middlewares/auth')
class WXManager {
    static async codeToken(code) {
        const url = util.format(global.config.wx.loginUrl, global.config.wx.appId, global.config.wx.appSecret, code)
        console.log(url)
        const result = await axios.get(url)
        if (result.status !== 200) {
            throw new global.errs.AuthFailed('openid获取失败')
        }
        const errcode = result.data.errcode
        if (errcode !== 0) { // 失败
            throw new global.errs.AuthFailed('openid获取失败' + errcode)
        }
        let user = await User.getUserByOpenid(result.data.openid) // 查询SQL是否有该用户，没有就创建
        if (!user) {
            user = await User.registerByOpenid(result.data.openid)
        }
        return generateToken(user.id, Auth.USER)
    }
}
module.exports = {WXManager}