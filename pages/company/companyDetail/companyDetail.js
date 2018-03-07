const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';
const basicConfig = require('../../../utils/config.js');
import { getTimelineList, getCompanyDetailInfo, getMailInfo } from '../../../actions/contact.js';
import { formatDate } from '../../../utils/global.js'


const companyDetail = {

  /**
   * 页面的初始数据
   */
  data: {
     timeLineRecords :[],
     base : {},
     contact : {},
     social : {},
     navdt : true,
     userMail: '',
     isNoMore: false,
     loading: false,
     totalCount:0,
     showError: false,
     errorText: '',
  },

  page : 1,
  totalPage: null,
  navDT:function(e){
    this.setData({
      navdt: true
    });
  },

  navGK: function (e) {
    this.setData({
      navdt: false
    });
  },

  copyLink:function(e){
    let _this = this;
    let url = e.target.dataset.url;
    wx.setClipboardData({
      data: url,
      success: function(){
        _this.setData({
          showError: true,
          errorText: '复制成功'
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  sendMail: function () {
    if (!this.data.contact.mail || !this.data.userMail) return;
    wx.navigateTo({
      url: '/pages/message/replyMessage/replyMessage?fromer=' + this.data.userMail + '&toer=' + this.data.contact.mail,
    })
  },
  //打电话
  callPhone: function () {
    if (!this.data.contact.mobilePhone && !this.data.contact.telephone) return;
    let tel = this.data.contact.mobilePhone || this.data.contact.telephone
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },

  getTimeLines : function(res){
    let self = this;
    if (this.records){
      this.records = [].concat(this.records,res.data.records )
    }else{
      this.records = res.data.records;
    }
    
    let records = this.records;
    
    for (var i = 0; i < records.length; i++) {
      if(typeof records[i].socialContent == 'string'){
        records[i].socialContent = JSON.parse(records[i].socialContent);
      }
      
      if (records[i].socialContent.createTime){
        records[i].socialContent.time = formatDate(new Date(records[i].socialContent.createTime))
      } else if (records[i].socialContent.openTime){
        records[i].socialContent.time = formatDate(new Date(records[i].socialContent.openTime))
      }
    }

    this.setData({
      timeLineRecords: records
    });
    console.log(this.data.timeLineRecords)

    this.page = this.page+1;
  },

  getTimeLinesListDOM : function(){
      let self = this;
      if (this.totalPage && this.totalPage < this.page) {
        this.setData({
          isNoMore: true
        })
        return;
      } 
      this.setData({
        loading: true
      })
      this.getTimelineList(this.contactId, this.page, '0;2' ).then(function (res) {
        //self.page = self.page+1;
        self.totalPage = res.data.totalPages
        self.getTimeLines(res);
        self.setData({
          loading: false,
          totalCount: res.data.totalCount
        })
      });
  },

  onLoad: function (options) {
    let self = this;
    this.contactId = options.contactId;
    this.contactType = options.contactType;
    this.companyId = options.contactId;

    this.getCompanyDetailInfo(this.companyId).then(function(res){
        self.setData({
          base: res.data.base,
          contact: res.data.contact,
          social: res.data.social
        });
        self.getTimeLinesListDOM();
        //actionType 2 私信 0 是@ , 只关注0,2 两个socialType
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getTimeLinesListDOM();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
}



const mapStateToData = ({ contact }) => ({
  contact
});

const mapDispatchToPage = dispatch => ({
  getTimelineList: bindActionCreators(getTimelineList, dispatch),
  getCompanyDetailInfo : bindActionCreators(getCompanyDetailInfo, dispatch),
  getMailInfo: bindActionCreators(getMailInfo, dispatch),
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(companyDetail);
Page(auth.filter(nextPageConfig));