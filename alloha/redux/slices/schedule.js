import {createSlice} from '@reduxjs/toolkit';

const initialState = {
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
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setAlba(state, action) {
        state.albas = action.payload;
    },
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setAlba } = scheduleSlice.actions

export default scheduleSlice;