//index.js
//获取应用实例
const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';
import { getCompanyList, clearReduxList, deletContactCompany} from '../../../actions/contact.js';

const companySearch = {
  data: {
    inputShowed: true,
    inputVal: "",
    isNoMore:false,
    hidden: true,
    deletName: '',
    deletId: '',
    params: {
      page: 1,
      size: 15,
      keyword: '',
      tagIds: ''
    },
    isNoMore: false,
    loading: false
  },
  onLoad: function (options) {
    if (options.tagIds) {
      this.setData({
        'params.tagIds': options.tagIds
      })
      this.getList(this.data.params)
    }else{
      this.clearReduxList('companySearch')
    }
    //this.getContactList();
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getList: function (params) {
    this.setData({
      loading: true
    })
    params.keyword = params.keyword.trim();
    if (!params.keyword) return;
    this.getCompanyList(params).then((res) => {
      this.setData({
        loading: false
      })
      if (res && res.data && res.data.records) {
        let records = res.data.records;
        let isNoMore = records.length < params.size;
        this.setData({
          isNoMore: isNoMore
        })
      }
    });
  },

  onReachBottom: function () {
    if (this.data.isNoMore) return;
    let page = this.data.params.page + 1;
    this.setData({
      "params.page": page
    })
    this.getList(this.data.params)
  },

  toUserDetail(e) {
    // wx.navigateTo({
    //   url: './contactDetail/contactDetail?id=' + e.currentTarget.dataset.id,
    // })
  },

  editUser: function (e) {
    wx.navigateTo({
      url: './contactDetail/contactDetail?id=' + e.currentTarget.dataset.id,
    })
    //console.log(e.currentTarget.dataset.id)
  },
  addUser: function () {
    wx.navigateTo({
      url: './contactAdd/contactAdd'
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
        this.getCompanyList(this.data.params)
      }
    })
    this.setData({
      hidden: true
    });
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
    this.setData({
      inputVal: e.detail.value,
      'params.keyword': e.detail.value,
    });
    if (e.detail.value) {
      this.getList(this.data.params)
    }
  },
}

const mapStateToData = ({ contact }) => ({
  contact
});

const mapDispatchToPage = dispatch => ({
  getCompanyList: bindActionCreators(getCompanyList, dispatch),
  deletContactCompany: bindActionCreators(deletContactCompany, dispatch),
  clearReduxList: bindActionCreators(clearReduxList, dispatch),
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(companySearch);
Page(auth.filter(nextPageConfig));