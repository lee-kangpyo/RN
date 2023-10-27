import {createSlice} from '@reduxjs/toolkit';
import { getNextWeek, getWeekNumber, movePrevWeek, moveNextWeek } from '../../src/util/moment';

const week = getNextWeek()

const initialState = {
  cstCo:"",
  storeList:[],
  // 시간표
  week : week,
  weekNumber:getWeekNumber(week),
  albas: [
        {
            name:"이하나", 
            sum:"14.0",
            sumSub:"1.5",
            list:[
                {"day":"1022", "txt":"-", "subTxt":""},
                {"day":"1023", "txt":"3.5", "subTxt":""},
                {"day":"1024", "txt":"3.5", "subTxt":""},
                {"day":"1025", "txt":"3.5", "subTxt":"1.5"},
                {"day":"1026", "txt":"3.5", "subTxt":""},
                {"day":"1027", "txt":"-", "subTxt":""},
                {"day":"1028", "txt":"-", "subTxt":""},        
            ]
        },
        {
            name:"갑을병", 
            sum:"14.0",
            sumSub:"",
            list:[
                {"day":"1022", "txt":"-", "subTxt":""},
                {"day":"1023", "txt":"4.0", "subTxt":""},
                {"day":"1024", "txt":"3.5", "subTxt":""},
                {"day":"1025", "txt":"3.5", "subTxt":""},
                {"day":"1026", "txt":"3.5", "subTxt":""},
                {"day":"1027", "txt":"-", "subTxt":""},
                {"day":"1028", "txt":"-", "subTxt":""},        
            ]
        },
    ],
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
        state.albas = action.payload;
    },
    prevWeek(state, action){
        console.log("prevWeek");
        const prev = movePrevWeek(state.week);
        state.week = prev;
        state.weekNumber = getWeekNumber(prev)
    },
    nextWeek(state, action){
        const next = moveNextWeek(state.week);
        state.week = next;
        state.weekNumber = getWeekNumber(next)
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
        state.cstCo = action.payload.storeList[0].CSTCO;
    }

  },
});

//외부에서 reducer를 사용하기위해 export
export let { setAlba, prevWeek, nextWeek, onTabCheckTIme, initTimeBox, setScheduleCstCo, setScheduleStoreList } = scheduleSlice.actions

export default scheduleSlice;