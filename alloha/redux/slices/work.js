import {createSlice} from '@reduxjs/toolkit';
import { getCurWeek, getWeekNumber, moveDay, moveNextWeek, movePrevWeek } from '../../src/util/moment';

const week = getCurWeek()
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
    userNa:"",
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
      const workAlbaInfo = state.workAlbaInfo
      workAlbaInfo.isEditing = true;
      workAlbaInfo.ymd = data.ymd;
      workAlbaInfo.userId = data.userId;
      workAlbaInfo.userNa = data.userNa
      workAlbaInfo.weekNumber = data.num;
    },
    moveWeek(state, action){
      const info = state.workAlbaInfo;
      const weekNumber = info.weekNumber
      if(weekNumber < 6){
        info.weekNumber = weekNumber + 1
        info.ymd = moveDay("next", info.ymd) 
      }else{
        const idList = state.albas.map(item => item.userId);
        const naList = state.albas.map(item => item.userNa);
        const userId = info.userId;
        const idx = idList.indexOf(userId);
        if(idx !== -1 && idx <idList.length - 1){
          info.userId = idList[idx + 1];
          info.userNa = naList[idx + 1];
          info.weekNumber = 0;
          info.ymd = state.week.replace(/-/g, '');;
        }
      }
    },
    moveWeekDown(state, action){
      const info = state.workAlbaInfo;
      const weekNumber = info.weekNumber;
      const albas = state.albas;
      const curIndex = albas.findIndex(item => item.userId === info.userId);
      const target = albas[curIndex+1];
      if(target){
        info.userId = target.userId;
        info.userNa = target.userNa;
      }
    },
    disabledEditing(state, action){
      state.workAlbaInfo.isEditing = false;
    },
  
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setAlba, prevWeek, nextWeek, setWorkAlbaInfo, moveWeekDown, disabledEditing } = workSlice.actions

export default workSlice;