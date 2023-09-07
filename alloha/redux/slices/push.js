import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: '',
};

const pushSlice = createSlice({
  name: 'push',
  initialState,
  reducers: {
    setToken(state, action) {
        state.token = action.payload;
    },
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setToken } = pushSlice.actions

export default pushSlice;