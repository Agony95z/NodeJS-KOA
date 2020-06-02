const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
require('./app/models/user')
const app = new Koa()
app.use(parser()) // 获取请求参数
app.use(catchError)
InitManager.initCore(app)
app.listen('3000', () => { 
    console.log('3000接口被监听')
})
