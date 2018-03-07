//index.js
//获取应用实例
const auth = require('../../utils/filter.js');
import { bindActionCreators } from '../../libs/redux.js';
import { enhancedConnect } from '../../libs/enhancedConnect.js';   
import { getCompanyList, showCompanyItem, deletContactCompany } from '../../actions/contact.js';

const company = {
  data: {
    inputConfig: {
      placeHolder: '请输入公司名称',
      linkTo: './companySearch/companySearch',
    },
    startLeft: 0,
    endLeft: 1,
    offsetLeft: 0,
    nowLeft: 0,
    isClick: true,
    hidden: true,
    deletName: '',
    params:{
      page: 1,
      size: 15,
      keyword:'',
      tagIds:''
    },
    isNoMore:false,
    loading: false
  },
  // onLoad: function () {
  //   this.setData({
  //     params: {
  //       page: 1,
  //       size: 15,
  //       keyword: '',
  //       tagIds: ''
  //     }
  //   })
  //   this.getList(this.data.params);
  // },
  onShow: function () {
    this.setData({
      params: {
        page: 1,
        size: 15,
        keyword: '',
        tagIds: ''
      }
    })
    this.getList(this.data.params);
  },

  getList:function(pramas){
    this.setData({
      loading: true
    })
    this.getCompanyList(pramas).then((res) => {
      if (res && res.data && res.data.records) {
        let records = res.data.records;
        let isNoMore = records.length < this.data.params.size;
        this.setData({
          isNoMore: isNoMore,
          loading: false
        })
      }
    });
  },

  onPullDownRefresh: function () {
      wx.showNavigationBarLoading()
    this.setData({
      params: {
        page: 1,
        size: 15,
        keyword: '',
        tagIds: ''
      }
    })
    this.getList(this.data.params);
  },
  onReachBottom: function () {
    if (this.data.isNoMore) return;
    let page = this.data.params.page + 1;
    this.setData({
      "params.page": page
    })
    this.getList(this.data.params);
  },

  toUserDetail(e) {
    // wx.navigateTo({
    //   url: './contactDetail/contactDetail?id=' + e.currentTarget.dataset.id,
    // })
  },

  editUser: function (e) {
    wx.navigateTo({
      url: './companyAdd/companyAdd?id=' + e.currentTarget.dataset.editid,
    })
  },
  addUser: function () {
    wx.navigateTo({
      url: './companyAdd/companyAdd'
    })
  },

  deletCompany: function (e) {
    let item = e.detail
    this.setData({
      deletName: item.name + '？',
      deletId: item.companyId,
      hidden: false
    })
  },

  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  confirm: function () {
    let deletCompany = [{
      contactsId: this.data.deletId,
      contactsType: 1
    }]
    let param = {
      contactses: JSON.stringify(deletCompany)
    }
    this.deletContactCompany(param).then((res) => {
      if (res.code == 0) {
        //暂时用refresh,可优化：改变redux的数据
        this.getList(this.data.params);
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
  getCompanyList: bindActionCreators(getCompanyList, dispatch),
  showCompanyItem: bindActionCreators(showCompanyItem, dispatch),
  deletContactCompany: bindActionCreators(deletContactCompany, dispatch),
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(company);
Page(auth.filter(nextPageConfig));