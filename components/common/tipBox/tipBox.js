// components/common/tipBox/tipBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showError:{
      type: Boolean,
      value:false,
      observer:function(isShow){
        this.setData({
          show: isShow
        })
        if (isShow){
          setTimeout(() => {
            this.hideTipBox()
          }, 2000)
        }
      }
    },
    errorText:{
      type: String,
      value: '错误提示'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
       //隐藏错误提示
      hideTipBox:function(e){
          this.setData({
              showError: false,
              errorText: ''
          })
      }
  }
})
