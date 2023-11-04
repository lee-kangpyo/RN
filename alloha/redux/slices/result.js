import {createSlice} from '@reduxjs/toolkit';
import { getNextMonth, getPrevMM, getPrevMonth, moveNextMonth, movePrevMonth } from '../../src/util/moment';

const initialState = {
  month:getPrevMonth(),
  MM:getPrevMM(),
  workResultList:[],
  workDetailResultList:[],
};

const rltSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setMonth(state, action){
      state.month = action.payload.data;
    },
    setWorkResultList(state, action){
      state.workResultList = action.payload.data
    },
    setWorkDetailResultList(state, action){
      state.workDetailResultList = action.payload.data
    },
    prevMonth(state, action){
      const data = movePrevMonth(state.month);
      state.month = data;
    },
    nextMonth(state, action){
      const data = moveNextMonth(state.month)
      if(state.MM >= data.mm) state.month = data;
    },
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setMonth, setWorkResultList, setWorkDetailResultList, prevMonth, nextMonth } = rltSlice.actions

export default rltSlice;