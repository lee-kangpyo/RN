import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLogin:false,
  userId:"",
};
const loginSlice = createSlice({
  name: 'isLogin',
  initialState,
  reducers: {
    setLogin(state, action){
        state.isLogin = action.payload
    },
    setUserId(state, action){
        state.userId = action.payload
    },
    setUserInfo(state, action){
      state.isLogin = action.payload.isLogin
      state.userId = action.payload.userId
    }
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setLogin, setUserId, setUserInfo } = loginSlice.actions

export default loginSlice;