import {createSlice} from '@reduxjs/toolkit';
import { getPrevWeek, getWeekNumber, moveDay, moveNextWeek, movePrevWeek } from '../../src/util/moment';

const week = getPrevWeek()
const initialState = {
  token: '',
  eweek : week,
  week : week,
  weekNumber:getWeekNumber(week),
  albas:[],
  workAlbaInfo:{
    isEditing:false,
    weekNumber:0,
    userId:"",
    ymd:"",
  }
};

const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setAlba(state, action) {
      const data = action.payload.data
      const groupedData = data.reduce((result, item) => {
          const { USERID, USERNA, ...remains } = item; // USERNA를 제외한 데이터
          const id = item.USERID;
          const name = item.USERNA;
          var sumG = 0;  
          var sumS = 0;    
      
          if( remains.JOBCL == "G" ){
            sumG = remains.JOBDURE;
          }else if( remains.JOBCL == "S" ){
            sumS = remains.JOBDURE;
          }    
        
          const existingGroup = result.find((group) => group.userId === USERID);
        
          if (existingGroup) {
            existingGroup.sumG += sumG  
            existingGroup.sumS += sumS  
            existingGroup.list.push(remains);
          } else {
      
            result.push({ userId:USERID, userNa:USERNA, sumG:sumG, sumS:sumS, list: [remains] });
          }
          return result;
        }, []);
      state.albas = groupedData;
    },
    prevWeek(state, action){
      const prev = movePrevWeek(state.week);
      state.week = prev;
      state.weekNumber = getWeekNumber(prev)
    },
    nextWeek(state, action){
        if(state.eweek != state.week){
            const next = moveNextWeek(state.week);
            state.week = next;
            state.weekNumber = getWeekNumber(next)
        }
    },
    setWorkAlbaInfo(state, action){
      const data = action.payload.data;
      state.workAlbaInfo.isEditing = true;
      state.workAlbaInfo.ymd = data.ymd;
      state.workAlbaInfo.userId = data.userId;
      state.workAlbaInfo.weekNumber = data.num;
    },
    moveWeek(state, action){
      const info = state.workAlbaInfo;
      const weekNumber = info.weekNumber
      if(weekNumber < 6){
        info.weekNumber = weekNumber + 1
        info.ymd = moveDay("next", info.ymd) 
      }
    },
    disabledEditing(state, action){
      state.workAlbaInfo.isEditing = false;
    },
  
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setAlba, prevWeek, nextWeek, setWorkAlbaInfo, moveWeek, disabledEditing } = workSlice.actions

export default workSlice;