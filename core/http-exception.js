// 定义HTTPException异常基类
class HttpException extends Error {
    constructor(msg='服务器异常', errorCode=10001, code=400) {
        super()
        this.errorCode = errorCode
        this.code = code
        this.msg = msg
    }
}
class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 400
        this.msg = msg || '参数错误'
        this.errorCode = errorCode || 10001
    }
}
class Success extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 201 // 表示操作成功，200一般表示查询成功
        this.msg = msg || 'ok'
        this.errorCode = errorCode || 0
    }
}
class NotFound extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '资源未找到'
        this.errorCode = errorCode || 10000
        this.code = 404
    }
}
class AuthFailed extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10004
        this.code = 401
    }
}
class Forbbiden extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10006
        this.code = 403
    }
}
module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbbiden
}