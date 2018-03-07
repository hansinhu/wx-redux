import { actionTypes } from '../actions/message.js'

const message = (state = {
  messageList: [],
  loading: false,
  noSearch: false
}, action) => {
  switch (action.type) {
    case actionTypes.MESSAGE_LIST:
      return Object.assign({}, state, {
        messageList: action.messageList
      });
    case actionTypes.PUSH_MESSAGE_LIST:
      let list = state.messageList.concat(action.messageList);
      return Object.assign({}, state, {
        messageList: list
      });
    case actionTypes.SET_LOADING:
      return Object.assign({}, state, {
        loading: action.loading
      });
    case actionTypes.NO_SEARCH:
        return Object.assign({}, state, {
            noSearch: action.noSearch
        });
    default:
      return state
  }
};

export default message;
