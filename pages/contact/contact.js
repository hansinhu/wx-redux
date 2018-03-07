//index.js
//获取应用实例
const auth = require('../../utils/filter.js');
import { bindActionCreators } from '../../libs/redux.js';
import { enhancedConnect } from '../../libs/enhancedConnect.js'; 
import { getContactList, showStyleItem, deletContactUser} from '../../actions/contact.js';

const contact = {
  data: {
    inputConfig: {
      placeHolder: '请输入联系人姓名',
      linkTo: './contactSearch/contactSearch',
    },
    startLeft: 0,
    endLeft: 1,
    offsetLeft:0,
    nowLeft:0,
    isClick: true,
    hidden: true,
    deletName:'',
    getParams:{
      page: 1,
      size: 10,
      keyword:''
    },
    isNoMore:false,
    loading:false,
  },

  initData(){
    this.setData({
      getParams: {
        page: 1,
        size: 10,
        keyword: ''
      }
    })
  },
  // onLoad: function (options) {
  //   this.initData()
  //   this.getList(this.data.getParams)
  // },
  onShow: function (options) {
    this.initData()
    this.getList(this.data.getParams)
  },
  onPullDownRefresh:function(){
      wx.showNavigationBarLoading()
    this.setData({
      getParams: {
        page: 1,
        size: 10,
        keyword: ''
      }
    })
    this.getList(this.data.getParams)
  },
  getList:function(params){
    this.setData({
      loading: true
    })
    this.getContactList(params).then((res) => {
      if (res && res.data && res.data.records) {
        let records = res.data.records;
        let isNoMore = records.length < params.size;
        this.setData({
          isNoMore: isNoMore,
          loading: false
        })
      }
    });
  },

  onReachBottom:function(){
    if (this.data.isNoMore) return;
    let page = this.data.getParams.page + 1;
    this.setData({
      "getParams.page": page
    })
    this.getList(this.data.getParams)
  },

  toUserDetail(e){
    // wx.navigateTo({
    //   url: './contactDetail/contactDetail?id=' + e.currentTarget.dataset.id,
    // })
  },

  editUser:function(e){
    wx.navigateTo({
      url: './contactAdd/contactAdd?id=' + e.currentTarget.dataset.editid,
    })
    //console.log(e.currentTarget.dataset.id)
  },
  addUser:function(){
    wx.navigateTo({
      url: './contactAdd/contactAdd'
    })
  },

  deletUser: function (e) {
    let item = e.detail
    this.setData({
      deletName: item.name+'？',
      deletId: item.personId,
      hidden: false
    })
  },
  
  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  confirm: function () {
    this.deletContactUser({ contactIds: this.data.deletId}).then((res)=>{
      if(res.code == 0){
        //暂时用refresh,可优化：改变redux的数据
        this.initData()
        this.getList(this.data.getParams)
      }
    })
    this.setData({
      hidden: true
    });
  }
}

const mapStateToData = ({ contact }) => ({
  contact
});

const mapDispatchToPage = dispatch => ({
  getContactList: bindActionCreators(getContactList, dispatch),
  showStyleItem: bindActionCreators(showStyleItem, dispatch),
  deletContactUser: bindActionCreators(deletContactUser, dispatch)
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(contact);
Page(auth.filter(nextPageConfig));