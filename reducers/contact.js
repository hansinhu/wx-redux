
import { actionTypes } from '../actions/contact.js'

const contact = (state = {
  contactList:[],
  contactSearchList:[],
  labelList:[],
  companyList: [],
  companySearchList: [],
}, action) => {
  switch (action.type) {
    case actionTypes.CONTACT_LIST:
      return Object.assign({}, state, {
        contactList: action.contactList
      });
    case actionTypes.PUSH_CONTACT_LIST:
      let pusharr = state.contactList.concat(action.contactList)
      return Object.assign({}, state, {
        contactList: pusharr
      });
    case actionTypes.SEARCH_CONTACT_LIST:
      return Object.assign({}, state, {
        contactSearchList: action.contactList
      });
    case actionTypes.PUSH_SEARCH_CONTACT_LIST:
      let pushSearchArr = state.contactSearchList.concat(action.contactList)
      return Object.assign({}, state, {
        contactSearchList: pushSearchArr
      });
    case actionTypes.LABEL_LIST:
      return Object.assign({}, state, {
        labelList: action.labelList
      });
    case actionTypes.COMPANY_LIST:
      return Object.assign({}, state, {
        companyList: action.companyList
      });
    case actionTypes.PUSH_COMPANY_LIST:
      let pushCompanyArr = state.companyList.concat(action.companyList)
      return Object.assign({}, state, {
        companyList: pushCompanyArr
      });
    case actionTypes.SEARCH_COMPANY_LIST:
      return Object.assign({}, state, {
        companySearchList: action.companyList
      });
    case actionTypes.PUSH_SEARCH_COMPANY_LIST:
      let pushSearcCompanyArr = state.companySearchList.concat(action.companyList)
      return Object.assign({}, state, {
        companySearchList: pushSearcCompanyArr
      });
    case actionTypes.LIST_SHOW:
      let list = state.contactList;
      list.forEach((item)=>{
        if (item.personId == action.id){
          item.show = action.ifshow
        }
      })
      return Object.assign({}, state, {
        contactList: list
      });
    case actionTypes.LIST_STYLE:
      let arr = state.contactList;
      arr.forEach((item) => {
        if (item.personId == action.id) {
          item.touchStyle = action.style
        }
      })
      return Object.assign({}, state, {
        contactList: arr
      });
    case actionTypes.COMPANY_LIST_STYLE:
      let companyArr = state.companyList;
      companyArr.forEach((item) => {
        if (item.companyId == action.id) {
          item.touchStyle = action.style
        }
      })
      return Object.assign({}, state, {
        companytList: companyArr
      });
    default:
      return state
  }
};

export default contact;