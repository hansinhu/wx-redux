const fly = require('../utils/fly.js').default;
import { lightKeyword } from '../utils/global.js'

export const actionTypes = {
  CONTACT_LIST: 'CONTACT_LIST',
  PUSH_CONTACT_LIST: 'PUSH_CONTACT_LIST',
  SEARCH_CONTACT_LIST: 'SEARCH_CONTACT_LIST',
  PUSH_SEARCH_CONTACT_LIST: 'PUSH_SEARCH_CONTACT_LIST',
  LABEL_LIST: 'LABEL_LIST',
  LIST_SHOW: 'LIST_SHOW',
  LIST_STYLE: 'LIST_STYLE',
  COMPANY_LIST:'COMPANY_LIST',
  PUSH_COMPANY_LIST: 'PUSH_COMPANY_LIST',
  SEARCH_COMPANY_LIST: 'SEARCH_COMPANY_LIST',
  PUSH_SEARCH_COMPANY_LIST: 'PUSH_SEARCH_COMPANY_LIST',
  COMPANY_LIST_STYLE: 'COMPANY_LIST_STYLE',
};

export function setContactList(contactList) {
  return {
    type: actionTypes.CONTACT_LIST,
    contactList
  }
}

export function setCompanyList(companyList) {
  return {
    type: actionTypes.COMPANY_LIST,
    companyList
  }
}

export function pushContactList(contactList) {
  return {
    type: actionTypes.PUSH_CONTACT_LIST,
    contactList
  }
}


export function pushCompanyList(companyList) {
  return {
    type: actionTypes.PUSH_COMPANY_LIST,
    companyList
  }
}

export function setContactSearchList(contactList) {
  return {
    type: actionTypes.SEARCH_CONTACT_LIST,
    contactList
  }
}


export function setCompanySearchList(companyList) {
  return {
    type: actionTypes.SEARCH_COMPANY_LIST,
    companyList
  }
}



export function pushContactSearchList(contactList) {
  return {
    type: actionTypes.PUSH_SEARCH_CONTACT_LIST,
    contactList
  }
}

export function pushCompanySearchList(companyList) {
  return {
    type: actionTypes.PUSH_SEARCH_COMPANY_LIST,
    companyList
  }
}

export function clearReduxList(types) {
  return (dispatch, getState) => {
    switch (types) {
      case 'contactSearch':
        dispatch({
          type: actionTypes.SEARCH_CONTACT_LIST,
          contactList: []
        });
        break;
      case 'companySearch':
        dispatch({
          type: actionTypes.SEARCH_COMPANY_LIST,
          companyList: []
        });
        break;
    }
  }
}



//获取联系人列表
export function getContactList(preload) {
  return (dispatch, getState) => {
    return fly.get('/bshop/contacts/list', preload||{})
      .then(res => {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        if (res.code == 0 && res.data) {
          //mock
          let records = res.data.records || []
          
          records.forEach((item)=>{
            item.show = false;
            item.touchStyle = 0;
            if (preload.keyword){ //如果存在关键词，则高亮显示
              // item.isSearch = true
              // item.name = lightKeyword(item.name, preload.keyword);
              // item.firstName = lightKeyword(item.firstName, preload.keyword);
              // item.lastName = lightKeyword(item.lastName, preload.keyword);
            }
          })

      

          if (preload.keyword || preload.tagIds) { //如果有是keyword关键词搜索，如果有tagIds是标签搜索，否则是总列表
            
            if (preload.page > 1) {
              dispatch(pushContactSearchList(records));
            } else {
              dispatch(setContactSearchList(records));
            }
          }else{
            if (preload.page > 1) {
              dispatch(pushContactList(records));
            } else {
              dispatch(setContactList(records));
            }
          }
        }
        //继续传递到页面
        return new Promise((resolve, reject)=>{
          resolve(res);
        })
      })
      .catch(err => {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        console.error(`Request Error: `, err);
      });
  }
}

