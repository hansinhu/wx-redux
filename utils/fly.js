var Fly = require('../libs/fly.js') 
var fly = new Fly(); //创建fly实例
import { getStorageSession } from './global.js';
const basicConfig = require('./config.js')

//添加请求拦截器
fly.interceptors.request.use((config, promise) => {
    //配置请求参数
    config.baseURL = basicConfig.baseURL;
    config.timeout = '60000';
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.headers['Cookie'] = 'SESSION=' + wx.getStorageSync('SESSION') || '';
    return config;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response, promise) => {
        let code = response.data.code
        if(code == 1010){    //SESSION过期，需要重新登录
            wx.clearStorageSync();
            wx.redirectTo({ url: '../login/login' })
        }
        //只将请求结果的data字段返回
        let headersBefore = JSON.stringify(response.headers);
        if (headersBefore.indexOf('Set-Cookie') > -1) {
            let headers = JSON.parse(headersBefore.replace(/Set-Cookie/, "cookie"));
            if (headers.cookie) {
                wx.setStorage({
                    key: "SESSION",
                    data: getStorageSession(headers.cookie)
                })
            }
        }
        return response.data
    },
    (err, promise) => {
        //发生网络错误后会走到这里
        console.log('----err---',err)
        // wx.navigateTo({ url: '../certify/certify?type=3' })
        promise.resolve("error")
    }
)
export default fly