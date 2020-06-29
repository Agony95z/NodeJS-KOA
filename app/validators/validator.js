const {LinValidator, Rule} = require('../../core/lin-validator-v2')
const {User} = require('../models/user')
const {LoginType} = require('../lib/enum')
class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '需要是正整数', {min:1})
        ]
    }
}

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.email = [
            new Rule('isEmail', '不符合Email规范')
        ]
        this.password1 = [
            new Rule('isLength', '密码6-32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('matches', '密码要求数字字母下划线', '^[0-9a-zA-Z_]{1,}$')
        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength', '昵称4-16个字符', {
                min: 4,
                max: 16
            }),
        ]
    }
    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2) {
            throw new Error('两个密码不一致')
        }
    }
    async validateEmail(vals) {
        const email = vals.body.email
        // User.findOne返回的promise
        const user = await User.findOne({
            // 查询sql
            where: { // 查询 条件,多个条件是&&关系
                email: email
            }
        })
        if (user) {
            throw new Error('email已存在')
        }
    }
}

class TokenValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule('isLength', '不符合账号规范', {
                min: 4,
                max: 32
            })
        ]
        this.secret = [
            // 传统登录 account + secret
            // 微信打开小程序 合法用户  不输入secret也行
            // 1. 可以为空，可以不传
            // 2. 空/不为空
            new Rule('isOptional'), // isOptional属于lin-validator
            new Rule('isLength', '至少6个字符', {
                min: 6,
                max: 32
            })
        ]
        // type
    }
    validateLoginType(vals) {
        if (!vals.body.type) {
            throw new Error('type是必须参数')
        }
        if (!LoginType.isThisType(vals.body.type)) {
            throw new Error('type参数不合法')
        }
    }
}

// 验证token不能为空
class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = new Rule('isLength', '不允许为空', {min: 1})
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator
}