const auth = require('../../utils/filter.js');
import { bindActionCreators } from '../../libs/redux.js';
import { enhancedConnect } from '../../libs/enhancedConnect.js';
import { getMessageList, getRead, setLoading} from '../../actions/message.js';
const combine = require('../../libs/combine.js').default;
import { formatDate } from '../../utils/global.js'

const message = {
  data: {
    inputConfig: {
      placeHolder: '发件人/邮件标题',
      linkTo: './searchMessage/searchMessage',
    },
    messageList: [],
    nullConent: false,//暂无数据的显示与否
    getParams: {
      page: 1,
      size: 10
    }
  },
  onShow: function (e) {
    this.setLoading(true);
    this.getMessageList(this.data.getParams)
      .then(res => {
        if (res.code == 0 && res.data.records) {
          let records = res.data.records;
          let isNoMore = records.length < this.data.getParams.size;
          this.setData({
            isNoMore: isNoMore
          });
     
          this.setData({
            nullConent: false,
            // messageList: records
          });
        } else {
          this.setData({
            nullConent: true,
            messageList: []
          });
        }
      })
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
  //下拉加载
  onPullDownRefresh: function () {
    this.setLoading(true);
    wx.showNavigationBarLoading()
    this.getMessageList({ page: 1, size: 10 }).then(res => {
      if (res && res.data && res.data.records) {
        this.setData({
          nullConent: false,
          messageList: res.data.records
        });
      } else {
        this.setData({
          nullConent: true,
          messageList: []
        });
      }
    });
  },
  //上拉page+1
  onReachBottom: function () {
    this.setLoading(true);
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let page = this.data.getParams.page + 1;
    this.setData({
      "getParams.page": page
    })
    this.getMessageList(this.data.getParams).then(res =>{
      if (res && res.data && res.data.records){
        let records = res.data.records;
        let isNoMore = records.length < this.data.getParams.size;
        this.setData({
          isNoMore: isNoMore
        });
      } else {
        this.setData({
          nullConent: true,
          messageList: []
        });
      }
    });
  },
  onReady: function () {
  },


}

const mapStateToData = ({ message }) => ({
  message
});
const mapDispatchToPage = dispatch => ({
  getMessageList: bindActionCreators(getMessageList, dispatch),
  getRead: bindActionCreators(getRead, dispatch),
  setLoading: bindActionCreators(setLoading, dispatch),

});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(message);
Page(auth.filter(nextPageConfig));