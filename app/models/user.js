const bcrypt = require('bcryptjs') // 密码加密方法

// 创建数据库模型
const {sequelize} = require('../../core/db') // sequelize实例
const {Sequelize, Model} = require('sequelize')

class User extends Model {
    static async vertifyEmailPassword(email, plainPassword) { // 通过登录账号和密码去校验SQL
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new global.errs.AuthFailed('账号不存在')
        }
        const correct = bcrypt.compareSync(plainPassword, user.password) // sql里的密码是加密的，此处加密后再进行比较
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        // console.log(user)
        return user
    }
    static async getUserByOpenid(openid) { // 小程序登录
        const user = await User.findOne({
            where: {
                openid
            }
        })
        return user
    }
    static async registerByOpenid(openid) { // 小程序登录
        const user = await User.create({
            openid
        })
        return user
    }
}
User.init({
    // 主键：关系型数据库,不能重复， 不能为空
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // 设置为true会被sequelize认为是个主键
        autoIncrement: true // 自动增长
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        set(val) { // Model里的方法，相当于设计模式中的观察者
            const salt = bcrypt.genSaltSync(10) // 数字代表安全性，数字越大成本越高
            const psw = bcrypt.hashSync(val, salt) // 加密过后的密码
            this.setDataValue('password', psw) // 属于Model里的方法
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, {
    sequelize,
    tableName: 'user' // 指定表名字
})

module.exports = {
    User
}