// sequelize 连接数据库，配置一些数据库的参数
const Sequelize = require('sequelize')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database
// 1.数据库名，2账号，3密码
const sequelize = new Sequelize(dbName,user,password,{
    // js对象
    dialect: 'mysql', // 指定数据库类型
    host,
    port,
    logging: false, // sequelize在操作数据库的时候是否在终端显示
    timezone: '+08:00', // 时区，北京时间
    define: {
        // timestamps: false, // 如果设置成false,表结构里不会生成createdAt和updatedAt
        paranoid: true, // 生成deleteTime时间戳
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true // 将驼峰命名换成下划线
    }
})
sequelize.sync({
    // force: true // 新增mysql字段时，把原有表删除，新建，会导致原有记录消失，不建议使用
}) // 如果不加这句话，sequelize不会把这些模型创建到mysql里
module.exports = {
    sequelize
}