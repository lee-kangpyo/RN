import {combineReducers} from 'redux';
import loginSlice from '../slices/login';
import userSlice from '../slices/user';
import configSlice from '../slices/config';
import pushSlice from '../slices/push';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  login: loginSlice.reducer,
  push: pushSlice.reducer,
  config: configSlice.reducer,
});

export default rootReducer;