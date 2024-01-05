import {createSlice} from '@reduxjs/toolkit';
import { getFormattedDate, getISOFormattedDate, getStartAndEndOfWeek } from '../../src/util/moment';

const {thisSunday:start, thisSaturday:end} = getStartAndEndOfWeek();
const initialState = {
    //근무현황 페이지에서 단독실행
    sCstCo:-1,
    selectedStore:{},
    myStores:[],
    //날짜 체크는 근무정보에서 사용
    date: { start:start, end:end },
};

const albaSlice = createSlice({
  name: 'alba',
  initialState,
  reducers: {
    setMyStores(state, action){
        state.myStores = action.payload.data;
    },
    setSelectedStore(state, action){
        const selectedStore = action.payload.data;
        state.selectedStore = selectedStore;
        state.sCstCo = selectedStore.CSTCO;
    },
    prevWeek(state, action){
      const date = state.date
      const startDate = new Date(getISOFormattedDate(date.start));
      const endDate = new Date(getISOFormattedDate(date.end));
      startDate.setDate(startDate.getDate() - 7);
      endDate.setDate(endDate.getDate() - 7);
      state.date = {
          start: getFormattedDate(startDate),
          end: getFormattedDate(endDate)
      };
    },
    nextWeek(state, action){
      const date = state.date
      const startDate = new Date(getISOFormattedDate(date.start));
      const endDate = new Date(getISOFormattedDate(date.end));
      startDate.setDate(startDate.getDate() + 7);
      endDate.setDate(endDate.getDate() + 7);
      state.date = {
          start: getFormattedDate(startDate),
          end: getFormattedDate(endDate)
      };
    },
    currentWeek(state, action){
      const { thisSunday:start, thisSaturday:end } = getStartAndEndOfWeek();
      state.date = { start:start, end:end };
    },
  },
});

export let { setMyStores, setSelectedStore, prevWeek, nextWeek, currentWeek } = albaSlice.actions
export default albaSlice;