const Router = require('koa-router')
const bookRouter = new Router()

const {HttpException, ParameterException} = require('../../../core/http-exception')
const {PositiveIntegerValidator} = require('../../validators/validator')
bookRouter.get('/v1/:id/book/latest', async (ctx, next) => {
    const path = ctx.params
    const query = ctx.request.query
    const header = ctx.request.header
    const body = ctx.request.body // koa-bodyparser
    console.log(query)
    // 使用lin-validator-v2版本，返回的是个promise对象，需要使用await
    const v = await new PositiveIntegerValidator().validate(ctx)
    const id = v.get('path.id', parsed = false) //  parsed = false保留原始数据类型
    /** if (!false) {
        // 方法1
        const error = new Error('为什么错误')
        error.errorCode = 10001
        error.status = 400 // 参数错误
        error.requestUrl = `${ctx.method} ${ctx.path}`
        // 方法2 -- 每次都需要传具体的参数
        // const error = new HttpException('为什么错误', 10001, 400)
        // 方法3 -- 每次都需要按需引入
        // const {HttpException, ParameterException} = require('../../../core/http-exception') // 需要在文件头部按需引入
        const error = new ParameterException() // 引用继承了HttpException的类ParameterException
        // 方法4 -- 在init.js中，将异常基础类挂载到global对象上，在页面上不需要按需引入
        // const error = new global.errs.ParameterException()
        throw error
    } */
    ctx.body = {key: 'hello book'}
})
module.exports = bookRouter