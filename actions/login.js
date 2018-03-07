
const fly = require('../utils/fly.js').default;

//获取验证码
export function getCaptcha(params) {
    return (dispatch, getState) => {
        return fly.get('/bshop/login/captcha/getBase64?v=' + new Date().getTime(), params || {})
            .catch(err => {
                console.error(`Request Error: `, err);
            });
    }
}

//登录
export function doLogin(params) {
    return (dispatch, getState) => {
        return fly.post('/bshop/login', params || {})
            .catch(err => {
                console.error(`Request Error: `, err);
            });
    }
}
