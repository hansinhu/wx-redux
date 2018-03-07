const { combineReducers } = require('../libs/redux.js') //引入redux接口
import more from './more.js'
import contact from './contact.js'
import home from './home.js'
import message from './message.js'

const Reducers = combineReducers({
    more,
    contact,
    home,
    message
});
export default Reducers
