import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    //일일 보고서
    reqAlbaChangeCnt:null,
    issueCnt:0,
};

const dailyReportSlice = createSlice({
  name: 'dailyReport',
  initialState,
  reducers: {
    setIssueCnt(state, action){
      const { cnt } = action.payload;
      state.issueCnt = cnt;
    },
  },
});

export let { setIssueCnt } = dailyReportSlice.actions;
export default dailyReportSlice;