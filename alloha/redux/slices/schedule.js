import {createSlice} from '@reduxjs/toolkit';
import { getNextWeek, getWeekNumber, movePrevWeek, moveNextWeek, getDayWeekNumber, moveDay } from '../../src/util/moment';

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
    // 수정사항
    scheduleAlbaInfo:{
      isEditing:false,
      weekNumber:0,
      userId:"",
      userNa:"",
      ymd:"",
      sTime:"07:00",
      jobDure:0,
      jobCl:"2"
    }
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
            var sumN = 0;    
        
            if( remains.JOBCL == "G" ){
              sumG = remains.JOBDURE;
            }else if( remains.JOBCL == "S" ){
              sumS = remains.JOBDURE;
            }else {
              sumN = remains.JOBDURE;
            }   
          
            const existingGroup = result.find((group) => group.userId === USERID);
          
            if (existingGroup) {
              existingGroup.sumG += sumG  
              existingGroup.sumS += sumS  
              existingGroup.sumN += sumN  
              existingGroup.list.push(remains);
            } else {
        
              result.push({ userId:USERID, userNa:USERNA, sumG:sumG, sumS:sumS, sumN:sumN, list: [remains] });
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
        const value = (obj.val == 1)?0:1;
        state.timeBox[obj.x][obj.y] = value;
        if(value == 1){
            state.totalTime = state.totalTime + 0.5
        }else{
            state.totalTime = state.totalTime - 0.5
        }

        //const obj = action.payload;
        //const value = (obj.val == 2)?0:obj.val+1;
        // if(value == 1){
        //     state.totalTime = state.totalTime + 0.5
        // }else if (value == 2){
        //     state.totalTime = state.totalTime - 0.5
        //     state.totalCoverTime = state.totalCoverTime + 0.5
        // }else{
        //     state.totalCoverTime = state.totalCoverTime - 0.5
        // }
    },
    initTimeBox(state, action){
        state.totalTime = 0;
        state.totalCoverTime = 0;
        state.timeBox = new Array(48).fill(null).map(() => [0, 0, 0, 0, 0, 0, 0]);
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

    },
    setScheduleAlbaInfo(state, action){
      const data = action.payload.data;
      const scheduleAlbaInfo = state.scheduleAlbaInfo
      scheduleAlbaInfo.isEditing = true;
      scheduleAlbaInfo.ymd = data.ymd;
      scheduleAlbaInfo.userId = data.userId;
      scheduleAlbaInfo.userNa = data.userNa
      scheduleAlbaInfo.weekNumber = data.num;
      scheduleAlbaInfo.sTime = data.sTime //(data.sTime)?data.sTime:"07:00";
      scheduleAlbaInfo.jobDure = data.jobDure;
      scheduleAlbaInfo.jobCl = data.jobCl;
    },
    setscheduleAlbaSTime(state, action){
      const data = action.payload.data;
      state.scheduleAlbaInfo.sTime = data;
    },
    setScheduleAlbaIdName(state,action){
      const data = action.payload.data;
      const scheduleAlbaInfo = state.scheduleAlbaInfo
      scheduleAlbaInfo.userId = data.userId;
      scheduleAlbaInfo.userNa = data.userNa;
      scheduleAlbaInfo.sTime = "07:00";
      scheduleAlbaInfo.jobDure = 0;
      scheduleAlbaInfo.jobCl = "2";
    },
    moveWeek(state, action){
      const info = state.scheduleAlbaInfo;
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
      const day = state.albas.filter(users => users.userId == info.userId)[0].list.filter(day => day.YMD == info.ymd)
      info.sTime = (day.length > 0)?day[0].STARTTIME:"07:00"
    },
    moveWeekDown(state, action){
      console.log("moveWeekDown");
      const info = state.scheduleAlbaInfo;
      const albas = state.albas;
      const curIndex = albas.findIndex(item => item.userId === info.userId);
      const target = (albas.length == curIndex+1)?albas[curIndex]:albas[curIndex+1];
      if(target){
        info.userId = target.userId;
        info.userNa = target.userNa;
        const targetDay = target.list.find((day)=> day.jobCl != "G" && day.jobCl != "S" && day.YMD == info.ymd);
        if(targetDay){
          info.sTime=targetDay.STARTTIME;
          info.jobDure = targetDay.JOBDURE;
          info.jobCl = targetDay.JOBCL;
        }else{
          info.sTime="07:00";
          info.jobDure=0;
          info.jobCl="2";
        }
      }
    },
    disabledEditing(state, action){
      state.scheduleAlbaInfo.isEditing = false;
    },
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setAlba, prevWeek, nextWeek, onTabCheckTIme, initTimeBox, setAlbaList, updateTimeBox, setScheduleAlbaInfo, setScheduleAlbaIdName, moveWeek, moveWeekDown, disabledEditing, setscheduleAlbaSTime } = scheduleSlice.actions

export default scheduleSlice;

  