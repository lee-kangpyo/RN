import {createSlice} from '@reduxjs/toolkit';
import { getFormattedDate, getISOFormattedDate, getStartAndEndOfWeek } from '../../src/util/moment';

const {thisSunday:start, thisSaturday:end} = getStartAndEndOfWeek();
const initialState = {
    //근무현황 페이지에서 단독실행
    reqAlbaChangeCnt:null,
    reqList:[],
};

const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    setReqAlbaChange(state, action){
      const {cnt, reqList } = action.payload;
      const changeCnt = (cnt == 0)?null:( cnt > 99)?"99+":cnt;
      state.reqAlbaChangeCnt = changeCnt;
      state.reqList = reqList;
    },
  },
});

export let { setReqAlbaChange } = ownerSlice.actions
export default ownerSlice;