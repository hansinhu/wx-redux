// pages/home/home.js
const auth = require('../../utils/filter.js');
import { bindActionCreators } from '../../libs/redux.js';
import { enhancedConnect } from '../../libs/enhancedConnect.js';
import { getOverview, getActionList, setActionList, emptyList, setNoMore, setLoading} from '../../actions/home.js';

const home = {
    data: {
        flowData:{
            addContactCount:0,
            msgProductCount: 0,
            sumUv: 0
        },
        page: 1,
        size: 10
    },
    onLoad: function () {
        this.emptyList([]);
        this.getDynamic();
    },
    onShow: function () {
        this.getFlowCount();
    },
    getFlowCount: function () {
        this.getOverview({ recentDays: 30, platform: 0 }).then(res => {
            if (res.code == 0) {
                this.setData({
                    flowData: res.data
                })
            }
        });
    },
    getDynamic: function(type) {
        if (type == 1) {
            this.emptyList([]);      //下拉刷新时需要将page重置为1
            this.setNoMore(false);
            this.setData({ page: 1 }); 
        }else {
            this.setLoading(true);   //除了下拉刷新都需要上拉加载的效果
        }
        let pageConfig = {
            page: this.data.page,
            size: this.data.size
        }
        this.getActionList(pageConfig)
    },
    onPullDownRefresh() {   //下拉刷新 
        this.setNoMore(false);
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.getDynamic(1);
    },
    onReachBottom: function () {  //上拉加载
        if (this.data.home.noMore) return;
        let nextPage = this.data.page + 1;
        this.setData({ page: nextPage })
        this.getDynamic();
    },
    goDetail: function (event) {
        let contactId = event.currentTarget.dataset.item.contactId;
        let contactType = event.currentTarget.dataset.item.contactType;
        let readFlag = event.currentTarget.dataset.item.readFlag;
        let actionList = this.data.home.actionList;
        if (readFlag == 0){
            this.emptyList([]);
            for (let i = 0; i < actionList.length; i++) {
                if (actionList[i].contactId == contactId) {
                    actionList[i].readFlag = 1;
                }
            }
            this.emptyList([]);
            this.setActionList(actionList)
        }
        wx.navigateTo({
            url: '/pages/contact/contactDetail/contactDetail?contactId=' + contactId + '&contactType=' + contactType
        })
    }
}

const mapStateToData = ({ home }) => ({
    home
});

const mapDispatchToPage = dispatch => ({
    getOverview: bindActionCreators(getOverview, dispatch),
    getActionList: bindActionCreators(getActionList, dispatch),
    setNoMore: bindActionCreators(setNoMore, dispatch),
    setLoading: bindActionCreators(setLoading, dispatch),
    emptyList: bindActionCreators(emptyList, dispatch),
    setActionList: bindActionCreators(setActionList, dispatch)
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(home);
Page(auth.filter(nextPageConfig));