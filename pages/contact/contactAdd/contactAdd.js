//index.js
//获取应用实例
const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js'; 
import { addContactUser, detailContactUser, updateContactUser } from '../../../actions/contact.js';
const combine = require('../../../libs/combine.js').default;

const contactAdd = {
  data: {
    updata:false, //添加 or 编辑
    updataId: null,
    params:{
      firstName:'',
      lastName:'',
      position:'',
      email:'',
      mails:[],
      mobilePhone:'',
      telephones:[],
    },
    showError:false,
    errorText:'',
    focusFirstName: false,
    focusLastName: false,
    focusPosition: false,
    focusEmail: false,
    focusMobile: false
  },

  

  
  onLoad: function (options) {
    if(options.id){
      this.setData({
        updata:true,
        updataId: options.id
      })
      this.detailContactUser({personId: options.id}).then((res)=>{
        if(res && res.data){
          let data = res.data;
          let params = {
            firstName: data.base.firstName || '',
            lastName: data.base.lastName || '',
            position: data.base.position || '',
            email: data.contact.mail ||'',
            mails: [],
            mobilePhone: data.contact.mobilePhone || ''
          }
          this.setData({
            params
          })
        }
      })
    }else{
      this.setData({
        updata: false
      })
    }
  },

  inputTyping:function(e){
    let name = e.target.dataset.name;
    let value = e.detail.value;
    let params = this.data.params;
    params[name] = value;
    this.setData({
      params: params
    })
  },
  messageTip: function (res,updata) {
    if (res && res.code == 0) {
      wx.showToast({
        title: updata?'修改成功':'添加成功',
        icon: 'success',
        duration: 3000
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000)
    } else {
      this.setData({
        showError: true,
        errorText: res.message
      })
    }
  },
  
  subUser:function(e){
    if (e.target.dataset.name && e.target.dataset.name == 'mobilePhone'){
      this.setData({
        'params.mobilePhone': e.detail.value.trim()
      })
    }

    let { firstName, email, mobilePhone } = this.data.params;
    if (!firstName){
      this.setData({
        showError: true,
        errorText: 'FirstName 不为空'
      })
      return;
    }else if (email){
      let emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if(emailReg.test(email)){
        let arr = JSON.stringify([{ type: 0, mail: email}])
        this.setData({
          "params.mails":arr
        })
      }else{
        this.setData({
          showError: true,
          errorText: '请输入正确的邮箱'
        })
        return;
      }
    }

    if (mobilePhone ) {
      let obj = { type: 0, telephone: mobilePhone}
      let arr = JSON.stringify([obj])
      this.setData({
        "params.telephones": arr
      })
    }

    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 3000
    });

    if(this.data.updata){ //调用更新接口
      let updataParams = this.data.params;
      updataParams.contactId = this.data.updataId;
      updataParams.mail = updataParams.email;
      this.updateContactUser(updataParams).then((res) => {
        this.messageTip(res,true)
      })
    }else{  //调用新增接口
      this.addContactUser(this.data.params).then((res) => {
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
      case 'firstName':
        this.setData({
          focusFirstName: false,
        })
        break;
      case 'lastName':
        this.setData({
          focusLastName: false,
        })
        break;
      case 'position':
        this.setData({
          focusPosition: false,
        })
        break;
      case 'email':
        this.setData({
          focusEmail: false,
        })
        break;
      case 'mobilePhone':
        this.setData({
          focusMobile: false
        })
        break;
    }
  },

  showInput: function (e) {
    var name = e.target.dataset.name
    switch (name) {
      case 'firstName':
        this.setData({
          focusFirstName: true,
          focusLastName: false,
          focusPosition: false,
          focusEmail: false,
          focusMobile: false
        })
        break;
      case 'lastName':
        this.setData({
          focusFirstName: false,
          focusLastName: true,
          focusPosition: false,
          focusEmail: false,
          focusMobile: false
        })
        break;
      case 'lastName':
        this.setData({
          focusFirstName: false,
          focusLastName: true,
          focusPosition: false,
          focusEmail: false,
          focusMobile: false
        })
        break;
      case 'position':
        this.setData({
          focusFirstName: false,
          focusLastName: false,
          focusPosition: true,
          focusEmail: false,
          focusMobile: false
        })
        break;
      case 'email':
        this.setData({
          focusFirstName: false,
          focusLastName: false,
          focusPosition: false,
          focusEmail: true,
          focusMobile: false
        })
        break;
      case 'mobilePhone':
        this.setData({
          focusFirstName: false,
          focusLastName: false,
          focusPosition: false,
          focusEmail: false,
          focusMobile: true
        })
        break;
    }
  },
  next: function (e) {
      let name = e.target.dataset.name;
      switch (name) {
          case 'firstName':
              this.setData({
                  focusFirstName: false,
                  focusLastName: true,
                  focusPosition: false,
                  focusEmail: false,
                  focusMobile: false
              })
              break;
          case 'lastName':
              this.setData({
                  focusFirstName: false,
                  focusLastName: false,
                  focusPosition: true,
                  focusEmail: false,
                  focusMobile: false
              })
              break;
          case 'position':
              this.setData({
                  focusFirstName: false,
                  focusLastName: false,
                  focusPosition: false,
                  focusEmail: true,
                  focusMobile: false
              })
              break;
          case 'email':
              this.setData({
                  focusFirstName: false,
                  focusLastName: false,
                  focusPosition: false,
                  focusEmail: false,
                  focusMobile: true
              })
              break;
      }
  },
}

const mapStateToData = ({ contact }) => ({
  contact
});

const mapDispatchToPage = dispatch => ({
  addContactUser: bindActionCreators(addContactUser, dispatch),
  detailContactUser: bindActionCreators(detailContactUser, dispatch),
  updateContactUser: bindActionCreators(updateContactUser, dispatch),
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(contactAdd);
Page(auth.filter(nextPageConfig));