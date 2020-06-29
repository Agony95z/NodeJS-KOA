const Router = require('koa-router')
const {TokenValidator, NotEmptyValidator} = require('../../validators/validator')
const {ParameterException} = require('../../../core/http-exception')
const {LoginType} = require('../../lib/enum')
const {User} = require('../../models/user')
const {generateToken} = require('../../../core/util')
const {Auth} = require('../../../middlewares/auth')
const {WXManager} = require('../../services/wx')
const router = new Router({
    prefix: '/v1/token' // 路由前缀
})
let token;
// 验证登录
router.post('/', async (ctx) => { // 登录成功会下发token
    const v = await new TokenValidator().validate(ctx)
    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL: // 邮箱登录
            token = await emailLogin(v.get('body.account'), v.get('body.secret')) // body.account指登录的账号，此处是email
            break;
        case LoginType.USER_MINI_PROGRAM: // 小程序登录
            token = await WXManager.codeToken(v.get('body.account'))
            break;
        case LoginType.ADMIN_EMAIL:
            break;
        default:
            throw new global.errs.ParameterException('没有相应的处理函数')
    }
    ctx.body = {
        token
    }
})

// 验证token
router.post('/vertify', async (ctx) => {
    // token不能为空
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.vertifyToken(v.get('body.token'))
    ctx.body = {
        result
    }
})
async function emailLogin(account, secret) {
    const user = await User.vertifyEmailPassword(account, secret)
    // console.log(user.id)
    // console.log(Auth.USER)
    return token = generateToken(user.id, Auth.USER)
}
module.exports = router