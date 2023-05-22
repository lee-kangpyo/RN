import {combineReducers} from 'redux';
import loginSlice from '../slices/login';
import userSlice from '../slices/user';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  login: loginSlice.reducer,
});

export default rootReducer;