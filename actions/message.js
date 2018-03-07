const fly = require('../utils/fly.js').default;
import { formatDate2 } from '../utils/global.js'
export const actionTypes = {
  MESSAGE_LIST: 'MESSAGE_LIST',
  PUSH_MESSAGE_LIST:'PUSH_MESSAGE_LIST',
  SET_LOADING: 'SET_LOADING',
  NO_SEARCH: 'NO_SEARCH',
};
export function setMessageList(messageList) {
  return {
    type: actionTypes.MESSAGE_LIST,
    messageList
  }
}

export function pushMessageList(messageList) {
  return {
    type: actionTypes.PUSH_MESSAGE_LIST,
    messageList
  }
}
export function setLoading(loading) {
  return {
    type: actionTypes.SET_LOADING,
    loading
  }
}
export function setNoSearch(noSearch) {
    return {
        type: actionTypes.NO_SEARCH,
        noSearch
    }
}

//获取message列表 getMessageList
export function getMessageList(params) {
  return (dispatch, getState) => {
    return fly.post('/bshop/inbox/mail/page', params || {})
      .then(res => {
        let sendRes = JSON.parse(JSON.stringify(res))
        dispatch(setLoading(false));
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        if (res.code == 0 && res.data) {
            if (res.data.totalCount == 0) {
                dispatch(setNoSearch(true));
            }
            let records = res.data.records || [];
              records.forEach((item, index) => {
                records[index].sentTime = formatDate2(item.sentTime);
              })
              if (params.page>1){
                dispatch(pushMessageList(records));
              }else{
                
                dispatch(setMessageList(records));
              }
        } else {
          dispatch(setMessageList([]));
          dispatch(setNoSearch(true));
        }
        //继续传递到页面
        return new Promise((resolve, reject) => {
          resolve(sendRes);
        })
      })
      .catch(err => {
        dispatch(setLoading(false));
        console.error(`Request Error: `, err);
      });
  }
}
export function getRead(params) {
  return (dispatch, getState) => {
    return fly.post('/bshop/inbox/mail/read', params || {})
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}
