//app.js
const configureStore = require('./configureStore.js');
const Store = configureStore();
App({
    onLaunch: function () {
        //如果用户已是登录状态，直接到首页
        if (wx.getStorageSync('isLogin')) {
            //根据店铺的状态决定跳转哪个页面
            let shopStatus = wx.getStorageSync('shopStatus');
            if (shopStatus == 1 || shopStatus == 2 || shopStatus == 3 || shopStatus == 5) {   //认证中
                wx.navigateTo({ url: '../pages/certify/certify' })
            } else if (shopStatus == 7) {             //认证到期
                wx.navigateTo({ url: '../pages/certify/certify?type=2' })
            } else {
                wx.switchTab({ url: '../pages/home/home' });
            }
        }
    },
    Store
})

