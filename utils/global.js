//获取SESSION
export const getStorageSession = (str) => {
    let headerStorage = str.split(';');
    let token;
    for (let i = 0; i < headerStorage.length; i++) {
        if (headerStorage[i].indexOf('SESSION') > -1) {
            token = headerStorage[i].split('=')[1]
        }
    }
    return token
};

//时间类型转换
export const formatDate = (dateTime,typeName) => {
    let date = new Date(dateTime);
    let Y = date.getFullYear() + '.';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

    let date2 = new Date();
    let Y2 = date2.getFullYear() + '.';
    let M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + '.';
    let D2 = (date2.getDate() < 10 ? '0' + (date2.getDate()) : date2.getDate()) + ' ';
    if (Y == Y2 && M == M2 && D == D2 && typeName != 1) {
        return h + m + s;
    } else {
        return Y + M + D + h + m + s;
    }
    
    // var datetimes;
    // if (isNaN(Date.parse(dateTime))) {
    //   datetimes = new Date(Date.parse(dateTime.replace(/-/g, '/').replace(/T/g, '')));
    // } else {
    //   datetimes = new Date(Date.parse(dateTime))
    // }
    // return datetimes;
};
export const formatDate2 = (dateTime, typeName) => {
  let date = new Date(dateTime);
  let Y = date.getFullYear() + '/';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())  ;
  let s = ':'+ (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

  let date2 = new Date();
  let Y2 = date2.getFullYear() + '/';
  let M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + '/';
  let D2 = (date2.getDate() < 10 ? '0' + (date2.getDate()) : date2.getDate()) + ' ';


  if (Y == Y2 && M == M2 && D == D2) {
    return h + m ;
  } else {
    return Y + M + D + h + m ;
  }

};

//转化毫秒数
export const formatSecond = (s) => {
  let t;
  if (s > -1) {
    let hour = Math.floor(s / 3600);
    let min = Math.floor(s / 60) % 60;
    let sec = s % 60;
    if (hour < 10) {
      t = '0' + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) { t += "0"; }
    t += min + ":";
    if (sec < 10) { t += "0"; }
    t += sec;
  }
  return t;
} 

//高亮转换
export const lightKeyword = (str, keyword) =>{
  if (!keyword || !str){
    return str || '';
  }
  //(red|blue|green)查找任何指定的选项。i对大小写不敏感匹配。g全局匹配。
  var reg = new RegExp("(" + keyword + ")", "ig"); 
  str = str.replace(reg, function (word) {
    return "<text class='light-keyword'>" + word + "</text>"
    }
  );
  return str;
}