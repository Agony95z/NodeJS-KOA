const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
// 权限控制
class Auth {
    constructor(level) {
        this.level = level || 1
        Auth.USER = 8 // 用于权限控制
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }
    get m() {
        return async (ctx, next) => { // 校验接口携带的token
            // token检测
            const userToken = basicAuth(ctx.req)
            // console.log(userToken)
            let errMsg = 'token不合法'
            if (!userToken || !userToken.name) {
                throw new global.errs.Forbbiden()
            }
            try {
                var decode = jwt.verify(userToken.name, global.config.security.secretKey)
                // console.log(decode)
            } catch (error) {
                // token不合法
                // token过期
                if (error.name == 'TokenExpiredError') {
                    // 过期
                    errMsg = 'token已过期'
                }
                throw new global.errs.Forbbiden(errMsg)
                
            }
            if (decode.scope < this.level) { // 判断接口权限
                errMsg = '权限不足'
                throw new global.errs.Forbbiden(errMsg)
            }
            // 执行到这里，表示合法
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }
            await next()
        }
    }

    // 验证令牌
    static vertifyToken(token) {
        try {
            jwt.verify(token, global.config.security.secretKey)
            return true
        } catch(error) {
            return false
        }
    }
}
module.exports = {Auth}