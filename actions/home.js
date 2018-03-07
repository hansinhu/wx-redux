
const fly = require('../utils/fly.js').default;
import { formatDate } from '../utils/global.js'
const basicConfig = require('../utils/config.js')

export const actionTypes = {
    ACTION_LIST: 'ACTION_LIST',
    IS_EMPTY: 'IS_EMPTY',
    NO_MORE: 'NO_MORE',
    SET_LOADING: 'SET_LOADING',
    EMPTY_LIST: 'EMPTY_LIST',
};

export function setActionList(actionList) {
    return {
        type: actionTypes.ACTION_LIST,
        actionList
    }
}
export function setEmpty(isEmpty) {
    return {
        type: actionTypes.IS_EMPTY,
        isEmpty
    }
}
export function setNoMore(noMore) {
    return {
        type: actionTypes.NO_MORE,
        noMore
    }
}

export function setLoading(loading) {
    return {
        type: actionTypes.SET_LOADING,
        loading
    }
}

export function emptyList(actionList) {
    return {
        type: actionTypes.EMPTY_LIST,
        actionList
    }
}

//流量概览
export function getOverview(params) {
    return (dispatch, getState) => {
        return fly.get('/bshop/statistics/website/trafficOverview', params || {})
            .catch(err => {
                console.error(`Request Error: `, err);
            });
    }
}

//查询联系人最近动态
export function getActionList(params) {
    return (dispatch, getState) => {
        dispatch(setNoMore(false));
        dispatch(setEmpty(false));
        return fly.get('/bshop/contacts/timeline/getLatestAction', params || {})
            .then(res => {
                dispatch(setLoading(false));
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
                if (res.code == 0) {
                    if (res.data.totalCount == 0) {
                        dispatch(setEmpty(true));
                    }else {
                        let records = res.data.records;
                        if (records.length == 0) {
                            dispatch(setNoMore(true));
                        }else {
                            records.forEach((item, index) => {
                                records[index]['formatTime'] = formatDate(item.createTime);
                                records[index]['socialContent'] = JSON.parse(item.socialContent);
                            })
                            dispatch(setActionList(res.data.records));
                        }
                    }
                }
            })
            .catch(err => {
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
                dispatch(setLoading(false));
                dispatch(setEmpty(true));
                console.error(`Request Error: `, err);
            });
    }
}
