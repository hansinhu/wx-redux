// pages/certify/certify.js
Page({
    data: {
        type: 0
    },
    onLoad: function (options) {
        if (options.type && options.type == 2){   //账户到期
            this.setData({
                type: 2
            })
        } else if (options.type == 3){
            this.setData({
                type: 3
            })
        } else {     //账户认证中
            this.setData({   
                type: 1
            })
        }
    },
    onUnload: function () {
        wx.clearStorageSync();
    }
})