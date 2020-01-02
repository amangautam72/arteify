import { combineReducers } from 'redux'

import loginReducer from './loginReducer'
import registerReducer from './registerReducer'
import postDataReducer from './postDataReducer'
import fetchDataReducer from './fetchDataReducer'

const rootReducer = combineReducers({
    loginReducer,
    registerReducer,
    postDataReducer,
    fetchDataReducer
})


export default rootReducer