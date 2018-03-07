//index.js
//获取应用实例
const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';   //相当于react-redux 之所以不用react-redux是因为它依赖的太多了，所以网上找了替代的 
//var base64 = require("../../libs/base64");
import { addContactCompany, getCompanyDetailInfo, updateContactCompany } from '../../../actions/contact.js';
//import productItem from '../../components/productItem/productItem.js'
const combine = require('../../../libs/combine.js').default;

const contactAdd = {
  data: {
    updata: false, //添加 or 编辑
    updataId: null,
    params: {
      name: '',
      url: '',
      mainProduct: '',
      mail: '',
      mails: []
    },
    showError: false,
    errorText: '',
    focusName: false,
    focusUrl: false,
    focusProduct: false,
    focusMail: false,
  },
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        updata: true,
        updataId: options.id
      })
      this.getCompanyDetailInfo( options.id ).then((res) => {
        if (res && res.data) {
          let data = res.data;
          let params = {
            name: data.base.name || '',
            url: data.base.url||'',
            mainProduct: data.base.mainProduct||'',
            mail: data.contact.mail || '',
            mails: []
          }
          this.setData({
            params
          })
        }
      })
    } else {
      this.setData({
        updata: false
      })
    }
  },

  inputTyping: function (e) {
    let name = e.target.dataset.name;
    let value = e.detail.value;
    let params = this.data.params;
    params[name] = value;
    this.setData({
      params: params
    })
  },
  messageTip:function(res,update){
    if (res && res.code == 0) {
      wx.showToast({
        title: update?'修改成功':'添加成功',
        icon: 'success',
        duration: 3000
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
        // wx.navigateTo({
        //   url: '/pages/company/company',
        // })
      }, 1000)
    } else {
      this.setData({
        showError: true,
        errorText: res.message
      })
    }
  },

  subUser: function (e) {
    if (e.target.dataset.name && e.target.dataset.name == 'mail') {
      this.setData({
        'params.mail': e.detail.value
      })
    }

    let { name, mail, url } = this.data.params;
    if (!name) {
      this.setData({
        showError: true,
        errorText: 'Name 不为空'
      })
      return;
    } 
    if (mail) {
      let mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (mailReg.test(mail)) {
        let arr = [{ type: 0, mail: mail }]
        this.setData({
          "params.mails": arr
        })
      } else {
        this.setData({
          showError: true,
          errorText: '请输入正确的邮箱'
        })
        return;
      }
    }
    if (url) {
      let urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!urlReg.test(url)) {
        this.setData({
          showError: true,
          errorText: '请输入正确官网地址'
        })
        return;
      }
    }
    if (this.data.updata) {
      let updataParams = this.data.params;
      updataParams.companyId = this.data.updataId;
      updataParams.mail = updataParams.mail;
      if (!updataParams.mainProduct){
        delete updataParams.mainProduct
      }
      this.updateContactCompany(updataParams).then((res) => {
        this.messageTip(res,true)
      })
    }else{
      this.addContactCompany(this.data.params).then((res) => {
        this.messageTip(res,false)
      })
    }
  },
  inputBlur: function (e) {
    let name = e.target.dataset.name;
    let value = e.detail.value.trim();
    let params = this.data.params;
    params[name] = value;
    this.setData({
      params: params
    })

    //var name = e.target.dataset.name
    switch (name) {
      case 'name':
        this.setData({
          focusName: false,
        })
        break;
      case 'url':
        this.setData({
          focusUrl: false,
        })
        break;
      case 'mainProduct':
        this.setData({
          focusProduct: false,
        })
        break;
      case 'mail':
        this.setData({
          focusMail: false
        })
        break;
    }
  },

  showInput: function (e) {
    var name = e.target.dataset.name
    switch (name) {
      case 'name':
        this.setData({
          focusName: true,
          focusUrl: false,
          focusProduct: false,
          focusMail: false,
        })
        break;
      case 'url':
        this.setData({
          focusName: false,
          focusUrl: true,
          focusProduct: false,
          focusMail: false,
        })
        break;
      case 'mainProduct':
        this.setData({
          focusName: false,
          focusUrl: false,
          focusProduct: true,
          focusMail: false,
        })
        break;
      case 'mail':
        this.setData({
          focusName: false,
          focusUrl: false,
          focusProduct: false,
          focusMail: true,
        })
        break;
    }
  },
  next: function (e) {
    let name = e.target.dataset.name;
    switch (name) {
      case 'name':
        this.setData({
          focusName: false,
          focusUrl: true,
          focusProduct: false,
          focusMail: false,
        })
        break;
      case 'url':
        this.setData({
          focusName: false,
          focusUrl: false,
          focusProduct: true,
          focusMail: false,
        })
        break;
      case 'mainProduct':
        this.setData({
          focusName: false,
          focusUrl: false,
          focusProduct: false,
          focusMail: true,
        })
        break;
    }
  },
}

const mapStateToData = ({ contact }) => ({
  contact
});

const mapDispatchToPage = dispatch => ({
  addContactCompany: bindActionCreators(addContactCompany, dispatch),
  getCompanyDetailInfo: bindActionCreators(getCompanyDetailInfo, dispatch),
  updateContactCompany: bindActionCreators(updateContactCompany, dispatch),
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(contactAdd);
Page(auth.filter(nextPageConfig));