import {combineReducers} from 'redux';
import loginSlice from '../slices/login';
import userSlice from '../slices/user';
import configSlice from '../slices/config';
import pushSlice from '../slices/push';
import scheduleSlice from '../slices/schedule';
import workSlice from '../slices/work';
import commonSlice from '../slices/common';
import rltSlice from '../slices/result';
import albaSlice from '../slices/alba';
import ownerSlice from '../slices/owner';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  login: loginSlice.reducer,
  push: pushSlice.reducer,
  config: configSlice.reducer,
  schedule: scheduleSlice.reducer,
  work: workSlice.reducer,
  common:commonSlice.reducer,
  result:rltSlice.reducer,
  alba:albaSlice.reducer,
  owner:ownerSlice.reducer,
});

export default rootReducer;