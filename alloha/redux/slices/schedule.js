import {createSlice} from '@reduxjs/toolkit';
import { getNextWeek, getWeekNumber, movePrevWeek, moveNextWeek, getDayWeekNumber } from '../../src/util/moment';

const week = getNextWeek()

const initialState = {
    albaList:[],
    cstCo:"",
    storeList:[],
    // 시간표
    
    eweek : week,
    week : week,
    weekNumber:getWeekNumber(week),
    albas: [],
    // 시간표 일별 등록
    timeBox:new Array(48).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]),
    totalTime:0.0,
    totalCoverTime:0.0,
};

const scheduleSlice = createSlice({
  name: 'schedule',
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

    onTabCheckTIme(state, action){
        const obj = action.payload;
        const value = (obj.val == 2)?0:obj.val+1;
        state.timeBox[obj.x][obj.y] = value;
        if(value == 1){
            state.totalTime = state.totalTime + 0.5
        }else if (value == 2){
            state.totalTime = state.totalTime - 0.5
            state.totalCoverTime = state.totalCoverTime + 0.5
        }else{
            state.totalCoverTime = state.totalCoverTime - 0.5
        }
    },
    initTimeBox(state, action){
        state.totalTime = 0;
        state.totalCoverTime = 0;
        state.timeBox = new Array(48).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]);
    },
    setScheduleCstCo(state, action){
      state.cstCo = action.payload.cstCo;
    },
    setScheduleStoreList(state, action){
        state.storeList = action.payload.storeList;
        if(state.cstCo == ""){
          state.cstCo = action.payload.storeList[0].CSTCO;
        }
        
    },
    setAlbaList(state, action){
        state.albaList = action.payload.albaList;
    },
    updateTimeBox(state,action){
      const data = action.payload.data;
      const array = new Array(48).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]);
      var time = 0.0;
      var cTime = 0.0;

      data.forEach(item => {
        if(item.JOBCL == "G"){
          time += item.JOBDURE
        }else if (item.JOBCL == "S"){
          cTime += item.JOBDURE
        }
        const dayIndex = getDayWeekNumber(item.YMD);
        const startHour = parseInt(item.STARTTIME.split(':')[0], 10);
        const startMinute = parseInt(item.STARTTIME.split(':')[1], 10);
        const endHour = parseInt(item.ENDTIME.split(':')[0], 10);
        const endMinute = parseInt(item.ENDTIME.split(':')[1], 10);

        let startIndex = (startHour * 2) + (startMinute === 30 ? 1 : 0);
        const endIndex = (endHour * 2) + (endMinute === 30 ? 1 : 0);

        for (let i = startIndex; i < endIndex; i++) {
            array[i][dayIndex] = item.JOBCL === 'S' ? 2 : 1;
        }
    });
    state.timeBox = array;
    state.totalTime = time;
    state.totalCoverTime = cTime;

    // 결과 출력
    //array.forEach(row => {
    //    console.log(row);
    //});

    }
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setAlba, prevWeek, nextWeek, onTabCheckTIme, initTimeBox, setScheduleCstCo, setScheduleStoreList, setAlbaList, updateTimeBox } = scheduleSlice.actions

export default scheduleSlice;

  