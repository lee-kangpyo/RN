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
import dailyReportSlice from '../slices/dailyReport';

const appReducer = combineReducers({
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
  dailyReport:dailyReportSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    const { push } = state;  // 현재 push 상태를 저장
    state = { push };  // 나머지 상태를 undefined로 설정하여 초기화
  }
  return appReducer(state, action);
};

export default rootReducer;