export function getLabelList(preload){
  return (dispatch, getState) => {
    return fly.get('/bshop/contacts/tag/list', preload||{})
      .then(res => {
        if (res.code == 0) {
          res.data = res.data || []
          res.data.forEach((item) => {
            item.show = false;
            item.touchStyle = 0;
          })
          dispatch({
            type: actionTypes.LABEL_LIST,
            labelList: res.data
          })
        }
        //继续传递到页面
        return new Promise((resolve, reject) => {
          resolve(res);
        })
      })
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}

export function getCompanyList(preload) {
  return (dispatch, getState) => {
    return fly.get('/bshop/contacts/company/list', preload || {})
      .then(res => {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        if (res.code == 0) {
          let records = res.data.records || []
          records.forEach((item) => {
            item.show = false;
            item.touchStyle = 0;
          })

          if (preload.keyword || preload.tagIds) { //如果有是keyword关键词搜索，如果有tagIds是标签搜索，否则是总列表
            if (preload.page > 1) {
              dispatch(pushCompanySearchList(records));
            } else {
              dispatch(setCompanySearchList(records));
            }
          } else {
            if (preload.page > 1) {
              dispatch(pushCompanyList(records));
            } else {
              dispatch(setCompanyList(records));
            }
          }
        }
        //继续传递到页面
        return new Promise((resolve, reject) => {
          resolve(res);
        })
      })
      .catch(err => {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        console.error(`Request Error: `, err);
      });
  }
}

export function showEditItem (id,ifshow){
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.LIST_SHOW,
      id,
      ifshow
    });
  }
}

export function showStyleItem(id, style) {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.LIST_STYLE,
      id,
      style
    });
  }
}

export function showCompanyItem(id, style) {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.COMPANY_LIST_STYLE,
      id,
      style
    });
  }
}

export function getItem(id) {
  (dispatch, getState) => {
    let contact = getState().contact
    let itemObj = null
    contact.forEach((item)=>{
      if (item.personId == id){
        itemObj = item
      }
    })
    return itemObj
  }
}


/**
 * @params contactId contactType:0 人，1 公司
 */
export function getTimelineList(contactId,  page, socialType) {
  return (dispatch, getState) => {
      return fly.get('/bshop/contacts/timeline/list', { contactId: contactId, page: page, socialType: socialType})
      // .then(res => {
      // })
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}

/**
 * @取得公司的基本信息
 * @params companyId == contactId 
 */
export function getCompanyDetailInfo(companyId) {
  return (dispatch, getState) => {
    return fly.get('/bshop/contacts/company/detail', { companyId: companyId})
      // .then(res => {
      // })
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}


export function getContactDetailInfo(personId) {
  return (dispatch, getState) => {
    return fly.get('/bshop/contacts/person/detail', { personId: personId })
      // .then(res => {
      // })
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}

//人员添加
export function addContactUser(preload) {
  return (dispatch, getState) => {
    return fly.post('/bshop/contacts/person/add', preload||{})
  }
}
//人员删除@params contactIds[string]
export function deletContactUser(preload) {
  return (dispatch, getState) => {
    return fly.post('/bshop/contacts/person/delete', preload || {})
  }
}
//人员详情 @params personId [string]
export function detailContactUser(preload) {
  return (dispatch, getState) => {
    return fly.get('/bshop/contacts/person/detail', preload || {})
  }
}
//人员更新
export function updateContactUser(preload) {
  return (dispatch, getState) => {
    return fly.post('/bshop/contacts/person/update', preload || {})
  }
}

//公司添加
export function addContactCompany(preload) {
  return (dispatch, getState) => {
    return fly.post('/bshop/contacts/company/add', preload || {})
  }
}

//公司删除
export function deletContactCompany(preload) {
  return (dispatch, getState) => {
    return fly.post('/bshop/contacts/company/delete', preload || {})
  }
}
export function updateContactCompany(preload) {
  return (dispatch, getState) => {
    return fly.post('/bshop/contacts/company/update', preload || {})
  }
}

export function getMailInfo(preload) {
  return (dispatch, getState) => {
    return fly.get('/bshop/channel/shop/list', preload || {})
  }
}

