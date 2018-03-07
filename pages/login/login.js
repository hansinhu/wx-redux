// pages/login/login.js
import { bindActionCreators } from '../../libs/redux.js';
import { enhancedConnect } from '../../libs/enhancedConnect.js';
import { doLogin, getCaptcha } from '../../actions/login.js';

const login = {
    data: {
        codeSrc: '',
        loading: false,
        disabled: true,
        captcha: '',
        formData:{
          loginAccount: '', //13811111112  15211111189  13738101542
          password: '',  //aa123456  123456  123456
        },
        focusPwd: false,
        focusCaptcha: false,
        errorTxt: '',
        showError: false
    },
    onShow: function () {
        this.setData({
            loading: false,
            captcha: '',
            disabled: true
        })
        this.getCode();
    },
   
    getCode : function(){
        this.getCaptcha().then(res => {
            if (res.code == 0) {
                this.setData({
                    codeSrc: 'data:image/jpeg;base64,' + res.data,  // data 为接口返回的base64字符串  
                    captcha: '',
                    disabled: true
                })
            }
        });
    },
    bindInput: function(e) {
        let name = e.target.dataset.name;
        let value = e.detail.value;
        let formData = this.data.formData;
        formData[name] = value;
        this.setData({
            formData: formData,
        })
        if (name == 'captcha') {
            this.setData({
                captcha: value,
            })
        }
        this.ifActive();
    },
    ifActive: function () {
        if (this.data.formData.loginAccount && this.data.formData.password && this.data.captcha){
            this.setData({
                disabled: false
            })
        }else{
            this.setData({
                disabled: true
            })
        }
    },
    next: function(e) {
        let name = e.target.dataset.name;
        switch (name) {
            case 'loginAccount':
                this.setData({
                    focusPwd: true,
                    focusCaptcha: false
                })
                break;
            case 'password':
                this.setData({
                    focusPwd: false,
                    focusCaptcha: true
                })
                break;
        }
    },
    login: function() {
        this.setData({
            loading: true
        })
        this.data.formData['loginSource'] = 2;
        this.doLogin(this.data.formData).then(res => {
            if (res.code == 0) {
                //子账号暂不支持登录
              // if (res.data.userId != res.data.subUserId) {
              if (res.data.parentUserId) {
                    this.setData({
                        loading: false,
                        showError: true,
                        errorText: '暂不支持子账号登录'
                    })
                    return;
                }

                let shopStatus = res.data.shopStatus;
                wx.setStorage({
                    key: "isLogin",
                    data: true
                })
                wx.setStorage({
                    key: "shopStatus",
                    data: shopStatus
                })
               
                switch (shopStatus) {
                    case 0:   //应该不存在这种情况，这个是为刚注册账号的客户准备的，小程序只能登录
                        // this.$router.push('/CreateShop')
                        break
                    case 1:
                        wx.navigateTo({ url: '../certify/certify' })
                        break
                    case 2:
                        wx.navigateTo({ url: '../certify/certify' })
                        break
                    case 3:
                        wx.navigateTo({ url: '../certify/certify' })
                        break
                    case 4:
                        wx.switchTab({ url: '../home/home' });
                        break
                    case 5:
                        wx.navigateTo({ url: '../certify/certify' })
                        break
                    case 6:
                        wx.switchTab({ url: '../home/home' });
                        break
                    case 7:
                        wx.navigateTo({ url: '../certify/certify?type=2' })
                        break
                    default:
                        wx.switchTab({ url: '../home/home' });
                        break
                }
            } else {
                this.setData({
                    loading: false,
                    captcha: '',
                    disabled: true,
                    showError: true
                })
                if (res.message.indexOf('验证码') > -1){
                    this.setData({
                        errorText: '图片验证码不正确'
                    })
                }else {
                    this.setData({
                        errorText: '账号或密码错误'
                    })
                }
                this.getCode();
            }
        });
    },
    onShareAppMessage: function (res) {
        return {
            title: '盈店通',
            path: '/pages/login/login'
        }
    }
}

const mapDispatchToPage = dispatch => ({
    doLogin: bindActionCreators(doLogin, dispatch),
    getCaptcha: bindActionCreators(getCaptcha, dispatch)
});

const nextPageConfig = enhancedConnect(null, mapDispatchToPage)(login);
Page(nextPageConfig);