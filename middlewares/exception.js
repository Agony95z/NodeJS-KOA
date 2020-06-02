// 全局捕获异常，挂在到app.js
const {HttpException} = require('../core/http-exception')

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) { // 捕获到book.js里的异常
        const isHttpexception = error instanceof HttpException
        const isDev = global.config.environment === 'dev'
        if (isDev && !isHttpexception) {
            throw error
        }
        if (isHttpexception) { // book.js里抛出的异常继承自HttpException
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                requset: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.code
        } else {
            // 未知异常
            ctx.body = {
                msg: 'we made a mistake',
                error_code: 9999,
                requset: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}
module.exports = catchError