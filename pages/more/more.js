// pages/more/more.js
const auth = require('../../utils/filter.js');
const wxCharts = require('../../utils/wxcharts.js');
import { bindActionCreators } from '../../libs/redux.js';
import { enhancedConnect } from '../../libs/enhancedConnect.js';
const basicConfig = require('../../utils/config.js');
import { doLogout, getLastThirtyFlowSurvey, getMarketingMailStatistics, getStatisticsData, setLoading } from '../../actions/more.js';
import { formatSecond } from '../../utils/global.js'

let lineChart = null;
const more = {
  data: {
    FlowSurveyList: {
      sumPv:0,
      sumUv:0,
      averageUvTime:0,
      averagePvNum:0
    },
    MarketingMailList:{
      total:0,
      arrivePer:0,
      readPer:0,
      hitPer:0
    },
    loading:false,
  },
  onShow: function (e) {
      this.setData({
        loading: true
      })
      //获取最近30天流量概览数据
      this.getLastThirtyFlowSurvey({"recentDays":30,"platform":0}).then(res=>{
        if (res && res.data){
          this.setData({
            FlowSurveyList: {
              sumPv: res.data.sumPv,
              sumUv: res.data.sumUv,
              averageUvTime: formatSecond(res.data.averageUvTime),
              averagePvNum: res.data.averagePvNum
            },
          })
        }
      });

      //获取营销邮件统计数据
      this.getMarketingMailStatistics().then(res => {
          this.setData({
            MarketingMailList: {
              total: res.data.total,
              arrivePer: res.data.arrivePer,
              readPer: res.data.readPer,
              hitPer: res.data.hitPer
            }
          })
      });
      
      //获取独立访客和浏览次数数据
      this.getStatisticsData({ "recentDays": 7, "platform": 0 }).then(res => {
        if (res && res.data){
          let timeArr = []
          let pvArr = []
          let uvArr = []
          let uvsList = res.data.uvs
          for (let key in uvsList) {
            timeArr.push(uvsList[key].date.substring(5,11))
            pvArr.push(uvsList[key].pv)
            uvArr.push(uvsList[key].uv)
          }
          //创建图表
          let windowWidth = 320;
          let windowHeight = 200;
          try {
            let res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }
          lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: timeArr,
            animation: true,
            legend:{
              layout: 'horizontal',
              backgroundColor: '#FFFFFF',
              floating: true,
              align: 'right',
              verticalAlign: 'top',
              x: 90,
              y: 45,
            },
            series: [{
              name: '独立访客（UV）',
              data: uvArr,
            }, {
              name: '浏览次数（PV）',
              data: pvArr,
            }],
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              title: null,
              min: 0
            },
            width: windowWidth,
            height: windowHeight,
            dataLabel: false,
            dataPointShape: true,
            extra: {
              lineStyle: 'curve'
            }
          });
          this.setData({
            loading: false
          })
        }
      });
    },
    //事件处理函数
    bindLogout: function () {
        this.doLogout()
    },

    //鼠标点击图表时显示的数据
    touchHandler: function (e) {
      lineChart.showToolTip(e, {
        format: function (item, category) {
          return category + ' ' + item.name + ':' + item.data
        }
      });
    }
}
const mapStateToData = ({ more }) => ({
  more
});

const mapDispatchToPage = dispatch => ({
  doLogout: bindActionCreators(doLogout, dispatch),
  getLastThirtyFlowSurvey: bindActionCreators(getLastThirtyFlowSurvey, dispatch),
  getMarketingMailStatistics: bindActionCreators(getMarketingMailStatistics, dispatch),
  getStatisticsData: bindActionCreators(getStatisticsData, dispatch)
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(more);
Page(auth.filter(nextPageConfig));
