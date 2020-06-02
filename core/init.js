const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
    static initCore(app) {
        // 入口方法
        InitManager.app = app
        InitManager.initLoadRouters()
        InitManager.loadHttpException()
        InitManager.loadConfig()
    }
    static initLoadRouters() { // 路由加载模块，自动挂载api路径下的路由
        // path config
        // process.cwd()获取根路径
        const apiDirectory = `${process.cwd()}/app/api`
        // 绝对路径
        requireDirectory(module, apiDirectory, {
            visit: whenNodeModule
        })

        function whenNodeModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }
    static loadHttpException() { // 在global对象上挂载异常基础类，在页面上使用的时候不用每次都引入具体使用了哪个类
        const errors = require('./http-exception')
        global.errs = errors
    }
    static loadConfig(path = '') { // 全局配置模块，配置开发环境和生产环境，对应不同的配置项
        const configPath = path || `${process.cwd()}/config/config.js`
        const config = require(configPath)
        global.config = config
    }
}
module.exports = InitManager