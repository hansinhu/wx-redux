
const fly = require('../utils/fly.js').default;
import { emptyList } from './home.js';

//退出登陆
export function doLogout() {
    return (dispatch, getState) => {
        return fly.get('/bshop/logout', {})
            .then(res => {
                if (res.code == 0) {
                    wx.clearStorageSync();
                    dispatch(emptyList([]));
                    wx.reLaunch({ url: '../../pages/login/login' })
                }
            })
            .catch(err => {
                console.error(`Request Error: `, err);
            });
    }
}

//获取最近30天流量概览
export function getLastThirtyFlowSurvey(params) {
  return (dispatch, getState) => {
    return fly.get('/bshop/statistics/website/trafficOverview', params || {})
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}

//获取独立访客和浏览次数
export function getStatisticsData(params) {
  return (dispatch, getState) => {
    return fly.get('/bshop/statistics/home/website', params || {})
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}

//获取营销邮件统计
export function getMarketingMailStatistics(params) {
  return (dispatch, getState) => {
    return fly.get('/bshop/index/mail/marketing/statistic/overall', params || {})
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}


