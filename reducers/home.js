
import { actionTypes } from '../actions/home.js'

const home = (state = {
    actionList: [],
    isEmpty: false,
    noMore: false,
    loading: false,
}, action) => {
    switch (action.type) {
        case actionTypes.ACTION_LIST:
            return Object.assign({}, state, {
                actionList: state.actionList.concat(action.actionList || []) 
            });
        case actionTypes.IS_EMPTY:
            return Object.assign({}, state, {
                isEmpty: action.isEmpty
            });
        case actionTypes.NO_MORE:
            return Object.assign({}, state, {
                noMore: action.noMore
            });
        case actionTypes.SET_LOADING:
            return Object.assign({}, state, {
                loading: action.loading
            });
        case actionTypes.EMPTY_LIST:
            return Object.assign({}, state, {
                actionList: action.actionList
            });
        default:
            return state
    }
};

export default home;