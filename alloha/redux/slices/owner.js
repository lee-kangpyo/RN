import {createSlice} from '@reduxjs/toolkit';
import { getFormattedDate, getISOFormattedDate, getStartAndEndOfWeek } from '../../src/util/moment';

const {thisSunday:start, thisSaturday:end} = getStartAndEndOfWeek();
const initialState = {
    //근무현황 페이지에서 단독실행
    reqAlbaChangeCnt:null,
};

const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    setReqAlbaChangeCnt(state, action){
      const cnt = action.payload.cnt;
      if(cnt == 0){
        state.reqAlbaChangeCnt = null;
      }else if( cnt > 99){
        state.reqAlbaChangeCnt = "99+";
      }else{
        state.reqAlbaChangeCnt = cnt;
      }
    },
  },
});

export let { setReqAlbaChangeCnt } = ownerSlice.actions
export default ownerSlice;