module.exports = {
    // prod
    environment: 'dev',
    database: {
        dbName: '7yue',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456'
    },
    security: {
        secretKey: 'abcdef',
        expiresIn: 60*60*24*30
    },
    wx: {
        appId: 'wx265140840102654b',
        appSecret: 'da0afd73defd49482233336411a103c7',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    }
}