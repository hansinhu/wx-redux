const fly = require('../utils/fly.js').default;

//获取message列表 getMessageDetail
export function getMessageDetail(params) {
  return (dispatch, getState) => {
    return fly.post('/bshop/inbox/mail/detail', params || {})
      .catch(err => {
        console.error(`Request Error: `, err);
      });
  }
}
//获取邮件附件
export function getDetailAttachment(params) {
  return (dispatch, getState) => {
    return fly.post('/bshop/inbox/mail/get/attachment', params || {})
      .then(res => {
        if (res.code == 0) { }
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
export function senMessage(params) {
  return (dispatch, getState) => {
    return fly.post('/bshop/mail/send/send', params || {}).then(res => {
      if (res.code == 0) {

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
