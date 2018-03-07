const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';
import { getMessageDetail, getDetailAttachment } from '../../../actions/messageDetail.js';
import { addContactUser } from '../../../actions/contact.js';
const combine = require('../../../libs/combine.js').default;
import { formatDate2 } from '../../../utils/global.js';
const WxParse = require("../../../libs/wxparse/wxParse.js")
const messageDetail = {
  data: {
    addToCon: "添加至联系人",
    loading: false,
    resetload: true,
    showOrhide: true,
    getParams: {
      receiveId: ""
    },
    detailList: {},
    parmas: {
      mails: "",
      lastName: "",
      firstName: ""
    },
    attachName:""
  },
  onLoad: function () {

  },
  onShow: function (e) {
    // this.setData({
    //   resetload: true
    // })
    var pras = wx.getStorageSync("mid");
    this.getDetailAttachment({ "receiveId": pras })
      .then(res => {
        if(res.data){
          this.setData({
            attachName: res.data[0].filename
          })
        }else{
          this.setData({
            attachName: ""
          })
        }
      });
    this.getMessageDetail({ "receiveId": wx.getStorageSync("mid") })
      .then(res => {
        if (res.code == 0 && res.data) {
          wx.setStorage({
            key: 'add',
            data: res.data,
          })
          this.setData({
            resetload: false
          })
          // let textHtml = res.data.textHtml.replace('AliLong cor.,Ltd"', '')
          // res.data.textHtml = WxParse.wxParse('article', 'html', textHtml, this, 5);
          var article = res.data.text.replace('AliLong cor.,Ltd"', '');
          var that = this;

          WxParse.wxParse('article', 'html', article, that, 5);
          let records = res.data;
          records.sentTime = formatDate2(records.sentTime);
          if (records.sender.personId) {
            this.setData({
              showOrhide: true,
            });
          } else {
            this.setData({
              showOrhide: false,
            });
          }

          this.setData({
            detailList: records,
            "parmas.mails": records.sender.email,
            "parmas.lastName": records.from,
            "parmas.firstName": records.subject,
          });
        }
      })

  },
  touchendFn: function (e) {

  },
  addTocontact: function () {
    this.setData({
      addToCon: '添加中',
    });
    var qwe = wx.getStorageSync('add');
    var addmail = qwe.sender.email;
    let arr = JSON.stringify([{ type: 0, mail: addmail }]);
    qwe.sender.email = arr;
    this.addContactUser({ "mails": qwe.sender.email, "firstName": qwe.from })
      .then(res => {
        if (res.code == 0) {
          this.setData({
            loading: true
          })
          this.getMessageDetail({ "receiveId": wx.getStorageSync("mid") }).then(res => {
            if (res.code == 0) {
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1000
              })
              if (res.data.sender.personId) {
                this.setData({
                  showOrhide: true,
                });
              } else {
                this.setData({
                  showOrhide: false,
                });
              }
            }
          })
        }
      })
  },
  //下拉加载
  onPullDownRefresh: function () {
    this.getMessageDetail({ "receiveId": wx.getStorageSync("mid") });
  },
  onReady: function () {
  },
  replyTo: function () {
    wx.navigateTo({
      url: '../replyMessage/replyMessage',
    })
  },

}

const mapStateToData = ({ messageDetail }) => ({
  messageDetail
});
const mapDispatchToPage = dispatch => ({
  getMessageDetail: bindActionCreators(getMessageDetail, dispatch), 
  addContactUser: bindActionCreators(addContactUser, dispatch),
  getDetailAttachment: bindActionCreators(getDetailAttachment, dispatch),

});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(messageDetail);
Page(auth.filter(nextPageConfig));