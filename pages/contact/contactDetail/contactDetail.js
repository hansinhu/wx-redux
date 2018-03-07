const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';
const basicConfig = require('../../../utils/config.js');
import { getTimelineList, getContactDetailInfo, getMailInfo, getCompanyDetailInfo } from '../../../actions/contact.js';
import { formatDate } from '../../../utils/global.js'

const ContactDetail = {

  /**
   * 页面的初始数据
   */
  data: {
      timeLineRecords: [],
      base: {},
      contact: {},
      social: {},
      navdt: true,
      userMail: '',
      isNoMore: false,
      loading: false,
      totalCount: 0,
      companyInfo:{
        base:{}
      }, 
      showError: false,
      errorText: '',
  },

  page :1,
  totalPage: null,

  navDT: function () {
    this.setData({
      navdt: true
    });
  },

  navGK: function () {
    this.setData({
      navdt: false
    });
  },

  copyLink: function (e) {
    let _this = this;
    let url = e.target.dataset.url;
    wx.setClipboardData({
      data: url,
      success: function () {
        _this.setData({
          showError: true,
          errorText: '复制成功'
        })
      }
    })
  },

  getTimeLines: function (res) {
    let self = this;
    if (this.records) {
      this.records = [].concat(this.records, res.data.records)
    } else {
      this.records = res.data.records;
    }

    let records = this.records;

    for (var i = 0; i < records.length; i++) {
      if (typeof records[i].socialContent == 'string') {
        records[i].socialContent = JSON.parse(records[i].socialContent);
      }

      if (records[i].createTime) {
        records[i].socialContent.time = formatDate(new Date(records[i].createTime))
      } else if (records[i].socialContent.openTime) {
        records[i].socialContent.time = formatDate(new Date(records[i].openTime))
      }
    }
    this.setData({
      timeLineRecords: records
    });

    this.page = this.page + 1;
  },

  getTimeLinesListDOM: function () {
    let self = this;
    
    if (this.totalPage && this.totalPage < this.page){
      this.setData({
        isNoMore:true
      })
      return;
    } 
    this.setData({
      loading: true
    })
    this.getTimelineList(this.contactId,  this.page, '0;1;2;3;11').then(function (res) {
      //self.page = self.page+1;
      self.totalPage = res.data.totalPages
      self.getTimeLines(res);
      self.setData({
        loading: false,
        totalCount: res.data.totalCount
      })
    });
  },

  callPhone:function(){
    if (!this.data.contact.mobilePhone && !this.data.contact.telephone) return;
    let tel = this.data.contact.mobilePhone || this.data.contact.telephone
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },

  sendMail: function () {
    if (!this.data.contact.mail || !this.data.userMail) return;
      wx.navigateTo({
          url: '/pages/message/replyMessage/replyMessage?fromer=' + this.data.userMail + '&toer=' + this.data.contact.mail,
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let self = this;
      this.contactId = options.contactId;
      this.contactType = options.contactType;
      this.companyId = options.contactId;
      this.personId = options.contactId;

      this.getContactDetailInfo(this.personId).then(function (res) {
          // self.base = res.data.base;
          // self.contact = res.data.contact;
          self.setData({
              base: res.data.base,
              contact: res.data.contact,
              social: res.data.social
          });
          if (self.data.base.companyId){
            self.getCompanyDetailInfo(self.data.base.companyId).then(function (respons) {
              self.setData({
                companyInfo: respons.data
              });
            })
          }

          self.getTimeLinesListDOM();
      })

      //请求登录用户的邮箱
      this.getMailInfo().then((res) => {
          if (res && res.code == 0 && res.data) {
              let mail = ''
              res.data.forEach((item) => {
                  if (item.channelId == 'MAIL') {
                      mail = item.emailAddress
                  }
              })
              this.setData({
                  userMail: mail
              })
          }
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.getTimeLinesListDOM();
  },
}

const mapStateToData = ({ contact, home }) => ({
    contact, home
});

const mapDispatchToPage = dispatch => ({
    getTimelineList: bindActionCreators(getTimelineList, dispatch),
    getContactDetailInfo: bindActionCreators(getContactDetailInfo, dispatch),
    getMailInfo: bindActionCreators(getMailInfo, dispatch),
    getCompanyDetailInfo: bindActionCreators(getCompanyDetailInfo, dispatch),
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(ContactDetail);
Page(auth.filter(nextPageConfig));