const Router = require('koa-router')
const {TokenValidator} = require('../../validators/validator')
const {ParameterException} = require('../../../core/http-exception')
const {LoginType} = require('../../lib/enum')
const {User} = require('../../models/user')
const {generateToken} = require('../../../core/util')
const router = new Router({
    prefix: '/v1/token' // 路由前缀
})
let token;
// 验证登录
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL: // 邮箱登录
            token = await emailLogin(v.get('body.account'), v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM:
            break;
        default:
            throw new global.errs.ParameterException('没有相应的处理函数')
    }
    ctx.body = {
        token
    }
})
async function emailLogin(account, secret) {
    const user = await User.vertifyEmailPassword(account, secret)
    return token = generateToken(user.id, 2)
}
module.exports = router