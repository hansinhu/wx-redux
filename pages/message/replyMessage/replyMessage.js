const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';
import { senMessage, getMessageDetail } from '../../../actions/messageDetail.js';
const combine = require('../../../libs/combine.js').default;
const replyMessage = {
  data: {
    loading: false,
    disabled: true,
    getParams: {
      fromer: "",
      toer: "",
      subject: "",
      text: ""
    },
    replyList: {},
    errorTxt: '',
    showError: false
  },
  onLoad:function(option){
    if(option){
      let {fromer,toer} = option
      this.setData({
        "replyList.from": toer,
        "replyList.to": fromer,
        "getParams.fromer": fromer,
        "getParams.toer": toer,
      })
    }
  },
  onShow: function (e) {
    if(this.data.getParams.fromer) return;
    this.getMessageDetail({ "receiveId": wx.getStorageSync("mid") }).then(res => {
      if (res.code == 0) {
        let fromer = res.data.to;
        let toer = res.data.from;
        this.setData({
          replyList: res.data,
          "getParams.fromer": fromer,
          "getParams.toer": toer,
        });
      }
    })
  },
  bindAccountInput: function (e) {
    let value = e.detail.value
    if (value.length > 200) {
      this.setData({
          showError: true,
          errorText: '邮件标题超过字符上限，最多输入200字符'
      })
      return value.substring(0,200);
    }
    this.setData({
        "getParams.subject": value,
    })
    this.ifActive();
  },
  bindPwdInput: function (e) {
      let value = e.detail.value
      if (value.length > 2000) {
    //   wx.showToast({
    //     title: '邮件正文超过字符上限，最多输入2000字符',
    //     duration: 1000
    //   })
      this.setData({
          showError: true,
          errorText: '邮件正文超过字符上限，最多输入2000字符'
      })
      return value.substring(0, 2000);
    }
    this.setData({
        "getParams.text": value,
    })
    this.ifActive();
  },
  ifActive: function () {
    if (this.data.getParams.subject && this.data.getParams.text) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  sendMes: function () {
    this.setData({
        'getParams.subject': this.data.getParams.subject.trim(),
        'getParams.text': this.data.getParams.text.trim()
    })
    if(!this.data.getParams.subject){
        this.setData({
            showError: true,
            errorText: '邮件主题不能为空'
        })
        return;
    }
    if (!this.data.getParams.text) {
        this.setData({
            showError: true,
            errorText: '邮件正文不能为空'
        })
        return;
    }

    this.setData({
      loading: true
    })
    this.senMessage(this.data.getParams).then(res => {
      if(res.code == 0 ){
        wx.showToast({
          title: '已发送',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function(){
          wx.switchTab({ url: '../message' });
        },1300)
      }else{
        wx.showToast({
          title: '发送失败',
          duration: 1000
        })
        this.setData({
          loading: false
        })
      }
    })
  },
  onReady: function () {
  },

  addTocontact: function () {

  }
}

const mapStateToData = ({ replyMessage }) => ({
  replyMessage
});
const mapDispatchToPage = dispatch => ({
  getMessageDetail: bindActionCreators(getMessageDetail, dispatch),
  senMessage: bindActionCreators(senMessage, dispatch),

});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(replyMessage);
Page(auth.filter(nextPageConfig));