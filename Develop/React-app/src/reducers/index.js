import { combineReducers } from 'redux'
import authReducers from './authReducers.js'
import alertReducers from './alertReducer'
import lotteryReducer from './lotteryReducer'
export default combineReducers({
  auth: authReducers,
  alert: alertReducers,
  lottery: lotteryReducer,
})
