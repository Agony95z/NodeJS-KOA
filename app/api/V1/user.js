const Router = require('koa-router')
const {RegisterValidator} = require('../../validators/validator')
const {User} = require('../../models/user')
const {success} = require('../../lib/helper')
const router = new Router({
    prefix: '/v1/user' // 路由前缀
})
// 注册接口
 router.post('/register', async (ctx) => {
    //  sequelize所有方法都是异步的，validate中使用了findOne
    const v = await new RegisterValidator().validate(ctx)
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password2'),
        nickname: v.get('body.nickname')
    }
    const r = await User.create(user) // 写入SQL
    // throw new global.errs.Success() --> 等同于success()
    success()
 })
 module.exports = router