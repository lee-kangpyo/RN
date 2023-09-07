import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  accessToken: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  //extraReducer는 비동기 액션 생성시 필요
  // extraReducers: builder => {},
});

//외부에서 reducer를 사용하기위해 export
export let { setUser, setName } = userSlice.actions

export default userSlice;