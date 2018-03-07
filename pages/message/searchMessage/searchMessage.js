//index.js
//获取应用实例
const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';
import { getMessageList, getRead } from '../../../actions/message.js';
import { formatDate2 } from '../../../utils/global.js'

const searchMessage = {
  data: {
    inputShowed: true,
    inputVal: "",
    hidden: true,
    params: {
      page: 1,
      size: 20,
      keyword: '',
    },
    tagName: '',
    messageList: [],
    loading: false,
    noCon:false,
    isNoMore:true
  },
  onLoad: function (options) {

  },
  getList: function (params) {
    this.getMessageList(params).then((res) => {
      if (res && res.data && res.data.records) {
        console.log(res.data.records)
        this.setData({
          noCon: false
        });
        let records = res.data.records;
        // let isNoMore = records.length < params.size;
        records.forEach((item, index) => {
          records[index].sentTime = item.sentTime? formatDate2(item.sentTime):'';
          if (item.sender.avatar) {
            records[index].avatar = item.sender.avatar;
          }
        })
        this.setData({
          messageList: records,
          loading: false
        });
        if (records.length < params.size){
          this.setData({
            isNoMore: true
          });
        } else {
          this.setData({
            isNoMore: false
          });
        }
        
      }else{
        this.setData({
          noCon: true,
          messageList: [],
          loading: false,
          isNoMore: false
        });
      }
    });
  },

  onReachBottom: function () {
    console.log('========')
    if (this.data.isNoMore) return;
    let page = this.data.params.page + 1;
    this.setData({
      "params.page": page,
      loading: true
    })
    this.getList(this.data.params)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    wx.navigateBack()
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
      if (e.detail.value.trim()) {
        this.setData({
        inputVal: e.detail.value,
        'params.keyword': e.detail.value.trim(),
        'params.page': 1,
        loading: true,
        noCon: false,
        isNoMore: false,
        });
    
       this.getList(this.data.params)
    }
  },
  touchendFn: function (e) {
    wx.setStorage({
      key: "mid",
      data: e.currentTarget.id
    })
    this.getRead({ receiveId: e.currentTarget.id })
    // wx.navigateTo({
    //   url: './contactDetail/contactDetail?id=' + e.currentTarget.id,
    // })
  },
}

const mapStateToData = ({ message }) => ({
    message
});

const mapDispatchToPage = dispatch => ({
  getMessageList: bindActionCreators(getMessageList, dispatch),
  getRead: bindActionCreators(getRead, dispatch),

});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(searchMessage);
Page(auth.filter(nextPageConfig));

