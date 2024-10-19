import {createSlice} from '@reduxjs/toolkit';
import { getCurYYYYMM, getCurMonth, moveNextMonth, movePrevMonth } from '../../src/util/moment';

const initialState = {
  month:getCurMonth(),
  YYYYMM:getCurYYYYMM(),
  workResultList:[],
  workDetailResultList:[],
  //ProfitAndLoss
  monthCstPl:[],
  albaFeeList:[],
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
      if(state.YYYYMM >= data.YYYYMM) state.month = data;
    },
    setMonthCstPl(state, action){
      const customPl = action.payload.customPl || [];
      const data = action.payload.data;
      // 작업 1: a의 AMT 합계 계산
      const totalAMT = customPl.reduce((sum, item) => sum + item.AMT, 0);
      // b의 PLITCO가 '0100'인 매출과 '0900'인 손익에 AMT 추가
      data.forEach(item => {
          if (item.PLITCO === '0100' || item.PLITCO === '0900') {
              item.AMT += totalAMT;
          }
      });
      // 작업 2: PLITCO가 '01'로 시작하는 그룹의 마지막 하위 그룹 아래에 a의 항목 삽입
      const lastSubGroupIndex = data.reduce((lastIndex, item, index) => {
          if (item.PLITCO.startsWith("01")) {
              return index; // '01'로 시작하는 그룹의 마지막 인덱스를 찾는다
          }
          return lastIndex;
      }, -1);
      // 마지막 하위 그룹의 ORDBY 값을 찾기 위한 필터링
      const lastOrderBy = data
          .filter(item => item.PLITCO.startsWith("01"))
          .map(item => item.ORDBY)
          .reduce((max, val) => Math.max(max, val), 0); // 기본값을 0으로 설정
      // a의 항목을 삽입 (ORDBY 값을 마지막 + 5로 설정)
      const aWithOrderBy = customPl.map(item => ({
          ...item,
          ORDBY: lastOrderBy + 5 // ORDBY 값을 마지막 + 5로 설정
      }));
      // PLITCO가 '0100' 그룹의 마지막 하위 그룹 아래에 a를 삽입
      data.splice(lastSubGroupIndex + 1, 0, ...aWithOrderBy);
      state.monthCstPl = data;
      // console.log(data);
    },
    setAlbaFeeList(state, action){
      state.albaFeeList = action.payload.data;
    }
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setMonth, setWorkResultList, setWorkDetailResultList, prevMonth, nextMonth, setMonthCstPl, setAlbaFeeList } = rltSlice.actions

export default rltSlice;

